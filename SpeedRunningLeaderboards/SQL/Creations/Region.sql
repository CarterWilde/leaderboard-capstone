IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Region' AND xtype='U')
	CREATE TABLE dbo.Region
	(
		RegionID INT NOT NULL PRIMARY KEY IDENTITY(0, 1),
		[Name] NVARCHAR(56) NOT NULL,
		FlagEndpoint VARCHAR(2048) NOT NULL
	);