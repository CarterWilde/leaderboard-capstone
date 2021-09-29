using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;

namespace SpeedRunningLeaderboards.Repositories
{
	public abstract class Repository<E, K>
	{
		protected readonly string _connectionString;
		public Repository(IConfiguration configuration)
		{
			_connectionString = configuration.GetConnectionString("DefaultConnection");
			using(var conn = GetConnection()) {
				var command = new SqlCommand("IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CapstoneLeaderboards')BEGIN CREATE DATABASE CapstoneLeaderboards;END;", conn);
				command.Connection.Open();
				command.ExecuteNonQuery();
				command.Connection.Close();

				var useCommand = new SqlCommand("USE CapstoneLeaderboards;", conn);
				useCommand.Connection.Open();
				useCommand.ExecuteNonQuery();
				command.Connection.Close();
			}
		}

		protected void ExecuteNonQueryFromFile(string path, SqlConnection conn)
		{
			var command = new SqlCommand(File.ReadAllText(path), conn);
			command.Connection.Open();
			command.ExecuteNonQuery();
			command.Connection.Close();
		}

		public SqlConnection GetConnection() => new(_connectionString);
		public abstract E Create(E entity);
		public abstract E Update(E entity);
		public abstract IEnumerable<E> Get(E entity);
		public abstract E GetByID(K id);
		public abstract void Delete(E entity);
		public abstract void DeleteByID(K entity);
	}
}
