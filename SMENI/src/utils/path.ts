const URL = "172.25.192.1" //TODO : use ipconfig to get your ip address, change it when it will be on a server


// the API that we use to communicate with the server
const API_URL = `http://${URL}:2834/api/`


// the differents url that we use to communicate with the server
const URL_LOGIN = `${API_URL}user/login`
const URL_SIGNUP = `${API_URL}user/signup`
const URL_AUDIO = `${API_URL}audio`
const URL_PREDICT = `${API_URL}cnn/predict`
const URL_CREATE_PATIENT = `${API_URL}patient/createPatient`
const URL_GET_PATIENT = `${API_URL}patient/getAllPatients`

// just to facilitate the navigation between the differents pages
const PAGE_SIGNIN = 'SignIn'
const PAGE_SIGNUP = 'SignUp'
const PAGE_DIAGNOHELP = 'DiagnoHelp'
const PAGE_SEARCH_PATIENT= 'SearchPatient'
const PAGE_HOME = 'Home'
const PAGE_PATIENTDETAILS = 'PatientDetails'

export {URL_LOGIN, URL_SIGNUP, URL_AUDIO, URL_PREDICT, URL_GET_PATIENT, PAGE_SIGNUP, PAGE_DIAGNOHELP, PAGE_SIGNIN, PAGE_PATIENTDETAILS, URL_CREATE_PATIENT}
