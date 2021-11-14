using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public record MessageDTO ([property: JsonPropertyName("action")] string Action, [property:JsonPropertyName("content")]string? Content);
	public class SocketedRunner : Runner
	{
		public EventWebSocket Socket { get; }
		private event Action<MessageDTO, Runner> HasMessage;

		public SocketedRunner(WebSocket socket, Runner runner, Action<MessageDTO, Runner> hasMessage) : base(runner)
		{
			Socket = new EventWebSocket(socket);
			Socket.OnMessage += Socket_OnMessage;
			HasMessage += hasMessage;
		}
		private void Socket_OnMessage(MemoryStream ms, WebSocketReceiveResult result)
		{
			if(result.MessageType == WebSocketMessageType.Text) {
				using(var reader = new StreamReader(ms)) {
					var text = reader.ReadToEnd();
					var message = JsonSerializer.Deserialize<MessageDTO>(text, new JsonSerializerOptions()
					{
						PropertyNameCaseInsensitive = true,
						NumberHandling = JsonNumberHandling.AllowReadingFromString
					});
					if(message is MessageDTO) {
						HasMessage.Invoke(message, this);
					} else {
						throw new JsonException("Invalid JSON Object");
					}
				}
			}
		}
		public void SendMessage(Message message)
		{
			Socket.Send(JsonSerializer.Serialize(message, new JsonSerializerOptions()
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase
			}), CancellationToken.None);
		}
	}
}
