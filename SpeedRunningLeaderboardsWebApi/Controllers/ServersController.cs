using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record CreateServerDTO(string Name, string Icon, IEnumerable<Runner>? Members, IEnumerable<Game>? Games);
	[Route("api/[controller]")]
	[ApiController]
	public class ServersController : ControllerBase
	{
		private readonly ServerRepository _repo;
		public ServersController(ServerRepository repo)
		{
			_repo = repo;
		}

		[HttpGet]
		public IActionResult GetServers()
		{
			return Ok(_repo.Get());
		}
		[HttpGet("@me")]
		public IActionResult GetMyServers()
		{
			var runner = HttpContext.Items["RunnerSession"] as SessionRunner;
			if(runner != null && runner.Runner != null) {
				return Ok(_repo.GetUserServers(runner.Runner.RunnerID));
			} else {
				return StatusCode(StatusCodes.Status401Unauthorized);
			}
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
