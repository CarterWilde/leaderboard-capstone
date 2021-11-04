using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Dapper;

using SpeedRunningLeaderboards.Models;
using System.Data;

namespace SpeedRunningLeaderboards.Repositories
{
	public class RunnerRepository : Repository<Runner, Guid>
	{
		public RunnerRepository(DapperContext context) : base(context)
		{
			using(var conn = _context.CreateConnection()) {
				ExecuteNonQueryFromFile("./SQL/Creations/DiscordLogin.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Region.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Runner.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Social.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/Server.sql", conn);
				ExecuteNonQueryFromFile("./SQL/Creations/RunnerAuthority.sql", conn);
			}
		}

		public override Runner Create(Runner entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					entity.RunnerID = Guid.NewGuid();
					conn.Execute("INSERT INTO dbo.DiscordLogin VALUES (@DiscordLoginID, @Username, @Discriminator, @Avatar, @Bot, @System, @MfaEnabled, @Banner, @AccentColor, @Locale, @Verified, @Email, @Flags, @PremiumType, @PublicFlags);", entity, transaction);
					conn.Execute("INSERT INTO dbo.Runner VALUES (@RunnerID, @DiscordLoginID, @RegionID, @SignUpDate);", entity, transaction);
					if(entity.RunnerAuthorities != null) {
						foreach(var authority in entity.RunnerAuthorities) {
							authority.AuthorityID = Guid.NewGuid();
							conn.Execute("INSERT INTO dbo.RunnerAuthority VALUES (@AuthorityID, @RunnerID, @ServerID, @Value)", authority, transaction);
						}
					}

					if(entity.Socials != null) {
						foreach(var social in entity.Socials) {
							social.SocialID = Guid.NewGuid();
							conn.Execute("INSERT INTO dbo.Social VALUES (@SocialID, @RunnerID, @IconEndpoint, @Url)", social, transaction);
						}
					}

					transaction.Commit();
				}
			}

			return entity;
		}

		public override void Delete(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("DELETE DiscordLogin FROM DiscordLogin JOIN Runner ON Runner.DiscordLoginID = DiscordLogin.DiscordLoginID WHERE Runner.RunnerID = @id;", new { id });
			}
		}

		public override Runner Get(Guid id)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Runner, Region, Runner>("SELECT * FROM Runner FULL JOIN DiscordLogin ON Runner.DiscordLoginID = DiscordLogin.DiscordLoginID FULL JOIN Region ON Region.RegionID = Runner.RegionID WHERE Runner.RunnerID = @id;", (runner, region) =>
				{
					runner.Region = region;
					return runner;
				}, new { id }, splitOn: "RegionID").First();
			}
		}

		public override IEnumerable<Runner> Get()
		{
			using(var conn = _context.CreateConnection()) {
				var runnerDictionary = new Dictionary<Guid, Runner>();
				return conn.Query<Runner, Region, Runner>("SELECT * FROM Runner FULL JOIN DiscordLogin ON Runner.DiscordLoginID = DiscordLogin.DiscordLoginID FULL JOIN Region ON Region.RegionID = Runner.RegionID", (runner, region) =>
				{
					runner.Region = region;
					return runner;
				}, splitOn: "RegionID");
			}
		}

		public override Runner Update(Runner entity)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Open();
				using(var transaction = conn.BeginTransaction()) {
					UpdateDiscordUser(entity, transaction);
					conn.Execute("UPDATE dbo.Runner SET RegionID = @RegionID, SignUpDate = @SignUpDate WHERE RunnerID = @RunnerID;", entity, transaction);
					transaction.Commit();
				}
			}
			return entity;
		}

		public DiscordLogin UpdateDiscordUser(DiscordLogin discordUser, IDbTransaction? transaction = null)
		{
			using(var conn = _context.CreateConnection()) {
				conn.Execute("UPDATE dbo.DiscordLogin " +
											"SET Username = @Username, " +
											"Discriminator = @Discriminator, " +
											"Avatar = @Avatar, " +
											"Bot = @Bot, " +
											"[System] = @System, " +
											"MfaEnabled = @MfaEnabled, " +
											"Banner = @Banner, " +
											"AccentColor = @AccentColor, " +
											"Locale = @Locale, " +
											"Verified = @Verified, " +
											"Email = @Email, " +
											"Flags = @Flags, " +
											"PublicFlags = @PublicFlags " +
											"WHERE DiscordLogin.DiscordLoginID = @DiscordLoginID;", discordUser, transaction);
				return discordUser;
			}
		}

		public Runner GetByDiscordLoginID(string discordLoginID)
		{
			using(var conn = _context.CreateConnection()) {
				return conn.Query<Runner, Region, Runner>("SELECT * FROM Runner FULL JOIN DiscordLogin ON Runner.DiscordLoginID = DiscordLogin.DiscordLoginID FULL JOIN Region ON Region.RegionID = Runner.RegionID WHERE DiscordLogin.DiscordLoginID = @discordLoginID;", (runner, region) =>
				{
					runner.Region = region;
					return runner;
				}, new { discordLoginID }, splitOn: "RegionID").First();
			}
		}
	}
}
