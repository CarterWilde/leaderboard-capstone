using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RulesetsController : Controller
	{
		private readonly RulesetRepository _repo;
		public RulesetsController(RulesetRepository repo)
		{
			_repo = repo;
		}
		[HttpGet("{id}")]
		public IActionResult GetOne(Guid id)
		{
			return Ok(_repo.Get(id));
		}
	}
}
