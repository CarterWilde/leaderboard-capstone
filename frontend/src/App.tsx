import { CircularProgress } from '@material-ui/core';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './App.css';
import BackgroundEffect, { Point } from './Components/BackgroundEffect';
import { NoServersPage } from './Components/Pages';
import HomePage from './Components/Pages/HomePage/HomePage';
import { RootState } from './store';

export type AppState = {
};

class App extends Component<PropsFromRedux, AppState> {
	pointState: Point[] = [];
	render () {
		if(this.props.isLoading.isLoading || this.props.servers.loading === "loading") {
			return (
				<div style={{height: "100%"}}>
					<div style={{position: "fixed", width: "100%", height: "100%", display:"flex", alignItems: "center", justifyContent: "center"}}>
						<CircularProgress size="3em" thickness={2} style={{color: "#d081f8"}}/>
					</div>
					<BackgroundEffect points={this.pointState}/>
				</div>
			);
		}
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
		}
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);