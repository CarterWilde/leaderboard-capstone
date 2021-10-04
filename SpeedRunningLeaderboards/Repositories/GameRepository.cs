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
			}
		}
		public override Game Create(Game entity)
		{
			using(var conn = _context.CreateConnection()) {
				entity.GameID = Guid.NewGuid();
				conn.Execute("INSERT INTO dbo.Game VALUES (@GameID, @Title, @Rules, @Image)", entity);
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
				return conn.Query<Game>("SELECT * FROM dbo.Game");
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
