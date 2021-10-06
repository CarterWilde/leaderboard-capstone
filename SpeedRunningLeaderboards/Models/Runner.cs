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
		public Region? Region { get; set; }
		public DateTime SignUpDate { get; set; }
		public ICollection<Authority> RunnerAuthorities { get; set; } = new List<Authority>();
		public ICollection<Social> Socials { get; set; } = new List<Social>();
		public Runner()
		{

		}
		public Runner(int? regionId
								 , DateTime signUpDate
								 , ICollection<Authority> authorities
								 , ICollection<Social> socials
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
								 , int? accentColor
								 , int? publicFlags) 
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
								 , publicFlags
						)
		{
			RegionID = regionId;
			SignUpDate = signUpDate;
			RunnerAuthorities = authorities;
			Socials = socials;
		}

		public Runner(DiscordLogin discordUser, int? regionId, DateTime signUpDate, ICollection<Authority> authorities, ICollection<Social> socials) : base(discordUser)
		{
			RegionID = regionId;
			SignUpDate = signUpDate;
			RunnerAuthorities = authorities;
			Socials = socials;
		}
	}
}
