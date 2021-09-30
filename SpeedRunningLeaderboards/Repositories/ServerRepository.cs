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
	public class ServerRepository : Repository<Server, Guid>
	{
		public ServerRepository(DapperContext context) : base(context) {
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Server.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Runner.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Run.sql", conn);
			}
		}

		public override Server Create(Server entity)
		{
			using(var conn = _context.CreateConnection()) {
				entity.ServerID = Guid.NewGuid();
				conn.Execute("INSERT INTO dbo.Server VALUES (@ServerID, @Name, @Icon, @Owner)", entity);
			}
			return entity;
		}

		public override void Delete(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE FROM dbo.Server WHERE Server.ServerID = @id;", new { id });
			}
		}

		public override Server Get(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.QuerySingle<Server>("SELECT * FROM dbo.Server WHERE Server.ServerID = @id", new { id });
			}
		}

		public override IEnumerable<Server> Get()
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Server>("SELECT * FROM dbo.Server");
			}
		}

		public override Server Update(Server entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.Server SET Name = @Name, Icon = @Icon, Owner = @Owner", entity);
			}
			return entity;
		}
	}
}
