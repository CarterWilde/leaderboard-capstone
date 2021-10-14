using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SpeedRunningLeaderboards.Models;

namespace SpeedRunningLeaderboardsWebApi
{
	public static class ExtenstionMethods
	{
		public static IActionResult? GetUser(this ControllerBase controller, out Runner? runner)
		{
			if(controller.HttpContext.Items["RunnerSession"] is SessionRunner session) {
				if(session.Runner != null) {
					runner = session.Runner;
					return null;
				}
			}
			runner = null;
			return controller.StatusCode(StatusCodes.Status401Unauthorized);
		}
	}
}
