CREATE TABLE dbo.Runner
(
	RunnerID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	DiscordLoginID NCHAR(8) NOT NULL FOREIGN KEY
		REFERENCES dbo.DiscordLogin(DiscordLoginID) 
	    ON DELETE CASCADE
	    ON UPDATE CASCADE,
	RegionID INT NULL FOREIGN KEY
		REFERENCES dbo.Region(RegionID)
	    ON DELETE SET NULL
	    ON UPDATE CASCADE
);