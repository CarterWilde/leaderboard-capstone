using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Column
	{
		public Guid ColumnID { get; set; }
		public Guid RulesetID { get; set; }
		public string Name { get; set; }
		public string Type { get; set; }
		public Column(Guid columnID, Guid rulesetID, string name, string type)
		{
			ColumnID = columnID;
			RulesetID = rulesetID;
			Name = name;
			Type = type;
		}
	}
}
