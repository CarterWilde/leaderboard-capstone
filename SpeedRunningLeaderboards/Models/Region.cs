using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Region
	{
		public int RegionID { get; set; }
		public string Name { get; set; }
		public string FlagEndpoint { get; set; }

		public Region(int regionID, string name, string flagEndpoint)
		{
			RegionID = regionID;
			Name = name;
			FlagEndpoint = flagEndpoint;
		}
	}
}
