import { ActionTypes } from "../constants/action-types";


export const showModels = (models) => {
    return {
        type: ActionTypes.SHOW_MODELS,
        payload: models,
    };
};

export const setAudios = (audios) => {
    return {
        type: ActionTypes.SET_AUDIOS,
        payload: audios,
    };
};
export const showReload = (logsCNN) => {
    return {
        type: ActionTypes.SHOW_RELOAD,
        payload: logsCNN,
    };
};
