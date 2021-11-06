using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Dapper;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboards.Repositories
{
	public class ChatRepository : Repository<Chat, Guid>
	{
		public ChatRepository(DapperContext context) : base(context)
		{
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Server.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Chat.sql", conn);
			}
		}
		public override Chat Create(Chat entity)
		{
			using(var conn = _context.CreateConnection()) {
				entity.ChatID = Guid.NewGuid();
				conn.Execute("INSERT INTO dbo.Chat VALUES (@ChatID, @Name, @ServerID)", entity);
				return entity;
			}
		}

		public override void Delete(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE * FROM dbo.Chat WHERE Chat.ChatID = @id;", new { id });
			}
		}

		public override Chat Get(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Chat>("SELECT * FROM dbo.Chat WHERE Chat.ChatID = @id", new { id }).First();
			}
		}
		public IEnumerable<Chat> GetServerChats(Guid serverId)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Chat>("SELECT * FROM dbo.Chat WHERE Chat.ServerID = @serverId;", new { serverId });
			}
		}
		public override IEnumerable<Chat> Get()
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Chat>("SELECT * FROM dbo.Chat;");
			}
		}

		public override Chat Update(Chat entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.Chat SET Name = @Name, ServerID = @ServerID;", new { entity.Name, entity.ServerID });
				return entity;
			}
		}
	}
}
