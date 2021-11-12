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
		[HttpGet("{chatId}")]
		public IActionResult GetChat(Guid serverId, Guid chatId)
		{
			var userResult = this.GetUser(out Runner? runner);
			if(runner is Runner && userResult is null) {
				return Ok(_repo.Get(chatId));
			}
			return userResult ?? throw new Exception("Result expected!");
		}
		public async Task AddSocket(Guid chatId, Runner runner, WebSocket socket)
		{
			var socketRunner = new SocketedRunner(socket, runner, (message, run) => {
				if(message.Action == "sendMessage" && message.Content != null) {
					ForwardMessage(chatId, run, _repo.AddMessage(new Message(Guid.NewGuid(), chatId, runner, DateTime.Now, message.Content)));
				}
				else if (message.Action == "getMessages") {
					foreach(var storedMessage in _repo.GetMessages(chatId)) {
						chats[chatId].ActiveMembers.Where(run => run.RunnerID == runner.RunnerID).First().SendMessage(storedMessage);
					}
				} else {
					throw new WebSocketException($"Action '{message.Action}' not supported!");
				}
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
