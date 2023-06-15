import {ActionTypes} from "../constants/action-types";

const intialState = {
    audios: [],
};

export const audiosReducer = (state = intialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SET_AUDIOS:
            return {...state, audios: payload};
        default:
            return state;
    }
};
