using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi.Controllers
{
	public record ChatDTO(string Name);
	[Route("api/servers/{serverId}/chats")]
	public class ChatController : Controller
	{
		private readonly IDictionary<Guid, Chat> chats = new Dictionary<Guid, Chat>();
		private readonly ChatRepository _repo;
		public ChatController(ChatRepository repo)
		{
			_repo = repo;
			var sqlChats = _repo.Get();
			foreach(var chat in sqlChats) {
				chats.Add(chat.ChatID, chat);
			}
		}
		[HttpGet("{chatId}/join")]
		public async Task JoinChat(Guid chatId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				using(
					var socket = await HttpContext.WebSockets.AcceptWebSocketAsync()) {
					await AddSocket(chatId, runner, socket);
				}
			}
		}
		[HttpPost]
		public IActionResult AddChat(Guid serverId, [FromBody] ChatDTO data)
		{
			return Ok(_repo.Create(new Chat(data.Name, serverId)));
		}
		[HttpGet]
		public IActionResult GetChats(Guid serverId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				return Ok(_repo.GetServerChats(serverId));
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		public async Task AddSocket(Guid chatId, Runner runner, WebSocket socket)
		{
			var socketRunner = new SocketedRunner(socket, runner, (message, run) => {
				ForwardMessage(chatId, run, new Message(chatId, runner, DateTime.Now, message.Content));
			});
			chats[chatId].ActiveMembers.Add(socketRunner);
			await socketRunner.Socket.Start(CancellationToken.None);
		}
		public void ForwardMessage(Guid chatId, Runner sender, Message message)
		{
			foreach(var runner in chats[chatId].ActiveMembers) {
				runner.SendMessage(message);
			}
		}
	}
}
