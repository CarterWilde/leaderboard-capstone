using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Game
	{
		public Guid GameID { get; set; }
		public string Title { get; set; }
		public string Rules { get; set; }
		public string Image { get; set; }
		public IList<Ruleset> Rulesets { get; set; } = new List<Ruleset>();
		public Game()
		{
		}
		public Game(Guid gameID, string title, string rules, string image, IList<Ruleset> rulesets)
		{
			GameID = gameID;
			Title = title;
			Rules = rules;
			Image = image;
			Rulesets = rulesets;
		}
	}
}
