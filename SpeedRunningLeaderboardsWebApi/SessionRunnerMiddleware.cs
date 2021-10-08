using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;

using SpeedRunningLeaderboards.Models;
using SpeedRunningLeaderboards.Repositories;

namespace SpeedRunningLeaderboardsWebApi
{
	public class SessionRunner
	{
		public Runner? Runner { get; set; }
		public SessionRunner(Runner runner)
		{
			Runner = runner;
		}
		public SessionRunner()
		{
			Runner = null;
		}

	}
	public class SessionRunnerMiddleware
	{
		private readonly RequestDelegate _next;
		public SessionRunnerMiddleware(RequestDelegate next)
		{
			_next = next;
		}
		public async Task Invoke(HttpContext httpContext, SessionRunner session, RunnerRepository repo)
		{
			var discordId = httpContext.Request.Cookies["session-id"];
			if(discordId != null) {
				session.Runner = repo.Get(Guid.Parse(discordId));
			} else {
				session.Runner = null;
			}
			httpContext.Items["RunnerSession"] = session;
			await _next(httpContext);
		}
	}
}
