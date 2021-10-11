import { createAction, createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { Runner, Server } from "./Models";
import axio from "axios";
import { API_ENDPOINT } from "./EnviormentVariables";

export const fetchServers = createAsyncThunk("server/fetch", async () => {
	return (await axio.get(`${API_ENDPOINT}/servers/@me`, {
		withCredentials: true
	})).data as Server[]
});

export const addServer = createAction<Server>("addServer");

const serverInitialState: {
	loading: 'loading' | 'done' | 'error',
	data: Server[]
} = {
	loading: "loading",
	data: []
};

export const serverReducer = createReducer(serverInitialState, builder => {
	builder
		.addCase(fetchServers.rejected, state => {
			state.loading = 'error';
		})
		.addCase(fetchServers.fulfilled, (state, action) => {
			state.loading = 'done';
			state.data = action.payload;
		})
		.addCase(addServer, (state, action) => {
			state.data.push(action.payload);
		});
});

const authenticationInitialState: {
	hasLogin: boolean,
	runner?: Runner
} = {
	hasLogin: false,
	runner: undefined
};

export const hasLoginAction = createAction<boolean>("hasLogin");

export const setRunnerAction = createAction<Runner>("setRunner");

export const authenticationReducer = createReducer(authenticationInitialState, builder => {
	builder
		.addCase(hasLoginAction, (state, action) => {
			state.hasLogin = action.payload;
		})
		.addCase(setRunnerAction, (state, action) => {
			state.runner = action.payload;
		});
});


export const setLoading = createAction<boolean>("setLoading");

export const loadingReducer = createReducer({isLoading: true}, builder => {
	builder.addCase(setLoading, (state, action) => {
		state.isLoading = action.payload;
	});
});