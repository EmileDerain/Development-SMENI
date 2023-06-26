const URL = "172.16.6.108"

const API_URL = `http://${URL}:2834/api/`

const URL_LOGIN = `${API_URL}user/login`
const URL_SIGNUP = `${API_URL}user/signup`

const URL_AUDIO = `${API_URL}audio`

const PREDICT_URL = `${API_URL}cnn/predict`

export {URL_LOGIN, URL_SIGNUP, URL_AUDIO, PREDICT_URL}