using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RunnersController : ControllerBase
	{
		private readonly RunnerRepository _repo;
		public RunnersController(RunnerRepository repo)
		{
			_repo = repo;
		}
		// GET api/Runners/5
		[HttpGet("{id}")]
		public IActionResult Get(string id)
		{
			try {
				return Ok(_repo.Get(Guid.Parse(id)));
			} catch(InvalidOperationException) {
				return NotFound();
			}
		}
	}
}
