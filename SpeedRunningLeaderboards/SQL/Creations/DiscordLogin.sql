IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'DiscordLogin' AND xtype='U')
	CREATE TABLE dbo.DiscordLogin (
	  DiscordLoginID CHAR(18) NOT NULL PRIMARY KEY,
	  Username NVARCHAR(32) NOT NULL,
	  Discriminator NCHAR(4) NOT NULL,
	  Avatar VARCHAR(128) NULL,
	  Bot BIT NULL,
	  [System] BIT NULL,
	  MfaEnabled BIT NULL,
	  Banner VARCHAR(128) NULL,
	  AccentColor VARCHAR(128) NULL,
	  Locale VARCHAR(128) NULL,
	  Verified BIT NULL,
	  Email VARCHAR(320),
	  Flags INT NULL,
	  PremiumType INT NULL,
	  PublicFlags INT NULL
	);