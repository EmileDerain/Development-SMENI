const URL = "172.16.6.108"

const API_URL = `http://${URL}:2834/api/`

const URL_LOGIN = `${API_URL}user/login`
const URL_SIGNUP = `${API_URL}user/signup`
const URL_AUDIO = `${API_URL}audio`
const URL_PREDICT = `${API_URL}cnn/predict`

const PAGE_SIGNIN = 'SignIn'
const PAGE_SIGNUP = 'SignUp'
const PAGE_DIAGNOHELP = 'DiagnoHelp'

export {URL_LOGIN, URL_SIGNUP, URL_AUDIO, URL_PREDICT, PAGE_SIGNUP, PAGE_DIAGNOHELP, PAGE_SIGNIN}