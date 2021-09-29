using System;

namespace SpeedRunningLeaderboards.Models
{
	public class Authority
	{
		public int AuthorityID { get; set; }
		public Guid RunnerID { get; set; }
		public Guid ServerID { get; set; }
		public string Value { get; set; }
		public Authority(int authorityID, Guid runnerID, Guid serverID, string value)
		{
			AuthorityID = authorityID;
			RunnerID = runnerID;
			ServerID = serverID;
			Value = value;
		}
	}
}