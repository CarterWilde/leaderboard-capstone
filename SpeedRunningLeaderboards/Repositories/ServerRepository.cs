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
	public record ColumnValueDTO(Guid columnID, string value);
	public class ServerRepository : Repository<Server, Guid>
	{
		public ServerRepository(DapperContext context) : base(context) {
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Runner.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Server.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Game.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Ruleset.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Run.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/ServerGames.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/ServerMembers.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Column.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/ColumnValue.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Moderator.sql", conn);
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
				conn.Execute("INSERT INTO dbo.ServerGames VALUES (@id, @serverId, @gameId);", new {id=Guid.NewGuid(), serverId, gameId}, transaction);
			}
		}
		public void RemoveGame(Guid serverId, Guid gameId)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE FROM dbo.ServerGames WHERE ServerID=@serverId AND GameID=@gameId;", new { serverId, gameId });
			}
		}
		public void AddMember(Guid serverId, Guid runnerId, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("INSERT INTO dbo.ServerMembers VALUES (@id, @runnerId, @serverId);", new { id=Guid.NewGuid(), serverId, runnerId }, transaction);
			}
		}
		public void RemoveMember(Guid serverId, Guid runnerId, IDbTransaction? transaction = null)
		{
			using (var conn = _context.CreateConnection())
			{
				conn.Execute("DELETE FROM dbo.ServerMembers WHERE ServerMembers.RunnerID = @runnerId AND ServerMembers.ServerID = @serverId;", new { runnerId, serverId }, transaction);
			}
		}
		public IEnumerable<Moderator> GetModerators(Guid serverId)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Moderator>("SELECT * FROM dbo.Moderator WHERE Moderator.ServerID = @serverId", new { serverId });
			}
		}
		public void AddModerator(Guid serverId, Guid runnerId, Guid gameId, bool isLead = false, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("INSTER INTO dbo.Moderator VALUES (@id, @runnerId, @gameId, @serverId, @isLead);", new { id = Guid.NewGuid(), serverId, runnerId, gameId, isLead }, transaction);
			}
		}
		public void RemoveModerator(Guid serverId, Guid runnerId, Guid gameId, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE dbo.Moderator WHERE Moderator.RunnerID = @runnerId AND Moderator.GameID = @gameId AND Moderator.ServerID = @serverId", new { serverId, runnerId, gameId }, transaction);
			}
		}
		public void AddRun(Guid runnerId, Guid serverId, Guid gameId, Guid rulesetId, int runTime, string videoUrl, params ColumnValueDTO[] values)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					var columns = conn.Query<Column>("SELECT * FROM dbo.[Column] WHERE dbo.[Column].RulesetID = @rulesetId", new { rulesetId }, transaction);
					if(values.Length != columns.Count()) throw new Exception("Missing a value or too many!");
					var runId = Guid.NewGuid();
					conn.Execute("INSERT INTO dbo.Run VALUES (@id, @runnerId, @serverId, @rulesetId, @publishDate, @runTime, @videoUrl, NULL);", new { id = runId, runnerId, serverId, gameId, rulesetId, publishDate = DateTime.Now, runTime, videoUrl }, transaction);
					for(int i = 0; i < values.Length; i++) {
						var value = values[i];
						conn.Execute("INSERT INTO dbo.ColumnValue VALUES (@id, @runId, @columnId, @value);", new { id = Guid.NewGuid(), runId, columnId = columns.ElementAt(i).ColumnID, value.value }, transaction);
					}
					transaction.Commit();
				}
			}
		}
		public void VerifyRun(Guid verifiedBy, Guid runId, bool isAccepted)
		{
			using(var conn = _context.CreateConnection()) {
				if(isAccepted) {
					conn.Execute("UPDATE dbo.Run SET Run.VerifiedBy = @verifiedBy WHERE Run.RunID = @runId;", new { verifiedBy, runId });
				} else {
					conn.Open();
					using(IDbTransaction transaction = conn.BeginTransaction()) {
						conn.Execute("DELETE dbo.ColumnValue WHERE dbo.ColumnValue.RunID = @runId", new { runId }, transaction);
						conn.Execute("DELETE dbo.Run WHERE Run.RunID = @runId", new { runId }, transaction);
						transaction.Commit();
					}
				}
			}
		}
		public override void Delete(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					var chats = conn.Query<Chat>("SELECT * FROM dbo.Chat WHERE Chat.ServerID = @id", new { id }, transaction);
					foreach(var chat in chats) {
						conn.Execute("DELETE FROM dbo.Message WHERE Message.ChatID = @ChatID;", new { chat.ChatID }, transaction);
					}
					conn.Execute("DELETE FROM dbo.Chat WHERE Chat.ServerID = @id;", new { id }, transaction);
					conn.Execute("DELETE FROM dbo.ServerGames WHERE ServerGames.ServerID = @id;", new { id }, transaction);
					conn.Execute("DELETE FROM dbo.Run WHERE Run.ServerID = @id;", new { id }, transaction);
					conn.Execute("DELETE FROM dbo.Moderator WHERE Moderator.ServerID = @id;", new { id }, transaction);
					conn.Execute("DELETE FROM dbo.ServerMembers WHERE ServerMembers.ServerID = @id;", new { id }, transaction);
					conn.Execute("DELETE FROM dbo.Server WHERE Server.ServerID = @id;", new { id }, transaction);
					transaction.Commit();
				}
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
				return conn.Query<Server>("SELECT * FROM dbo.Server;");
			}
		}

		public IEnumerable<Server> GetUserServers(Guid runnerId)
		{
			using(var conn = _context.CreateConnection()) {
				var servers =  conn.Query<Server>("SELECT * FROM dbo.Server FULL JOIN dbo.ServerMembers ON dbo.Server.ServerID = dbo.ServerMembers.ServerID WHERE dbo.ServerMembers.RunnerID = @runnerId OR dbo.Server.Owner = @runnerId;", new { runnerId });
				foreach (var server in servers)
				{
					server.Members = conn.Query<Runner>("SELECT * FROM dbo.ServerMembers JOIN Runner ON Runner.RunnerID = ServerMembers.RunnerID JOIN DiscordLogin ON DiscordLogin.DiscordLoginID = Runner.DiscordLoginID WHERE ServerMembers.ServerID = @id;", new {id = server.ServerID});
				}
				foreach(var server in servers) {
					server.Moderators = GetModerators(server.ServerID);
				}
				return servers;
			}
		}

		public override Server Update(Server entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.Server SET Name = @Name, Icon = @Icon, Owner = @Owner WHERE dbo.Server.ServerID = @ServerID;", entity);
			}
			return entity;
		}
	}
}
