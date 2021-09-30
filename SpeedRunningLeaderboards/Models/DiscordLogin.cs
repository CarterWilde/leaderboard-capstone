using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class DiscordLogin
	{
		public string DiscordLoginID { get; set; } = string.Empty;
		public string Username { get; set; } = string.Empty;
		public string Discriminator { get; set; } = string.Empty;
		public string Avatar { get; set; } = string.Empty;
		public bool? Bot { get; set; }
		public bool? System { get; set; }
		public bool? MfaEnabled { get; set; }
		public string? Locale { get; set; }
		public bool? Verified { get; set; }
		public string? Email { get; set; }
		public int? Flags { get; set; }
		public int? PremiumType { get; set; }
		public string? Banner { get; set; }
		public string? AccentColor { get; set; }
		public int? PublicFlags { get; set; }

		internal DiscordLogin()
		{

		}
		public DiscordLogin(string discordLoginID, string username, string discriminator, string avatar, bool? bot, bool? system, bool? mfaEnabled, string? locale, bool? verified, string? email, int? flags, int? premiumType, string? banner, string? accentColor, int? publicFlags)
		{
			DiscordLoginID = discordLoginID;
			Username = username;
			Discriminator = discriminator;
			Avatar = avatar;
			Bot = bot;
			System = system;
			MfaEnabled = mfaEnabled;
			Locale = locale;
			Verified = verified;
			Email = email;
			Flags = flags;
			PremiumType = premiumType;
			Banner = banner;
			AccentColor = accentColor;
			PublicFlags = publicFlags;
		}
	}
}
