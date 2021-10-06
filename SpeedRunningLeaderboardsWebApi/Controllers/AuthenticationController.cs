using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using StackExchange.Redis;
using SpeedRunningLeaderboards.Repositories;
using SpeedRunningLeaderboards.Models;
using System.Text.Json.Serialization;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record AccessTokenResponse(string access_token, string token_type, int expires_in, string refresh_token);
	[Route("api/[controller]")]
	[ApiController]
	public class AuthenticationController : ControllerBase
	{

		private readonly ILogger _logger;
		private readonly IHttpClientFactory _clientFactory;
		private readonly IConfiguration _configuration;
		private readonly ConnectionMultiplexer _redis;
		private readonly RunnerRepository _runnerRepository;
		private readonly Secrets secrets;
		public AuthenticationController(ILogger<AuthenticationController> logger, IHttpClientFactory clientFactory, IConfiguration configuration, SecretsLoader loader, ConnectionMultiplexer redis, RunnerRepository runnerRepository)
		{
			_logger = logger;
			_clientFactory = clientFactory;
			_configuration = configuration;
			_redis = redis;
			_runnerRepository = runnerRepository;
			secrets = loader.GetSecrets();
		}
		private AccessTokenResponse GetAccessToken(string code)
		{
			using(var client = _clientFactory.CreateClient()) {
				var request = new HttpRequestMessage(HttpMethod.Post, _configuration.GetSection("OAUTH_TOKEN_URL").Value);
				IDictionary<string, string> formData = new Dictionary<string, string>
				{
					{ "client_id", _configuration.GetSection("CLIENT_ID").Value },
					{ "client_secret", secrets.CLIENT_SECRET },
					{ "grant_type", "authorization_code" },
					{ "code", code },
					{ "redirect_uri", _configuration.GetSection("REDIRECT_URI").Value }
				};
				request.Content = new FormUrlEncodedContent(formData);
				request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
				var response = client.Send(request);
				if(response.IsSuccessStatusCode) {
					_logger.LogInformation("OAuth Access Request successful!");
					using var responseStream = new StreamReader(response.Content.ReadAsStream());
					return JsonSerializer.Deserialize<AccessTokenResponse>(responseStream.ReadToEnd());
				} else {
					throw new Exception("OAuth Access Request Failed!");
				}
			}
		}
		[HttpGet]
		public RedirectResult OAuthRedirect([FromQuery] string code)
		{
			var token = GetAccessToken(code);
			var runner = GetRunner(token);
			var db = _redis.GetDatabase();
			var expire = new TimeSpan(0, 0, token.expires_in);
			db.StringSet(runner.RunnerID.ToString(), token.access_token, expire);
			HttpContext.Response.Cookies.Append("session-id", runner.RunnerID.ToString(), new CookieOptions() {
				Secure = true,
				IsEssential = true,
				HttpOnly = false,
				MaxAge = expire,
				SameSite = SameSiteMode.Lax
			});
			return Redirect(_configuration.GetSection("APP_REDIRECT_URI").Value);
		}

		private Runner GetRunner(AccessTokenResponse token)
		{
			using(var client = _clientFactory.CreateClient()) {
				var request = new HttpRequestMessage(HttpMethod.Get, $"{_configuration.GetSection("DISCORD_ENDPOINT").Value}/users/@me");
				request.Headers.Authorization = new AuthenticationHeaderValue(token.token_type, token.access_token);
				var response = client.Send(request);
				if(response.IsSuccessStatusCode) {
					using var responseStream = new StreamReader(response.Content.ReadAsStream());
					var discordUser = JsonSerializer.Deserialize<DiscordLogin>(responseStream.ReadToEnd(), new JsonSerializerOptions()
					{
						PropertyNameCaseInsensitive = true,
						NumberHandling = JsonNumberHandling.WriteAsString
					}); ;
					try {
						return _runnerRepository.GetByDiscordLoginID(discordUser.DiscordLoginID);
					} catch(InvalidOperationException) {
						var runner = new Runner(discordUser, null, DateTime.Now, new List<Authority>(), new List<Social>());
						return _runnerRepository.Create(runner);
					}
				} else {
					throw new Exception("Getting Current Discord User Request Failed!");
				}
			}
		}
	}
}
