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
	public class GameRepositoryTests
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
			var repo = new GameRepository(_context);
			Assert.DoesNotThrow(() =>
			{
				repo.Create(GetGameObject());
			});
		}

		[Test]
		public void CanGetSingle()
		{
			var repo = new GameRepository(_context);
			var id = repo.Create(GetGameObject()).GameID;
			var game = repo.Get(id);
			Assert.AreEqual(id, game.GameID);
			Assert.AreEqual("Portal", game.Title);
		}
		[Test]
		public void CanDelete()
		{
			var repo = new GameRepository(_context);
			var id = repo.Create(GetGameObject()).GameID;
			repo.Delete(id);
			Assert.Throws(typeof(InvalidOperationException), () =>
			{
				repo.Get(id);
			});
		}

		[Test]
		public void CanGet()
		{
			var repo = new GameRepository(_context);
			repo.Get();
		}

		[Test]
		public void CanUpdate()
		{
			var repo = new GameRepository(_context);
			var id = repo.Create(GetGameObject()).GameID;
			var game = repo.Get(id);
			game.Title = "Satisfactory";
			game.Image = "https://i.redd.it/hmeo9odoiab51.jpg";
			var updated = repo.Update(game);
			Assert.AreEqual(game.Title, updated.Title);
			Assert.AreEqual(game.Image, updated.Image);
		}

		private Game GetGameObject()
		{
			return new Game(Guid.NewGuid(), "Portal", "Complete the game with autosaves and quick loads.", "https://www.speedrun.com/gameasset/4pd0n31e/cover", new List<Ruleset>());
		}
	}
}