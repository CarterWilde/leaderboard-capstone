using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboards.Repositories
{
	public class RunnerRepository : Repository<Runner, Guid>
	{
		public RunnerRepository(IConfiguration configuration) : base(configuration) {
			using(var conn = GetConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/DiscordLogin.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Region.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Runner.sql", conn);
			}
		}

		public override Runner Create(Runner entity)
		{
			throw new NotImplementedException();
		}

		public override void Delete(Runner entity)
		{
			throw new NotImplementedException();
		}

		public override void DeleteByID(Guid entity)
		{
			throw new NotImplementedException();
		}

		public override bool Equals(object? obj)
		{
			return base.Equals(obj);
		}

		public override IEnumerable<Runner> Get(Runner entity)
		{
			throw new NotImplementedException();
		}

		public override Runner GetByID(Guid id)
		{
			throw new NotImplementedException();
		}

		public override int GetHashCode()
		{
			return base.GetHashCode();
		}

		public override string? ToString()
		{
			return base.ToString();
		}

		public override Runner Update(Runner entity)
		{
			throw new NotImplementedException();
		}
	}
}
