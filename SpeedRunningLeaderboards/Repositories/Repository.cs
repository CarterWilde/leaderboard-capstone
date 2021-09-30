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
		protected readonly DapperContext _context;
		public Repository(DapperContext context)
		{
			_context = context;
		}

		protected void ExecuteNonQueryFromFile(string path, SqlConnection conn)
		{
			var command = new SqlCommand(File.ReadAllText(path), conn);
			command.Connection.Open();
			command.ExecuteNonQuery();
			command.Connection.Close();
		}
		public abstract E Create(E entity);
		public abstract E Update(E entity);
		public abstract E Get(K entity);
		public abstract IEnumerable<E> Get();
		public abstract void Delete(K entity);
	}
}
