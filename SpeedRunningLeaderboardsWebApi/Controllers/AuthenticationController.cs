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
		private readonly Secrets secrets;
		public AuthenticationController(ILogger<AuthenticationController> logger, IHttpClientFactory clientFactory, IConfiguration configuration, SecretsLoader loader)
		{
			_logger = logger;
			_clientFactory = clientFactory;
			_configuration = configuration;
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
			GetAccessToken(code);
			return Redirect(_configuration.GetSection("APP_REDIRECT_URI").Value);
		}
	}
}
