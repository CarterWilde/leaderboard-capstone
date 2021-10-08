import { configureStore } from "@reduxjs/toolkit";
import { authenticationReducer, loadingReducer, serverReducer } from "./reducers";

export const store = configureStore({
	reducer: {
		servers: serverReducer,
		authentication: authenticationReducer,
		isLoading: loadingReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;