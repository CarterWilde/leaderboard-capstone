import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './App.css';
import HomePage from './Components/Pages/HomePage/HomePage';
import { fetchServers } from './reducers';
import { RootState, store } from './store';

export type AppState = {
};

class App extends Component<PropsFromRedux, AppState> {
	async componentDidMount() {
		await store.dispatch(fetchServers());
	}
	
	render () {
		switch (this.props.servers.loading) {
			case "done":
				if(this.props.servers.data.length > 0) {
					return (
						<HomePage/>
					);
				} else {
					return <div>You have no servers!</div>;
				}
			case "error":
				return(<div>There was an error loading servers!</div>);
			case "loading":
				return <div>Loading...</div>;
		}
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);