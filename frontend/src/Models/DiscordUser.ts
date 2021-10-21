export default interface DiscordUser {
    discordloginid: string,
    username: string,
    discriminator: string,
    avatar: string,
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
    accent_color?: string
}