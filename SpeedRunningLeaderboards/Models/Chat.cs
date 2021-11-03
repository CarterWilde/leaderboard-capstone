using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Chat
	{
		public Guid ChatID { get; set; }
		public IList<SocketedRunner> ActiveMembers { get; set; } = new List<SocketedRunner>();
		public IList<Runner> Members { get; set; } = new List<Runner>();
	}
}
