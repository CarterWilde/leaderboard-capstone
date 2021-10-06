using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class DiscordLogin
	{
		[JsonPropertyName("id")]
		public string DiscordLoginID { get; set; } = string.Empty;
		public string Username { get; set; } = string.Empty;
		public string Discriminator { get; set; } = string.Empty;
		public string Avatar { get; set; } = string.Empty;
		public bool? Bot { get; set; }
		public bool? System { get; set; }
		[JsonPropertyName("mfa_enabled")]
		public bool? MfaEnabled { get; set; }
		public string? Locale { get; set; }
		public bool? Verified { get; set; }
		public string? Email { get; set; }
		public int? Flags { get; set; }
		[JsonPropertyName("premium_type")]
		public int? PremiumType { get; set; }
		public string? Banner { get; set; }
		[JsonPropertyName("accent_color")]
		//Docs say nothing about this type, but it returns a JSON Number
		public int? AccentColor { get; set; }
		[JsonPropertyName("public_flags")]
		public int? PublicFlags { get; set; }

		public DiscordLogin()
		{

		}
		public DiscordLogin(string discordLoginID, string username, string discriminator, string avatar, bool? bot, bool? system, bool? mfaEnabled, string? locale, bool? verified, string? email, int? flags, int? premiumType, string? banner, int? accentColor, int? publicFlags)
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

		public DiscordLogin(DiscordLogin discordUser)
		{
			DiscordLoginID = discordUser.DiscordLoginID;
			Username = discordUser.Username;
			Discriminator = discordUser.Discriminator;
			Avatar = discordUser.Avatar;
			Bot = discordUser.Bot;
			System = discordUser.System;
			MfaEnabled = discordUser.MfaEnabled;
			Locale = discordUser.Locale;
			Verified = discordUser.Verified;
			Email = discordUser.Email;
			Flags = discordUser.Flags;
			PremiumType = discordUser.PremiumType;
			Banner = discordUser.Banner;
			AccentColor = discordUser.AccentColor;
			PublicFlags = discordUser.PublicFlags;
		}
	}
}
