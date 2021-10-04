IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'ServerGames' AND xtype='U')
	CREATE TABLE dbo.ServerGames
	(
		ServerGamesID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
		ServerID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Server](ServerID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		GameID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
			REFERENCES dbo.[Game](GameID)
	);