﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Server
	{
		public Guid ServerID { get; set; }
		public string Name { get; set; }
		public string Icon { get; set; }
		public Guid Owner { get; set; }
		public IEnumerable<Runner> Members { get; set; }

		public Server(Guid serverID, string name, string icon, Guid owner, IEnumerable<Runner> members)
		{
			ServerID = serverID;
			Name = name;
			Icon = icon;
			Owner = owner;
			Members = members;
		}
	}
}
