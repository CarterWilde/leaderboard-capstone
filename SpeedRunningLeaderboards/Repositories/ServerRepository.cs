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
				ExecuteNonQueryFromFile("./SQL/Creations/Game.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/ServerGames.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/ServerMembers.sql", conn);
			}
		}
		public override Server Create(Server entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					entity.ServerID = Guid.NewGuid();
					conn.Execute("INSERT INTO dbo.Server VALUES (@ServerID, @Name, @Icon, @Owner);", entity, transaction);
					if(entity.Games != null) {
						foreach(var game in entity.Games) {
							AddGame(entity.ServerID, game.GameID, transaction);
						}
					}
					if(entity.Members != null) {
						foreach(var member in entity.Members) {
							AddMember(entity.ServerID, member.RunnerID, transaction);
						}
					}
					transaction.Commit();
				}
			}
			return entity;
		}
		public void AddGame(Guid serverId, Guid gameId, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("INSERT INTO dbo.ServerGames VALUES (@serverId, @gameId);", new {serverId, gameId}, transaction);
			}
		}
		public void AddMember(Guid serverId, Guid runnerId, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("INSERT INTO dbo.ServerMembers VALUES (@serverId, @runnerId);", new { serverId, runnerId }, transaction);
			}
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

		public IEnumerable<Server> GetUserServers(Guid runnerId)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Server>("SELECT * FROM dbo.Server FULL JOIN dbo.ServerMembers ON dbo.Server.ServerID = dbo.ServerMembers.ServerID WHERE dbo.ServerMembers.RunnerID = @runnerId OR dbo.Server.Owner = @runnerId;", new { runnerId });
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
