using System;
using System.Collections.Generic;

using Microsoft.Extensions.Configuration;

using NUnit.Framework;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsTests
{
	public class RepositoriesTests
	{
		private IConfiguration configuration;
		[SetUp]
		public void Setup()
		{
			var config = new Dictionary<string, string> {
				{"ConnectionStrings:DefaultConnection", @"Data Source=CARTERS-LAPTOP\CAPSTONEEXPRESS;User ID=test;Password=1234;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"}
			};

			configuration = new ConfigurationBuilder().AddInMemoryCollection(config).Build();
		}

		[Test]
		public void CanConnect()
		{
			Assert.DoesNotThrow(() => {
				var repo = new RunnerRepository(configuration);
				using(var connection = repo.GetConnection()) {
					connection.Open();
					connection.Close();
				}
			});
		}
		[Test]
		public void CanCreate()
		{
			var repo = new RunnerRepository(configuration);
			Assert.DoesNotThrow(() =>
			{
				repo.Create(new Runner(
					new Guid(),
					null,
					DateTime.Now,
					null,
					null,
					"138581951",
					"Carter Wilde",
					"6432",
					"7954231ajkhsfdadsf",
					false,
					false,
					false,
					"en-US",
					true,
					"carterjwilde@gmail.com",
					0,
					0,
					"blue",
					null
				));
			});
		}
	}
}