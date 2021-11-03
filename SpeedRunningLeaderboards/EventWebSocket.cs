using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards
{
	public delegate void OnMessage(MemoryStream ms, WebSocketReceiveResult result);
	public class EventWebSocket : WebSocket {
		private readonly WebSocket socket;
		private ArraySegment<byte> buffer = new(new byte[256]);
		private readonly Encoding encoding;
		public event OnMessage? OnMessage;
		public EventWebSocket(WebSocket socket, Encoding? encoding = null)
		{
			if(encoding is null) {
				encoding = Encoding.UTF8;
			}
			this.encoding = encoding;
			this.socket = socket;
		}
		public async Task Start(CancellationToken token)
		{
			var result = await ReadMessage(token);
			while(result.CloseStatus is null) {
				result = await ReadMessage(token);
			}
			await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, token);
		}

		private async Task<WebSocketReceiveResult> ReadMessage(CancellationToken token)
		{
			using(var ms = new MemoryStream()) {
				WebSocketReceiveResult? result = null;
				do {
					result = await ReceiveAsync(buffer, token);
					ms.Write(buffer.Array, buffer.Offset, buffer.Count);
				} while(!result.EndOfMessage);

				ms.Seek(0, SeekOrigin.Begin);

				OnMessage?.Invoke(ms, result);

				return result;
			}
		}

		public void Send(string message, CancellationToken token)
		{
			lock(socket)
			{
				if(socket.State == WebSocketState.Open) {
					socket.SendAsync(encoding.GetBytes(message), WebSocketMessageType.Text, true, token);
				}
			}
		}

		public override WebSocketCloseStatus? CloseStatus => socket.CloseStatus;

		public override string? CloseStatusDescription => socket.CloseStatusDescription;

		public override WebSocketState State => socket.State;

		public override string? SubProtocol => socket.SubProtocol;

		public override void Abort()
		{
			socket.Abort();
		}

		public override Task CloseAsync(WebSocketCloseStatus closeStatus, string? statusDescription, CancellationToken cancellationToken)
		{
			return socket.CloseAsync(closeStatus, statusDescription, cancellationToken);
		}

		public override Task CloseOutputAsync(WebSocketCloseStatus closeStatus, string? statusDescription, CancellationToken cancellationToken)
		{
			return socket.CloseOutputAsync(closeStatus, statusDescription, cancellationToken);
		}

		public override void Dispose()
		{
			socket.Dispose();
		}

		public override Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken)
		{
			return socket.ReceiveAsync(buffer, cancellationToken);
		}

		public override Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken)
		{
			return socket.SendAsync(buffer, messageType, endOfMessage, cancellationToken);
		}
	}
}
