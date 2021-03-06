using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

using SpeedRunningLeaderboards;
using SpeedRunningLeaderboards.Repositories;

using StackExchange.Redis;

namespace SpeedRunningLeaderboardsWebApi
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddLogging(logging => {
				logging.ClearProviders();
				logging.AddConsole();
			});

			services.AddHttpClient();

			services.AddSingleton<DapperContext>();
			services.AddScoped<ServerRepository>();
			services.AddScoped<GameRepository>();
			services.AddScoped<RunnerRepository>();
			services.AddScoped<RulesetRepository>();
			services.AddScoped<ChatRepository>();
			services.AddSingleton<SecretsLoader>();
			services.AddSingleton<SessionRunner>();
			Console.WriteLine("Loading Redis");
			services.AddSingleton(ConnectionMultiplexer.Connect("open-leaderbaord-redis.redis.cache.windows.net:6380,password=rv4mccM4X3F9aVq3EuVfbbTVtCPN5nrpaAzCaBGnaFc=,ssl=True,abortConnect=False"));

			services.AddControllers();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if(env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
			}

			app.UseWebSockets(new WebSocketOptions());

			app.UseCors(policy =>
			{
				policy.AllowAnyHeader().AllowCredentials().AllowAnyMethod();
			});

			app.UseRouting();

			app.UseAuthorization();

			app.UseMiddleware<SessionRunnerMiddleware>();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
