IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'ServerMembers' AND xtype='U')
	CREATE TABLE dbo.ServerMembers
	(
		ServerMemberID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		RunnerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Runner(RunnerID),
		ServerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Server](ServerID)
				ON DELETE CASCADE
				ON UPDATE CASCADE
	);