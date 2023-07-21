const URL = "172.25.192.1" //TODO : ipconfig et mettre son addresse IP locale

const API_URL = `http://${URL}:2834/api/`

const URL_LOGIN = `${API_URL}user/login`
const URL_SIGNUP = `${API_URL}user/signup`
const URL_AUDIO = `${API_URL}audio`
const URL_PREDICT = `${API_URL}cnn/predict`
const URL_CREATE_PATIENT = `${API_URL}patient/createPatient`
const URL_GET_PATIENT = `${API_URL}patient/getAllPatients`

const PAGE_SIGNIN = 'SignIn'
const PAGE_SIGNUP = 'SignUp'
const PAGE_DIAGNOHELP = 'DiagnoHelp'
const PAGE_SEARCH_PATIENT= 'SearchPatient'
const PAGE_HOME = 'Home'
const PAGE_PATIENTDETAILS = 'PatientDetails'

export {URL_LOGIN, URL_SIGNUP, URL_AUDIO, URL_PREDICT, URL_GET_PATIENT, PAGE_SIGNUP, PAGE_DIAGNOHELP, PAGE_SIGNIN, PAGE_PATIENTDETAILS, URL_CREATE_PATIENT}
