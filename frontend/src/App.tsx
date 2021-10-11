import { CircularProgress } from '@material-ui/core';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './App.css';
import BackgroundEffect from './Components/BackgroundEffect';
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
				return (
					<div style={{height: "100%"}}>
						<div style={{position: "fixed", width: "100%", height: "100%", display:"flex", alignItems: "center", justifyContent: "center"}}>
							<CircularProgress size="3em" thickness={2} style={{color: "#d081f8"}}/>
						</div>
						<BackgroundEffect/>
					</div>
				);
		}
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);