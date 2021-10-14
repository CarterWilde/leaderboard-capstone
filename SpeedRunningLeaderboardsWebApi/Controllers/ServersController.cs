using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

using StackExchange.Redis;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record CreateServerDTO(string Name, string Icon, IEnumerable<Runner>? Members, IEnumerable<Game>? Games);
	public record CodeOptions([property:JsonPropertyName("expires_in")]int? ExpiresIn, int? Uses);

	[Route("api/[controller]")]
	[ApiController]
	public class ServersController : ControllerBase
	{
		private readonly ServerRepository _repo;
		private readonly ConnectionMultiplexer _redis;
		public ServersController(ServerRepository repo, ConnectionMultiplexer redis)
		{
			_repo = repo;
			_redis = redis;
		}

		[HttpGet]
		public IActionResult GetServers()
		{
			return Ok(_repo.Get());
		}
		[HttpGet("@me")]
		public IActionResult GetMyServers()
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				return Ok(_repo.GetUserServers(runner.RunnerID));
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpPut("{serverId}/generate-code")]
		public IActionResult GetInviteCode(Guid serverId, [FromBody] CodeOptions options)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
					if(runner.RunnerID == _repo.Get(serverId).Owner) {
						var db = _redis.GetDatabase();
						string code = GenerateCode(serverId);
						while(db.KeyExists(code)) {
							code = GenerateCode(serverId);
						}
						var entries = new List<HashEntry> { new HashEntry("serverId", serverId.ToString()) };
						if(options.Uses is int uses) {
							entries.Add(new HashEntry("uses", uses));
						}
						db.HashSet(code, entries.ToArray());
						if(options.ExpiresIn is int expires) {
							var expire = new TimeSpan(0, 0, expires);
							db.KeyExpire(code, expire);

						}
						return Ok(code);
					} else {
						return StatusCode(StatusCodes.Status403Forbidden);
					}
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpPut("join/{code}")]
		public IActionResult JoinWithCode(string code)
		{

			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				var db = _redis.GetDatabase();
				if(db.KeyExists(code)) {
					var serverId = db.HashGet(code, "serverId");
					if(serverId.IsNull) {
						return StatusCode(StatusCodes.Status500InternalServerError);
					}
					var serverGuid = Guid.Parse(serverId);
					var server = _repo.Get(serverGuid);
					if(!server.Members.Contains(runner) && server.Owner != runner.RunnerID) {
						_repo.AddMember(serverGuid, runner.RunnerID);
						RedisValue uses = db.HashGet(code, "uses");
						if(uses.HasValue) {
							if(uses.IsInteger) {
								DecrementUses(db, code, (int)uses);
							} else {
								DecrementUses(db, code, int.Parse(uses));
							}
						}
					}
					return Ok((string)serverId);
				}
				return StatusCode(StatusCodes.Status404NotFound);
			}
			return userResult ?? throw new Exception("Result expected!");
		}

		public static void DecrementUses(IDatabase db, string code, int uses)
		{
			if(uses != -1) {
				db.HashSet(code, "uses", uses - 1);
				if(uses - 1 <= 0) {
					db.KeyDelete(code);
				}
			}
		}

		private static int CodeIteration = 0;

		private string GenerateCode(Guid serverId)
		{
			string result = string.Empty;
			var now = DateTime.Now;
			result += now.Day;
			result += now.Second;
			var guidBytes = serverId.ToByteArray();
			result += guidBytes[^1];
			result += CodeIteration++;
			Random gen = new Random();
			result += gen.Next(10);
			return result;
		}

		[HttpPost]
		public IActionResult CreateServer([FromBody] CreateServerDTO serverDto)
		{
			if(HttpContext.Items["RunnerSession"] is SessionRunner session) {
				if(session.Runner != null) {
					_repo.Create(new Server(
						Guid.NewGuid(),
						serverDto.Name,
						serverDto.Icon,
						session.Runner.RunnerID,
						serverDto.Members ?? new List<Runner>(),
						serverDto.Games ?? new List<Game>()
					));
					return Ok();
				} else {
					return StatusCode(StatusCodes.Status401Unauthorized);
				}
			} else {
				return StatusCode(StatusCodes.Status401Unauthorized);
			}
		}
	}
}
