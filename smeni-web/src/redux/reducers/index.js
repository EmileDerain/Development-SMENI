import { combineReducers } from "redux";
import { audiosReducer } from "./audiosReducer";
import {cnnReducer} from "./cnnReducer";

const reducers = combineReducers({
    allAudios: audiosReducer,
    cnn: cnnReducer,
});

export default reducers;
