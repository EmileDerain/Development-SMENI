import {decode as base64Decode} from 'base-64';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to parse JWT
function parseJwt(token: string | null) {
    if (token === null || token.indexOf('.') === -1) {
        return null;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    try {
        const decodedData = base64Decode(base64);
        const parsedData = JSON.parse(decodedData);

        return parsedData;
    } catch (error) {
        console.error('Failed to parse JWT:', error);
        return null;
    }
}

// Function to check if JWT is valid
function isTokenValid(token: string | null) {
    if(token === null) return false;
    let parsedJwt = parseJwt(token);
    if (parsedJwt === null || parsedJwt.exp === undefined) return false;
    let expirationTime = parsedJwt.exp;
    let currentTime = Date.now() / 1000;
    return currentTime < expirationTime;
}


function getTokenFromStorage() {
    return AsyncStorage.getItem('token')
        .then((value) => {
            console.log('Retrieved token from AsyncStorage:', value);
            return value;
        })
        .catch((error) => {
            console.error('Failed to retrieve token from AsyncStorage:', error);

        });


}

export {isTokenValid, getTokenFromStorage, parseJwt};