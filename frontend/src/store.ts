import { configureStore } from "@reduxjs/toolkit";
import { serverReducer } from "./reducers";

export const store = configureStore({
	reducer: {
		servers: serverReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;