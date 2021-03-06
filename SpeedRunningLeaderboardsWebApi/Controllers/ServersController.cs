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
	public record RunDTO(int RunTime, string VideoUrl, IList<ColumnValueDTO> Values);
	public record CreateServerDTO(string Name, string Icon, IEnumerable<Runner>? Members, IEnumerable<Game>? Games);
	public record CodeOptions([property: JsonPropertyName("expires_in")] int? ExpiresIn, int? Uses);
	public record VerificationBody(bool isAccepted);

	[Route("api/[controller]")]
	[ApiController]
	public class ServersController : ControllerBase
	{
		private readonly ServerRepository _repo;
		private readonly GameRepository _gameRepo;
		private readonly ChatRepository _chatRepo;
		private readonly ConnectionMultiplexer _redis;
		public ServersController(ServerRepository repo, ConnectionMultiplexer redis, GameRepository gameRepo, ChatRepository chatRepository)
		{
			_repo = repo;
			_gameRepo = gameRepo;
			_chatRepo = chatRepository;
			_redis = redis;
		}
		[HttpPut("/api/verify-run/{runId}")]
		public IActionResult VerifyRun(Guid runId, [FromBody] VerificationBody body)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				_repo.VerifyRun(runner.RunnerID, runId, body.isAccepted);
				return Ok();
			}
			return userResult ?? throw new Exception("Result expected!");
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
				var servers = _repo.GetUserServers(runner.RunnerID);
				foreach(var server in servers) {
					server.Games = _gameRepo.GetServerGames(server.ServerID);
					server.Chats = _chatRepo.GetServerChats(server.ServerID);
				}
				return Ok(servers);
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpGet("{serverId}/runs/verification")]
		public IActionResult GetVerificationRuns(Guid serverId)
		{
			return Ok(_gameRepo.GetVerficationRuns(serverId));
		}
		[HttpPut("{serverId}")]
		public IActionResult UpdateServer(Guid serverId, [FromBody] Server entity)
		{
			entity.ServerID = serverId;
			_repo.Update(entity);
			return Ok();
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
		[HttpGet("join/{code}")]
		public IActionResult JoinLink()
		{
			return Redirect("");
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

		[HttpPut("{serverId}/games/add/{gameId}")]
		public IActionResult AddGame(Guid serverId, Guid gameId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				if(runner.RunnerID == _repo.Get(serverId).Owner) {
					_repo.AddGame(serverId, gameId);
					return Ok();
				}
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpPut("{serverId}/games/remove/{gameId}")]
		public IActionResult RemoveGame(Guid serverId, Guid gameId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				if(runner.RunnerID == _repo.Get(serverId).Owner) {
					_repo.RemoveGame(serverId, gameId);
					return Ok();
				}
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpPut("{serverId}/games/{gameId}/{rulesetId}/runs/add")]
		public IActionResult AddRun(Guid serverId, Guid gameId, Guid rulesetId, [FromBody] RunDTO data)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				_repo.AddRun(runner.RunnerID, serverId, gameId, rulesetId, data.RunTime, data.VideoUrl, data.Values.ToArray());
				return Ok();
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		[HttpPut("{serverid}/games/{gameId}/mods/add/{runnerId}")]
		public IActionResult AddMod(Guid serverId, Guid gameId, Guid runnerId)
		{
			_repo.AddModerator(serverId, runnerId, gameId);
			return Ok();
		}
		[HttpPost]
		public IActionResult CreateServer([FromBody] CreateServerDTO serverDto)
		{
			if(HttpContext.Items["RunnerSession"] is SessionRunner session) {
				if(session.Runner != null) {
					var server = _repo.Create(new Server(
						Guid.NewGuid(),
						serverDto.Name,
						serverDto.Icon,
						session.Runner.RunnerID,
						serverDto.Members ?? new List<Runner>(),
						serverDto.Games ?? new List<Game>()
					));
					return Ok(server);
				} else {
					return StatusCode(StatusCodes.Status401Unauthorized);
				}
			} else {
				return StatusCode(StatusCodes.Status401Unauthorized);
			}
		}
		[HttpDelete("{serverId}")]
		public IActionResult DeleteServer(Guid serverId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				if(runner.RunnerID == _repo.Get(serverId).Owner) {
					_repo.Delete(serverId);
					return Ok();
				} else {
					return StatusCode(StatusCodes.Status403Forbidden);
				}
			}
			return userResult ?? throw new Exception("Result expected!");
		}
	}
}
