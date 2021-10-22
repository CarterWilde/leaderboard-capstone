import DiscordUser from "./DiscordUser";

export default class Runner implements DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	locale?: string;
	verified?: string;
	email?: string;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
	banner_color?: string;
	accent_color?: string;
	runnerID: string;
	regionID?: number;
	signUpDate: Date;
	constructor(discordloginid: string, 
							username: string,
							discriminator: string,
							avatar: string,
							runnerId: string,
							signUpDate: Date,
							bot?: boolean,
							system?: boolean,
							mfa_enabled?: boolean,
							locale?: string,
							verified?: string,
							email?: string,
							flags?: number,
							premium_type?: number,
							public_flags?: number,
							banner_color?: string,
							accent_color?: string,
							regionId?: number
	) {
		this.id = discordloginid;
		this.username = username;
		this.discriminator = discriminator;
		this.avatar = avatar;
		this.bot = bot;
		this.system = system;
		this.mfa_enabled = mfa_enabled;
		this.locale = locale;
		this.verified = verified;
		this.email = email;
		this.flags = flags;
		this.premium_type = premium_type;
		this.public_flags = public_flags;
		this.banner_color = banner_color;
		this.accent_color = accent_color;
		this.runnerID = runnerId;
		this.regionID = regionId;
		this.signUpDate = signUpDate;
	}
}