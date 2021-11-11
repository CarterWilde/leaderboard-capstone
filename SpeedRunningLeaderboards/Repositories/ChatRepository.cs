using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Dapper;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboards.Repositories
{
	record SQLMessage(Guid MessageID, Guid ChatID, Guid PosterID, DateTime PublishDate, string Content);
	public class ChatRepository : Repository<Chat, Guid>
	{
		public ChatRepository(DapperContext context) : base(context)
		{
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/Server.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Chat.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Message.sql", conn);
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

		public Message AddMessage(Message message, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				message.MessageID = Guid.NewGuid();
				conn.Execute("INSERT INTO dbo.Message VALUES (@MessageID, @ChatID, @PosterID, @PublishDate, @Content);", new { PosterID = message.Poster.RunnerID, message.ChatID, message.MessageID, message.PublishDate, message.Content }, transaction);
				return message;
			}
		}
		public IEnumerable<Message> GetMessages(Guid chatId)
		{
			using(var conn = _context.CreateConnection()) {
				var sqlMessages = conn.Query<SQLMessage>("SELECT * FROM dbo.[Message] WHERE Message.ChatID = @chatId;", new { chatId });
				var iterator = sqlMessages.GetEnumerator();
				var messages = new Message[sqlMessages.Count()];
				int i = 0;
				var runnerRepo = new RunnerRepository(_context);
				while(iterator.MoveNext()) {
					var currentMessage = iterator.Current;
					messages[i++] = new Message(currentMessage.MessageID, currentMessage.ChatID, runnerRepo.Get(currentMessage.PosterID), currentMessage.PublishDate, currentMessage.Content);
				}
				return messages;
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
