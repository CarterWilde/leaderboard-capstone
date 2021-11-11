using System;

namespace SpeedRunningLeaderboards.Models
{
	public class Authority
	{
		public Guid AuthorityID { get; set; }
		public Guid RunnerID { get; set; }
		public Guid ServerID { get; set; }
		public string Value { get; set; }
		public Authority(Guid AuthorityID, Guid RunnerID, Guid ServerID, string Authority)
		{
			this.AuthorityID = AuthorityID;
			this.RunnerID = RunnerID;
			this.ServerID = ServerID;
			Value = Authority;
		}
	}
}