using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpeedRunningLeaderboards.Models
{
	public class Runner : DiscordLogin
	{
		public Guid RunnerID { get; set; }
		public int? RegionID { get; set; }
		public DateTime SignUpDate { get; set; }
		public IEnumerable<Authority> RunnerAuthorities { get; set; }
		public IEnumerable<Social> Socials { get; set; }
		public Runner(Guid runnerID
								 , int? regionID
								 , DateTime signUpDate
								 , IEnumerable<Authority> authorities
								 , IEnumerable<Social> socials
								 , string discordLoginID
								 , string username
								 , string discriminator
								 , string avatar
								 , bool? bot
								 , bool? system
								 , bool? mfaEnabled
								 , string? locale
								 , bool? verified
								 , string? email
								 , int? flags
								 , int? premiumType
								 , string? bannerColor
								 , string? accentColor) 
					 : base(discordLoginID
								 , username
								 , discriminator
								 , avatar
								 , bot
								 , system
								 , mfaEnabled
								 , locale
								 , verified
								 , email
								 , flags
								 , premiumType
								 , bannerColor
								 , accentColor
						)
		{
			RunnerID = runnerID;
			RegionID = regionID;
			SignUpDate = signUpDate;
			RunnerAuthorities = authorities;
			Socials = socials;
		}
	}
}
