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
				ExecuteNonQueryFromFile("./SQL/Creations/Column.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Run.sql", conn);
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
							foreach(var column in ruleset.Columns) {
								AddColumn(ruleset.RulesetID, column, conn, transaction);
							}
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

		public IEnumerable<Run> GetVerficationRuns(Guid serverId)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Run>("SELECT * FROM dbo.Run WHERE dbo.Run.ServerID = @serverId AND dbo.Run.VerifiedBy IS NULL;", new { serverId });
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
				var games = conn.Query<Game, Ruleset, Game>("WITH ServerGamesCTE (GameID) AS (SELECT ServerGames.GameID FROM dbo.ServerGames WHERE ServerGames.ServerID = @serverId) SELECT * FROM dbo.Game JOIN ServerGamesCTE ON ServerGamesCTE.GameID = dbo.Game.GameID LEFT JOIN dbo.Ruleset ON Ruleset.GameID = Game.GameID;", (game, ruleset) => {
					Game? gameEntry;
					if(!cache.TryGetValue(game.GameID, out gameEntry)) {
						gameEntry = game;
						cache.Add(gameEntry.GameID, gameEntry);
					}

					gameEntry.Rulesets.Add(ruleset);
					return gameEntry;
				}, splitOn: "RulesetID", param: new { serverId }).Distinct();
				foreach (var game in games)
				{
					game.Runs = conn.Query<Run>("SELECT * FROM dbo.Run WHERE ServerID = @serverId AND dbo.Run.VerifiedBy IS NOT NULL;", new {serverId}).ToList();
					foreach(var run in game.Runs) {
						run.Values = conn.Query<ColumnValue>("SELECT * FROM dbo.ColumnValue WHERE ColumnValue.RunID = @RunID;", new { run.RunID }).ToList();
					}
					foreach(var ruleset in game.Rulesets) {
						ruleset.Columns = GetColumns(ruleset.RulesetID).ToList();
					}
				}
				return games;
			}
		}
		public override Game Update(Game entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.Game SET Title = @Title, Rules = @Rules, Image = @Image", entity);
			}
			return entity;
		}
		public IEnumerable<Column> GetColumns(Guid rulesetId)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Column>("SELECT * FROM dbo.[Column] WHERE dbo.[Column].RulesetID = @rulesetId", new { rulesetId });
			}
		}
		public Column AddColumn(Guid rulesetID, Column column, SqlConnection conn, IDbTransaction transaction)
		{
			var id = Guid.NewGuid();
			conn.Execute("INSERT INTO dbo.[Column] VALUES (@id, @rulesetID, @Name, @Type)", new { id, rulesetID, column.Name, column.Type}, transaction);
			column.ColumnID = id;
			column.RulesetID = rulesetID;
			return column;
		}

		public void RemoveColumn(Guid columnId)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE FROM dbo.[Column] WHERE dbo.[Column].ColumnID = @columnId", new { columnId });
			}
		}
	}
}
