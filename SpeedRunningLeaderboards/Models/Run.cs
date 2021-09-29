﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Run
	{
		public Guid RunID { get; set; }
		public Guid RunnerID { get; set; }
		public Guid ServerID { get; set; }
		public DateTime PublishDate { get; set; }
		public int RunTime { get; set; }
		public string VideoURL { get; set; }
		public Guid VerifiedBy { get; set; }
		public IEnumerable<ColumnValue> Values { get; set; }

		public Run(Guid runID, Guid runnerID, Guid serverID, DateTime publishDate, int runTime, string videoURL, Guid verifiedBy, IEnumerable<ColumnValue> values)
		{
			RunID = runID;
			RunnerID = runnerID;
			ServerID = serverID;
			PublishDate = publishDate;
			RunTime = runTime;
			VideoURL = videoURL;
			VerifiedBy = verifiedBy;
			Values = values;
		}
	}
}
