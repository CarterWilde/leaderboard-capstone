IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'RunnerAuthority' AND xtype='U')
	CREATE TABLE dbo.RunnerAuthority
	(
		AuthorityID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		RunnerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Runner(RunnerID),
		ServerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Server(ServerID)
				ON DELETE CASCADE
				ON UPDATE CASCADE,
		Authority INT NOT NULL
	);