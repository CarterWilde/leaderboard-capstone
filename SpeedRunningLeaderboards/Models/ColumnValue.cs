using System;

namespace SpeedRunningLeaderboards.Models
{
	public class ColumnValue
	{
		public Guid ColumnValueID { get; set; }
		public Guid RunID { get; set; }
		public Guid ColumnID { get; set; }
		public string Value { get; set; }
		public ColumnValue(Guid columnValueID, Guid runID, Guid columnID, string value)
		{
			ColumnValueID = columnValueID;
			RunID = runID;
			ColumnID = columnID;
			Value = value;
		}
	}
}