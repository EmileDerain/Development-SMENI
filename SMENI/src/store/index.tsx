import { configureStore } from '@reduxjs/toolkit';
import {exempleSlice} from "./exempleSlice";

export const store = configureStore({
    reducer: {
        exemple: exempleSlice.reducer,
    },
});
