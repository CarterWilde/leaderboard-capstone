console.log(process.env.NODE_ENV);

export let API_ENDPOINT: string;
export let DISCORD_LOGIN_URL: string;
export let WEBSOCKET_ENDPOINT: string;

switch (process.env.NODE_ENV) {
	case "development":
		API_ENDPOINT = "http://localhost:8080/proxy/api";
		DISCORD_LOGIN_URL = "https://discord.com/api/oauth2/authorize?client_id=895124412561506314&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauthentication&response_type=code&scope=identify";
		WEBSOCKET_ENDPOINT = "ws://localhost:5000/api"
		break;
	default:
		API_ENDPOINT = "https://open-leaderboard-backend.azurewebsites.net/api";
		DISCORD_LOGIN_URL = "https://discord.com/api/oauth2/authorize?client_id=895124412561506314&redirect_uri=https%3A%2F%2Fopen-leaderboard-backend.azurewebsites.net%2Fapi%2Fauthentication&response_type=code&scope=identify";
		WEBSOCKET_ENDPOINT = window.location.hostname;
		break;
}
