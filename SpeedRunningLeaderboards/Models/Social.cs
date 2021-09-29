using System;

namespace SpeedRunningLeaderboards.Models
{
	public class Social
	{
		public Guid SocialID { get; set; }
		public Guid RunnerID { get; set; }
		public string IconEndpoint { get; set; }
		public string Url { get; set; }
		public Social(Guid socialID, Guid runnerID, string iconEndpoint, string url)
		{
			SocialID = socialID;
			RunnerID = runnerID;
			IconEndpoint = iconEndpoint;
			Url = url;
		}
	}
}