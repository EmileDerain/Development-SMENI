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

export const orderByAudio = (orderBy) => {
    return {
        type: ActionTypes.ORDER_BY_AUDIOS,
        payload: orderBy,
    };
};

export const setAudioLabels = (labels) => {
    return {
        type: ActionTypes.SET_LABELS_AUDIOS,
        payload: labels,
    };
};

export const setStreamAudio = (streamAudio) => {
    console.log("streamAudio:", streamAudio);
    // Modifier les valeurs audioId, playing, duration, audioName selon vos besoins
    return {
        type: ActionTypes.SET_STREAM_AUDIO,
        payload: streamAudio,
    };
};

export const setStreamAudioDuration = (streamAudioCurrentDuration) => {
    // console.log("setStreamAudioDuration:", streamAudioCurrentDuration);
    return {
        type: ActionTypes.SET_STREAM_AUDIO_DURATION,
        payload: streamAudioCurrentDuration,
    };
};

export const showReload = (logsCNN) => {
    return {
        type: ActionTypes.SHOW_RELOAD,
        payload: logsCNN,
    };
};
