using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboardsWebApi
{
	public class ChatServices
	{
		private readonly IDictionary<Guid, Chat> chats = new Dictionary<Guid, Chat>() {
			{Guid.Parse("c41504c3-35a0-4cc8-95f5-57daa0d001cf"), new Chat(){
				ChatID = Guid.Parse("c41504c3-35a0-4cc8-95f5-57daa0d001cf")
			}}
		};
		public async Task AddSocket(Guid chatId, Runner runner, WebSocket socket)
		{
			if(!chats.ContainsKey(chatId)) {
				throw new Exception($"Chat with ID {chatId} doesn't exist!");
			} else {
				var socketRunner = new SocketedRunner(socket, runner);
				chats[chatId].ActiveMembers.Add(socketRunner);
				await socketRunner.Socket.Start(CancellationToken.None);
			}
		}
	}
}
