using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record ColumnDTO(string Name, string Type);
	public record RulesetDTO(string Title, string Rules, IList<ColumnDTO> Columns);
	public record GameDTO(string Title, string Rules, string Image, IList<RulesetDTO> Rulesets);
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
		[HttpGet("{gameId}")]
		public IActionResult GetGame(Guid gameId)
		{
			return Ok(_repo.Get(gameId));
		}
		[HttpPost]
		public IActionResult CreateGame([FromBody] GameDTO game)
		{
			IList<Ruleset> rulesets = new List<Ruleset>();
			var gameId = Guid.NewGuid();
			foreach(var ruleset in game.Rulesets) {
				var rulesetId = Guid.NewGuid();

				var columns = new List<Column>();

				foreach(var column in ruleset.Columns) {
					columns.Add(new Column(Guid.NewGuid(), rulesetId, column.Name, column.Type));
				}

				rulesets.Add(new Ruleset(rulesetId, gameId, ruleset.Title, ruleset.Rules, columns));
			}
			return Ok(_repo.Create(new Game(gameId, game.Title, game.Rules, game.Image, rulesets, new List<Run>())));
		}
		[HttpDelete("{gameId}")]
		public IActionResult DeleteGame(Guid gameId) {
			_repo.Delete(gameId);
			return Ok();
		}
	}
}
