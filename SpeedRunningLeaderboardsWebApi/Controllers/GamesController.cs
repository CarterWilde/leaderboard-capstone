using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GamesController : ControllerBase
	{
		private readonly GameRepository _repo;
		public GamesController(GameRepository repo)
		{
			_repo = repo;
		}
		[HttpGet]
		public IActionResult GetGames()
		{
			return Ok(_repo.Get());
		}
		[HttpGet]
		public IActionResult GetGame(Guid gameId)
		{
			return Ok(_repo.Get(gameId));
		}
	}
}
