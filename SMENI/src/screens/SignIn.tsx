import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PAGE_DIAGNOHELP, PAGE_SIGNUP, URL_LOGIN} from "../utils/path";
import {isTokenValid} from "../utils/jwtCheck";
import {WithLocalSvg} from "react-native-svg";
import NetInfo from "@react-native-community/netinfo";


// Function to check if the token is valid and navigate to the appropriate page
const CheckToken = async () => {
    const navigation = useNavigation();
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (isTokenValid(tokenFromStorage)) {
        console.log("token is valid")
        navigation.navigate('SearchPatient');
    }
}

// SignUp component
const SignIn = () => {
    const navigation = useNavigation();

    const isScreenFocused = useIsFocused();

    useEffect(() => {
        // console.log("useEffect connected");
        const unsubscribe = NetInfo.addEventListener(state => {
            if (!(state.isConnected)) {
                console.log("not connected");
                navigation.navigate(PAGE_DIAGNOHELP);
            }
        });
        return unsubscribe;
    }, [isScreenFocused]);

    // Check the token validity
    CheckToken();

    // State variables to hold form data and their respective errors
    const [mail, setMail] = useState('');
    const [mailError, setMailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    // Icons for password visibility toggle
    const visibilityIcon = require('../assets/images/eye-solid.svg');
    const visibilityOffIcon = require('../assets/images/eye-slash-solid.svg');

    // State variable to hold credentials error
    const [credentialsError, setCredentialsError] = useState('');

    // Function to clear the form fields
    const clearForm = () => {
        setMail('');
        setPassword('');
    }

    // Function to handle form submission
    const handleSubmit = () => {
        // Validation checks for each form field
        let mailValid = false;
        const mailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mail.length == 0) {
            setMailError('Mail is required');
        } else if (!mailValidator.test(String(mail).toLowerCase())) {
            setMailError('Mail is not valid, it should be like : example@xyz.com');
        } else {
            setMailError('');
            mailValid = true;
        }
        let passwordValid = false;
        if (password.length == 0) {
            setPasswordError('Password is required');
        } else {
            setPasswordError('');
            passwordValid = true;
        }

        // If all fields are valid, proceed to register the account
        if (mailValid && passwordValid) {
            login();
        }
    }

    // Function to login to an account
    const login = async () => {
        const url = URL_LOGIN;

        // Parameters to be sent in the request body
        const params = {
            mail: mail,
            password: password
        };

        // Create a URLSearchParams object and append the parameters to it
        const formData = new URLSearchParams();
        for (const key in params) {
            // @ts-ignore
            formData.append(key, params[key]);
        }

        try {
            // Send a POST request to the server with the form data
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            })
                .then(response => {
                    if (response.ok) {
                        // If the credentials are correct, store the token in AsyncStorage
                        return response.json();
                    }else if(response.status === 401){
                        // If the credentials are not correct, throw an error
                        throw new Error('The credentials are not correct');
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(data => {
                    // When the token is stored, clear the form and navigate to the SearchPatient page
                    const token = data.token;
                    if (token !== null) {
                        AsyncStorage.setItem('token', token)
                            .then(() => {
                                clearForm();
                                navigation.navigate("SearchPatient");
                            })
                            .catch(error => {
                                console.error('Failed to store token:', error);
                            });
                    }
                }).catch(error => {
                    // If the credentials are not correct, display an error message
                    console.log('error:', error);
                    setCredentialsError('The credentials are not correct');
                });
        } catch (error) {
            console.error('error:', error);
        }
    };


    // SignIn component
    return (
        // KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*header*/}
            <SafeAreaView style={styles.headerWrapper}>
                <Text style={[styles.text, styles.title]}>Sign In</Text>

            </SafeAreaView>
            {/*form*/}
            <SafeAreaView>
                {/*Mail*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <Text style={[styles.text, styles.subtitle]}>Mail</Text>
                    <TextInput
                        value={mail}
                        style={[styles.input]}
                        placeholder={'Mail'}
                        onChangeText={(text) => setMail(text)}
                    />
                    <Text style={styles.errorInput}>{mailError}</Text>
                </SafeAreaView>
                {/*Password*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <SafeAreaView style={styles.passwordWrapper}>
                        <Text style={[styles.text, styles.subtitle]}>Password</Text>
                        <TouchableOpacity onPress={() => setPasswordIsVisible(!passwordIsVisible)}>
                            {passwordIsVisible ? <WithLocalSvg asset={visibilityIcon} width={25} height={25}/> :
                                <WithLocalSvg asset={visibilityOffIcon} width={25} height={25}/>}
                        </TouchableOpacity>
                    </SafeAreaView>
                    <TextInput
                        value={password}
                        style={[styles.input]}
                        placeholder={'Password'}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={!passwordIsVisible}
                    />
                    <Text style={styles.errorInput}>{passwordError}</Text>
                </SafeAreaView>

                <SafeAreaView>
                    <SafeAreaView style={styles.submit}>
                        <TouchableOpacity
                            onPress={() => {
                                handleSubmit();
                            }}
                            style={[styles.buttonContent, styles.button, (mail === '' || password === '') && styles.disabledButton]}
                        >
                            <Text style={[styles.text, styles.title, styles.buttonText]}>Sign In</Text>
                        </TouchableOpacity>
                        <Text style={styles.credentialsError}>{credentialsError}</Text>
                    </SafeAreaView>
                </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView style={styles.navigateWrapper}>
                <Text style={[styles.text, styles.subtitle]}>No account ?</Text>
                <TouchableOpacity
                    onPress={() => {
                        clearForm();
                        navigation.navigate(PAGE_SIGNUP);
                    }}>
                    <Text style={[styles.text, styles.subtitle, styles.navigate]}>Create One !</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <SafeAreaView style={styles.navigateWrapper}>
                <Text style={[styles.text, styles.subtitle]}>Only want to predict something ?</Text>
                <TouchableOpacity
                    onPress={() => {
                        clearForm();
                        navigation.navigate("DiagnoPage");
                    }}>
                    <Text style={[styles.text, styles.subtitle, styles.navigate]}>Click Here !</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    }, headerWrapper: {
        alignItems: 'center', marginTop: 65, marginBottom: 20,
    }, labelWrapper: {
        flexDirection: 'column', alignItems: 'flex-start', marginLeft: 20,
    }, text: {
        color: '#0E1012',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 32,
        letterSpacing: 0.01,
    }, title: {
        fontWeight: '700', fontSize: 30,
    }, subtitle: {
        fontWeight: '700', fontSize: 17,
    }, navigate: {
        textDecorationLine: 'underline', marginLeft: 10,
    }, input: {
        borderRadius: 15,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBackground,
        color: colors.default,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '95%',
    }, invalidInput: {
        borderColor: 'red', // Couleur de la bordure en cas d'input invalide
    }, errorInput: {
        color: 'red',
        marginTop: 5,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%'
    },
    button: {
        borderColor: '#96D3FE',
        borderWidth: 1,
        borderRadius: 30,
        alignContent: 'center',
        alignItems: 'center',
        width: '85%',
        padding: 10,
        alignSelf: 'center',
        marginVertical: 20,
        backgroundColor: '#96D3FE',
        marginRight: 10
    }, buttonContent: {
        flex: 1, opacity: 1, // Default opacity when the button is enabled
    }, buttonText: {
        color: 'white'
    }, navigateWrapper: {
        flexDirection: 'row', alignItems: 'center', marginTop: 15,
        justifyContent: 'center'
    }, submit: {
        alignItems: 'center',
    },
    credentialsError: {
        color: 'red',
        fontSize: 20,

    }
});
export default SignIn;
