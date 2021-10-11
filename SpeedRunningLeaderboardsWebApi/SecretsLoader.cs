using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace SpeedRunningLeaderboardsWebApi
{
	public record Secrets(string CLIENT_SECRET);
	public class SecretsLoader
	{
		public Secrets GetSecrets()
		{
			using var stream = new StreamReader(new FileStream("./secrets.json", FileMode.Open, FileAccess.Read));
			var result = JsonSerializer.Deserialize<Secrets>(stream.ReadToEnd());
			if(result == null) throw new Exception("Couldn't parse secrets!");
			return result;
		}
	}
}
