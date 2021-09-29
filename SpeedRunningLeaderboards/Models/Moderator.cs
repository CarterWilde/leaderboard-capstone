using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Moderator
	{
		public Guid ModerationID { get; set; }
		public Guid RunnerID { get; set; }
		public Guid GameID { get; set; }
		public Guid ServerID { get; set; }
		public bool IsLeadMod { get; set; }
	}
}
