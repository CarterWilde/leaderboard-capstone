import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { Server } from "./Models";
import axio from "axios";
import { API_ENDPOINT } from "./EnviormentVariables";

axio.defaults.withCredentials = true;

export const fetchServers = createAsyncThunk("server/fetch", async () => {
	return (await axio.get(`${API_ENDPOINT}/servers/@me`, {
		withCredentials: true
	})).data as Server[]
});

const initialState: {
	loading: 'loading' | 'done' | 'error',
	data: Server[]
} = {
	loading: "loading",
	data: []
};

export const serverReducer = createReducer(initialState, builder => {
	builder
		.addCase(fetchServers.rejected, state => {
			state.loading = 'error';
		})
		.addCase(fetchServers.fulfilled, (state, action) => {
			state.loading = 'done';
			state.data = action.payload;
		});
});