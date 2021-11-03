using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class SocketedRunner : Runner
	{
		public EventWebSocket Socket { get; set; }

		public SocketedRunner(WebSocket socket, Runner runner) : base(runner)
		{
			Socket = new EventWebSocket(socket);
			Socket.OnMessage += Socket_OnMessage;
		}

		private void Socket_OnMessage(MemoryStream ms, WebSocketReceiveResult result)
		{
			if(result.MessageType == WebSocketMessageType.Text) {
				using(var reader = new StreamReader(ms)) {
					var text = reader.ReadToEnd().Replace("\0", "");
					var message = JsonSerializer.Deserialize<Message>(text);
					Socket.Send(JsonSerializer.Serialize<Message>(message), CancellationToken.None);
				}
			}
		}
	}
}
