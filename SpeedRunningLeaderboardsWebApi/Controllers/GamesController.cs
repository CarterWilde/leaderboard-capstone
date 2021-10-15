﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record RulesetDTO(string Title, string Rules);
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
			foreach(var ruleset in game.Rulesets) {
				rulesets.Add(new Ruleset(Guid.NewGuid(), ruleset.Title, ruleset.Rules));
			}
			return Ok(_repo.Create(new Game(Guid.NewGuid(), game.Title, game.Rules, game.Image, rulesets)));
		}
		[HttpDelete("{gameId}")]
		public IActionResult DeleteGame(Guid gameId) {
			_repo.Delete(gameId);
			return Ok();
		}
	}
}
