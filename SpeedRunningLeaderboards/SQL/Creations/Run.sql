IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Run' AND xtype='U')
	CREATE TABLE dbo.Run
	(
		RunID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		RunnerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.Runner(RunnerID),
		ServerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Server](ServerID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		PublishDate DATETIME NOT NULL,
		RunTime DECIMAL NOT NULL,
		VideoURL VARCHAR(2048) NOT NULL 
	);