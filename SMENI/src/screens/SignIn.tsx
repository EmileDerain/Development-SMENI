import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {URL_LOGIN} from "../utils/path";
import {isTokenValid} from "../utils/jwtCheck";
import {WithLocalSvg} from "react-native-svg";


const CheckToken = async () => {
    const navigation = useNavigation();
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (isTokenValid(tokenFromStorage)) {
        console.log("token is valid")
        navigation.navigate('DiagnoHelp');
    }
}

const SignIn = () => {
    const navigation = useNavigation();
    CheckToken();

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    const visibilityIcon = require('../assets/images/eye-solid.svg');
    const visibilityOffIcon = require('../assets/images/eye-slash-solid.svg');

    const clearForm = () => {
        setMail('');
        setPassword('');
    }

    const login = async () => {
        const url = URL_LOGIN; //TODO : ipconfig et mettre son addresse IP locale

        const params = {
            mail: mail,
            password: password
        };

        const formData = new URLSearchParams();
        for (const key in params) {
            // @ts-ignore
            formData.append(key, params[key]);
        }

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('The credentials are not correct');
                })
                .then(data => {
                    const token = data.token;
                    if (token !== null) {
                        // Utiliser AsyncStorage pour stocker le token
                        AsyncStorage.setItem('token', token)
                            .then(() => {
                                clearForm();
                                navigation.navigate('DiagnoHelp');
                            })
                            .catch(error => {
                                console.error('Failed to store token:', error);
                            });
                    }
                });
        } catch (error) {
            console.error('error:', error);
        }
    };


    return (
        // KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*header*/}
            <SafeAreaView style={styles.headerWrapper}>
                <Text style={[styles.text, styles.title]}>Sign In</Text>

            </SafeAreaView>
            {/*form*/}
            <SafeAreaView style={styles.form}>
                {/*Mail*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <Text style={[styles.text, styles.subtitle]}>Mail</Text>
                    <TextInput
                        value={mail}
                        style={[styles.input]}
                        placeholder={'Mail'}
                        onChangeText={(text) => setMail(text)}
                    />
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
                </SafeAreaView>
                {/*TODO : peut être rajouter un champ confirm password    */}

                <SafeAreaView>
                    <SafeAreaView>
                        <TouchableOpacity
                            onPress={() => {
                                login();
                                //TODO : créer la méthode pour envoyer le compte au back
                            }}
                            disabled={mail === '' || password === ''}
                            style={[styles.buttonContent, styles.button, (mail === '' || password === '') && styles.disabledButton]}
                        >
                            <Text style={[styles.text, styles.title, styles.buttonText]}>Sign In</Text>

                        </TouchableOpacity>
                    </SafeAreaView>
                </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView style={styles.navigateWrapper}>
                <Text style={[styles.text, styles.subtitle]}>No account ?</Text>
                <TouchableOpacity
                    onPress={() => {
                        clearForm();
                        navigation.navigate('SignUp');
                    }}>
                    <Text style={[styles.text, styles.subtitle, styles.navigate]}>Create One !</Text>
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
    }, disabledButton: {
        opacity: 1, // Opacity when the button is disabled
    }
});
export default SignIn;