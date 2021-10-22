import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import axios from 'axios';
import { API_ENDPOINT, DISCORD_LOGIN_URL } from './EnviormentVariables';
import { fetchServers, hasLoginAction, setLoading, setRunnerAction } from './reducers';
import { Runner } from './Models';



class ApiError {
	code: number;
	error: string;
	message: string;
	constructor(code: number, error: string, message: string) {
		this.code = code;
		this.error = error;
		this.message = message;
	}
};

axios.defaults.withCredentials = true;

const onLoading = async () => {
	let loginData = (await axios.get(`${API_ENDPOINT}/Authentication/login`)).data;
	if ("error" in loginData) {
		var error = (loginData as ApiError);
		if (error.error === "NoSession") {
			store.dispatch(hasLoginAction(false));
			window.location.href = DISCORD_LOGIN_URL;
		} else {
			throw new Error(`Api threw error! ${error.error}(${error.code}) - ${error.message}`);
		}
	} else if("runnerID" in loginData) {
		store.dispatch(hasLoginAction(true));
		store.dispatch(setRunnerAction((loginData as Runner)));
		await store.dispatch(fetchServers());
	}
}


onLoading().then(() => {
	store.dispatch(setLoading(false));
});

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<div id="app">
				<App />
			</div>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
