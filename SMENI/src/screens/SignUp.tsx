import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {PAGE_DIAGNOHELP, PAGE_SIGNIN, URL_SIGNUP} from "../utils/path";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {isTokenValid} from "../utils/jwtCheck";
import {WithLocalSvg} from 'react-native-svg';
import NetInfo from "@react-native-community/netinfo";



const CheckToken = async () => {
    const navigation = useNavigation();
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (isTokenValid(tokenFromStorage)) {
        console.log("token is valid")
        navigation.navigate(PAGE_DIAGNOHELP);
    }
}

const SignUp = () => {
    const navigation = useNavigation();

    const Unsubscribe = NetInfo.addEventListener(state => {
        if (!state.isConnected) {
            navigation.navigate(PAGE_DIAGNOHELP);
            return;
        }
    });

    Unsubscribe();

    CheckToken();

    const [firstName, setFirstName] = useState('');
    const [fistNameError, setFirstNameError] = useState(''); //TODO : faire un style pour les erreurs
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [mail, setMail] = useState('');
    const [mailError, setMailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);


    const visibilityIcon = require('../assets/images/eye-solid.svg');
    const visibilityOffIcon = require('../assets/images/eye-slash-solid.svg');

    const handleSubmit = () => {
        let firstNameValid = false;
        if (firstName.length == 0) {
            setFirstNameError('First Name is required');
        } else {
            setFirstNameError('');
            firstNameValid = true;
        }

        let lastNameValid = false;
        if (lastName.length == 0) {
            setLastNameError('Last Name is required');
        } else {
            setLastNameError('');
            lastNameValid = true;
        }

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
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else if (password.length > 20) {
            setPasswordError('Password must be at most 20 characters long');
        } else if (!password.match(/[a-z]/g)) {
            setPasswordError('Password must contain at least one lowercase letter');
        } else if (!password.match(/[A-Z]/g)) {
            setPasswordError('Password must contain at least one uppercase letter');
        } else if (!password.match(/[0-9]/g)) {
            setPasswordError('Password must contain at least one number');
        } else if (!password.match(/[^a-zA-Z\d]/g)) {
            setPasswordError('Password must contain at least one special character');
        } else {
            setPasswordError('');
            passwordValid = true;
        }

        if (firstNameValid && lastNameValid && mailValid && passwordValid) {
            registerAccount();
        }
    }

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setMail('');
        setPassword('');
    }

    const registerAccount = async () => {
        const url = URL_SIGNUP; //TODO : ipconfig et mettre son addresse IP locale

        const params = {
            firstName: firstName, lastName: lastName, mail: mail, password: password
        };

        const formData = new URLSearchParams();
        for (const key in params) {
            // @ts-ignore
            formData.append(key, params[key]);
        }

        try {
            const response = await fetch(url, {
                method: 'POST', headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }, body: formData.toString(),
            });

            if (response.ok) {
                console.log('response ok');
                clearForm();
                navigation.navigate(PAGE_SIGNIN);
            } else {
                console.error('mail is already used');
                //TODO : create a popup to say that the mail is already used

            }
        } catch (error) {
            console.error('error:', error);
        }
    };


    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*header*/}
            <SafeAreaView style={styles.headerWrapper}>
                <Text style={[styles.text, styles.title]}>Create Your Account</Text>
            </SafeAreaView>
            {/*form*/}
            <SafeAreaView>
                {/*First Name*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <Text style={[styles.text, styles.subtitle]}>First Name</Text>
                    <TextInput
                        value={firstName}
                        style={[styles.input]}
                        placeholder={'First Name'}
                        onChangeText={(text) => setFirstName(text)}
                    />
                    <Text style={styles.errorInput}>{fistNameError}</Text>
                </SafeAreaView>
                {/*Last Name*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <Text style={[styles.text, styles.subtitle]}>Last Name</Text>
                    <TextInput
                        value={lastName}
                        style={[styles.input]}
                        placeholder={'Last Name'}
                        onChangeText={(text) => setLastName(text)}
                    />
                    <Text style={styles.errorInput}>{lastNameError}</Text>
                </SafeAreaView>
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
                {/*TODO : peut être rajouter un champ confirm password    */}

                <SafeAreaView>
                    <SafeAreaView>
                        <TouchableOpacity
                            onPress={() => {
                                handleSubmit();
                                //TODO : créer la méthode pour envoyer le compte au back
                            }}
                            // disabled={firstName === '' || lastName === '' || mail === '' || password === ''}
                            style={[styles.buttonContent, styles.button]} //, (firstName === '' || lastName === '' || mail === '' || password === '') && styles.disabledButton]}
                        >
                            <Text style={[styles.text, styles.title, styles.buttonText]}>Create</Text>

                        </TouchableOpacity>
                    </SafeAreaView>

                </SafeAreaView>

            </SafeAreaView>

            <SafeAreaView style={styles.navigateWrapper}>
                <Text style={[styles.text, styles.subtitle]}>Already have an account ?</Text>
                <TouchableOpacity
                    onPress={() => {
                        clearForm();
                        navigation.navigate(PAGE_SIGNIN);
                    }}>
                    <Text style={[styles.text, styles.subtitle, styles.navigate]}>Sign In</Text>
                </TouchableOpacity>
            </SafeAreaView>

        </KeyboardAwareScrollView>);
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
    passwordWrapper:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'90%'
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
        color:'white'
    }, navigateWrapper: {
        flexDirection: 'row', alignItems: 'center', marginTop: 15,
        justifyContent:'center'
    }
});

export default SignUp;
