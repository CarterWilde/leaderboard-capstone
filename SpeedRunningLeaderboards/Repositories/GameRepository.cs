using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Dapper;

using SpeedRunningLeaderboards.Models;
using System.Data;

namespace SpeedRunningLeaderboards.Repositories
{
	public class GameRepository : Repository<Game, Guid>
	{
		public GameRepository(DapperContext context) : base(context) {
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Game.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Ruleset.sql", conn);
			}
		}
		public override Game Create(Game entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					entity.GameID = Guid.NewGuid();
					conn.Execute("INSERT INTO dbo.Game VALUES (@GameID, @Title, @Rules, @Image)", entity, transaction);
					if(entity.Rulesets != null) {
						foreach(var ruleset in entity.Rulesets) {
							ruleset.GameID = entity.GameID;
							ruleset.RulesetID = Guid.NewGuid();
							conn.Execute("INSERT INTO dbo.Ruleset VALUES (@RulesetID, @GameID, @Title, @Rules)", ruleset, transaction);
						}
					}
					transaction.Commit();
				}
			}
			return entity;
		}
		public override void Delete(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE FROM dbo.Game WHERE Game.GameID = @id;", new { id });
			}
		}
		public override Game Get(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.QuerySingle<Game>("SELECT * FROM dbo.Game WHERE Game.GameID = @id", new { id });
			}
		}

		public override IEnumerable<Game> Get()
		{
			using(var conn = _context.CreateConnection()) {
				IDictionary<Guid, Game> cache = new Dictionary<Guid, Game>();
				return conn.Query<Game, Ruleset, Game>("SELECT * FROM dbo.Game LEFT JOIN dbo.Ruleset ON Ruleset.GameID = Game.GameID;", (game, ruleset) => {
					Game? gameEntry;
					if(!cache.TryGetValue(game.GameID, out gameEntry)) {
						gameEntry = game;
						cache.Add(gameEntry.GameID, gameEntry);
					}

					gameEntry.Rulesets.Add(ruleset);
					return gameEntry;
				}, splitOn: "RulesetID").Distinct();
			}
		}
		public IEnumerable<Game> GetServerGames(Guid serverId)
		{
			using(var conn = _context.CreateConnection()) {
				IDictionary<Guid, Game> cache = new Dictionary<Guid, Game>();
				return conn.Query<Game, Ruleset, Game>("WITH ServerGamesCTE (GameID) AS (SELECT ServerGames.GameID FROM dbo.ServerGames WHERE ServerGames.ServerID = @serverId) SELECT * FROM dbo.Game JOIN ServerGamesCTE ON ServerGamesCTE.GameID = dbo.Game.GameID LEFT JOIN dbo.Ruleset ON Ruleset.GameID = Game.GameID;", (game, ruleset) => {
					Game? gameEntry;
					if(!cache.TryGetValue(game.GameID, out gameEntry)) {
						gameEntry = game;
						cache.Add(gameEntry.GameID, gameEntry);
					}

					gameEntry.Rulesets.Add(ruleset);
					return gameEntry;
				}, splitOn: "RulesetID", param: new { serverId }).Distinct();
			}
		}
		public override Game Update(Game entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.Game SET Title = @Title, Rules = @Rules, Image = @Image", entity);
			}
			return entity;
		}
		public Ruleset AddRuleset(Guid gameId, Ruleset ruleset)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("INSERT INTO dbo.Ruleset VALUES (@gameId, @Title, @Rules);", ruleset);
			}
			return ruleset;
		}
		public void RemoveRuleset(Guid rulesetId)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE FROM dbo.Ruleset WHERE dbo.Ruleset.RulesetID = @rulesetId", new { rulesetId });
			}
		}
	}
}
