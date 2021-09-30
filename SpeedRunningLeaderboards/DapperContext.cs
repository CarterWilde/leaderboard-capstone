using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;

namespace SpeedRunningLeaderboards
{
	public class DapperContext
	{
		private readonly IConfiguration _configuration;
		public DapperContext(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public SqlConnection CreateConnection() => new(_configuration.GetConnectionString("DefaultConnection"));
	}
}
