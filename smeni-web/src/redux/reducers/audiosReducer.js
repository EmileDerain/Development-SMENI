import {ActionTypes} from "../constants/action-types";

const intialState = {
    audios: [],
    orderBy: "Label",
    subOption: "Label",
    labels:[],

    audioId: undefined,
    playing : false,
    duration : 0,
    audioName : undefined,
    currentDuration : 0,
};

export const audiosReducer = (state = intialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SET_AUDIOS:
            return {...state, audios: payload};
        case ActionTypes.ORDER_BY_AUDIOS:
            return {...state, orderBy: payload};
        case ActionTypes.SET_LABELS_AUDIOS:
            return {...state, labels: payload};
        case ActionTypes.SET_STREAM_AUDIO:
            return { ...state, ...payload };
        case ActionTypes.SET_STREAM_AUDIO_DURATION:
            return {...state, currentDuration: payload};
        default:
            return state;
    }
};
