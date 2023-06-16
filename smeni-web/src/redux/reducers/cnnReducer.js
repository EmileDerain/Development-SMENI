import {ActionTypes} from "../constants/action-types";

const intialState = {
    logsCNN: "None",
};

export const cnnReducer = (state = intialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SHOW_RELOAD:
            return {...state, logsCNN: payload};
        default:
            return state;
    }
};
