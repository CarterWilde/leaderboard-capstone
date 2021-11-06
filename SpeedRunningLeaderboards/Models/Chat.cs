using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Chat
	{
		[JsonPropertyName("chatId")]
		public Guid ChatID { get; set; }
		public Guid ServerID { get; set; }
		public string Name { get; set; }
		public IList<SocketedRunner> ActiveMembers { get; set; } = new List<SocketedRunner>();
		public IList<Runner> Members { get; set; } = new List<Runner>();
		public Chat(string name, Guid serverId)
		{
			ChatID = Guid.NewGuid();
			Name = name;
			ServerID = serverId;
		}
		public Chat(Guid chatId, string name, Guid serverId)
		{
			ChatID = chatId;
			Name = name;
			ServerID = serverId;
		}
	}
}
