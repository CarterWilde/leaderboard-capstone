using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
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
			var sessionId = HttpContext.Request.Cookies["session-id"];
			return Ok(_repo.GetUserServers(Guid.Parse(sessionId)));
		}
	}
}
