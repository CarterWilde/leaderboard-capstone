using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Server
	{
		public Guid ServerID { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Icon { get; set; } = string.Empty;
		public Guid Owner { get; set; }
		public IEnumerable<Runner> Members { get; set; } = new List<Runner>();
		public IEnumerable<Game> Games { get; set; } = new List<Game>();
		public IEnumerable<Chat> Chats { get; set; } = new List<Chat>();

		public Server()
		{
		}
		public Server(Guid serverID, string name, string icon, Guid owner, IEnumerable<Runner> members, IEnumerable<Game> games)
		{
			ServerID = serverID;
			Name = name;
			Icon = icon;
			Owner = owner;
			Members = members;
			Games = games;
		}
	}
}
