using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Dapper;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboards.Repositories
{
	public class RulesetRepository : Repository<Ruleset, Guid>
	{
		public RulesetRepository(DapperContext context) : base(context)
		{
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Game.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Ruleset.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Column.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Run.sql", conn);
			}
		}
		public override Ruleset Create(Ruleset entity)
		{
			throw new NotImplementedException();
		}

		public override void Delete(Guid entity)
		{
			throw new NotImplementedException();
		}

		public override Ruleset Get(Guid entity)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.QueryFirst<Ruleset>("SELECT * FROM dbo.Ruleset WHERE Ruleset.RulesetID = @id", new { id = entity });
			}
		}

		public override IEnumerable<Ruleset> Get()
		{
			throw new NotImplementedException();
		}

		public override Ruleset Update(Ruleset entity)
		{
			throw new NotImplementedException();
		}
	}
}
