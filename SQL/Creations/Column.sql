CREATE TABLE dbo.[Column]
(
	ColumnID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RulesetID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY
		REFERENCES dbo.Ruleset(RulesetID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	[Name] NVARCHAR(64) NOT NULL,
	[Type] VARCHAR(128) NOT NULL
);