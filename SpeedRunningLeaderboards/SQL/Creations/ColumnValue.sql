IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'ColumnValue' AND xtype='U')
	CREATE TABLE dbo.ColumnValue
	(
		ColumnValueID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		RunID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Run(RunID),
		ColumnID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Column](ColumnID),
		[Value] VARCHAR(max) NULL
	);