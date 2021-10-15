using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Ruleset
	{
		public Guid RulesetID { get; set; }
		public Guid GameID { get; set; }
		public string Title { get; set; }
		public string Rules { get; set; }
		public Ruleset(Guid rulesetID, Guid gameID, string title, string rules)
		{
			RulesetID = rulesetID;
			GameID = gameID;
			Title = title;
			Rules = rules;
		}
		public Ruleset(Guid gameID, string title, string rules)
		{
			RulesetID = Guid.NewGuid();
			GameID = gameID;
			Title = title;
			Rules = rules;
		}
	}
}
