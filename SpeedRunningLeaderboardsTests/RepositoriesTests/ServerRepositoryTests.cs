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
	public class ServerRepositoryTests
	{
		private IConfiguration _configuration;
		private DapperContext _context;
		private Runner _runner;
		[SetUp]
		public void Setup()
		{
			var config = new Dictionary<string, string> {
				{"ConnectionStrings:DefaultConnection", @"Data Source=CARTERS-LAPTOP\CAPSTONEEXPRESS;Database=CapstoneLeaderboards;User ID=test;Password=1234;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"}
			};

			_configuration = new ConfigurationBuilder().AddInMemoryCollection(config).Build();
			_context = new DapperContext(_configuration);

			var runnerRepo = new RunnerRepository(_context);
			_runner = runnerRepo.Create(new Runner(
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
			));
		}

		[Test]
		public void CanCreate()
		{
			var repo = new ServerRepository(_context);
			Assert.DoesNotThrow(() =>
			{
				repo.Create(GetServerObject());
			});
		}

		[Test]
		public void CanGetSingle()
		{
			var repo = new ServerRepository(_context);
			var id = repo.Create(GetServerObject()).ServerID;
			var server = repo.Get(id);
			Assert.AreEqual(id, server.ServerID);
			Assert.AreEqual("Carter's Server", server.Name);
		}
		[Test]
		public void CanDelete()
		{
			var repo = new ServerRepository(_context);
			var id = repo.Create(GetServerObject()).ServerID;
			repo.Delete(id);
			Assert.Throws(typeof(InvalidOperationException), () =>
			{
				repo.Get(id);
			});
		}

		[Test]
		public void CanGet()
		{
			var repo = new ServerRepository(_context);
			repo.Get();
		}

		[Test]
		public void CanUpdate()
		{
			var repo = new ServerRepository(_context);
			var id = repo.Create(GetServerObject()).ServerID;
			var server = repo.Get(id);
			server.Name = "The Able's Server";
			var updated = repo.Update(server);
			Assert.AreEqual(server.Name, updated.Name);
		}

		private Server GetServerObject()
		{
			return new Server(Guid.NewGuid(), "Carter's Server", "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80", _runner.RunnerID, null);
		}
	}
}