IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'ColumnValue' AND xtype='U')
	CREATE TABLE dbo.ColumnValue
	(
		ColumnValueID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		RunID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Run(RunID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		ColumnID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Column](ColumnID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		[Value] VARCHAR(max) NULL
	);