using System;
using System.Collections.Generic;
using System.Data.SqlClient;

using Microsoft.Extensions.Configuration;

using NUnit.Framework;

using SpeedRunningLeaderboards;
using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsTests.RepositoriesTests
{
	public class RunnerRepositoryTests
	{
		private IConfiguration _configuration;
		private DapperContext _context;
		[SetUp]
		public void Setup()
		{
			var config = new Dictionary<string, string> {
				{"ConnectionStrings:DefaultConnection", @"Data Source=CARTERS-LAPTOP\CAPSTONEEXPRESS;Database=CapstoneLeaderboards;User ID=test;Password=1234;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"}
			};

			_configuration = new ConfigurationBuilder().AddInMemoryCollection(config).Build();
			_context = new DapperContext(_configuration);
		}

		[Test]
		public void CanCreate()
		{
			var repo = new RunnerRepository(_context);
			Assert.DoesNotThrow(() =>
			{
				repo.Create(GetRunnerObject());
			});
		}

		[Test]
		public void CanGetSingle()
		{
			var repo = new RunnerRepository(_context);
			var id = repo.Create(GetRunnerObject()).RunnerID;
			var runner = repo.Get(id);
			Assert.AreEqual(id, runner.RunnerID);
			Assert.AreEqual("Carter Wilde", runner.Username);
			Assert.AreEqual("6432", runner.Discriminator);
		}
		[Test]
		public void CanDelete()
		{
			var repo = new RunnerRepository(_context);
			var id = repo.Create(GetRunnerObject()).RunnerID;
			repo.Delete(id);
			Assert.Throws(typeof(InvalidOperationException), () => {
				repo.Get(id);
			});
		}

		[Test]
		public void CanGet()
		{
			var repo = new RunnerRepository(_context);
			repo.Get();
		}

		[Test]
		public void CanUpdate()
		{
			var repo = new RunnerRepository(_context);
			var id = repo.Create(GetRunnerObject()).RunnerID;
			var runner = repo.Get(id);
			runner.Username = "The Able";
			runner.Email = "ihavenoclue@gmail.com";
			var updated = repo.Update(runner);
			Assert.AreEqual(runner.Username, updated.Username);
			Assert.AreEqual(runner.Email, updated.Email);
		}

		private static Runner GetRunnerObject()
		{
			return new Runner(
					null,
					DateTime.Now,
					null,
					null,
					Guid.NewGuid().ToString().Substring(0, 18),
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
					null,
					0
				);
		}
	}
}