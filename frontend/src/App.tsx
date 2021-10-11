import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './App.css';
import { NoServersPage } from './Components/Pages';
import HomePage from './Components/Pages/HomePage/HomePage';
import { RootState } from './store';

export type AppState = {
};

class App extends Component<PropsFromRedux, AppState> {
	render () {
		switch (this.props.servers.loading) {
			case "done":
				if(this.props.servers.data.length > 0) {
					return (
						<HomePage/>
					);
				} else {
					return <NoServersPage/>;
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