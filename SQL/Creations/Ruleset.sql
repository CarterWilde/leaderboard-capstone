CREATE TABLE dbo.Ruleset
(
	RulesetID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	GameID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
		REFERENCES dbo.Game(GameID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	Title NVARCHAR(64) NOT NULL,
	[Description] NVARCHAR(max) NOT NULL
);