import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {URL_SIGNUP} from "../utils/path";


const SignUp = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');


    const registerAccount = async () => {
        const url = URL_SIGNUP; //TODO : ipconfig et mettre son addresse IP locale

        const params = {
            firstName: firstName,
            lastName: lastName,
            mail: mail,
            password: password
        };

        const formData = new URLSearchParams();
        for (const key in params) {
            // @ts-ignore
            formData.append(key, params[key]);
        }

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (response.ok) {
                console.log('response ok');
                navigation.navigate('SignIn');
            } else{
                console.error('mail is already used');
                //TODO : create a popup to say that the mail is already used

            }
        } catch (error) {
            console.error('error:', error);
        }
    };


    return (
        // KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
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
                </SafeAreaView>
                {/*Password*/}
                <SafeAreaView style={styles.labelWrapper}>
                    <Text style={[styles.text, styles.subtitle]}>Password</Text>
                    <TextInput
                        value={password}
                        style={[styles.input]}
                        placeholder={'Password'}
                        onChangeText={(text) => setPassword(text)}
                    />
                </SafeAreaView>
                {/*TODO : peut être rajouter un champ confirm password    */}

                <SafeAreaView>
                    <SafeAreaView>
                        <TouchableOpacity
                            onPress={() => {
                                registerAccount();
                                //TODO : créer la méthode pour envoyer le compte au back
                            }}
                            disabled={firstName === '' || lastName === '' || mail === '' || password === ''}
                            style={[styles.buttonContent, styles.button, (firstName === '' || lastName === '' || mail === '' || password === '') && styles.disabledButton]}
                        >
                            <Text style={[styles.text, styles.title]}>Create</Text>

                        </TouchableOpacity>
                    </SafeAreaView>

                </SafeAreaView>

            </SafeAreaView>

            <SafeAreaView style={styles.labelWrapper}>
                <Text style={[styles.text, styles.subtitle]}>Already have an account ?</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SignIn');
                    }}>
                    <Text style={[styles.text, styles.subtitle, styles.navigate]}>Sign In</Text>
                </TouchableOpacity>
            </SafeAreaView>

        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 65,
        marginLeft: 25,
        marginRight: 20,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 30,
        marginBottom: 20,
    },
    text: {
        color: '#0E1012',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 32,
        letterSpacing: 0.01,
    },
    title: {
        fontWeight: '700',
        fontSize: 27,
    },
    subtitle: {
        fontWeight: '700',
        fontSize: 17,
    },
    navigate:{
        textDecorationLine: 'underline',
        marginLeft: 10,
    },
    input: {
        borderRadius: 30,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBackground,
        color: colors.default,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '50%',
        marginLeft: 10,
    },
    invalidInput: {
        borderColor: 'red', // Couleur de la bordure en cas d'input invalide
    },
    button: {
        borderColor: colors.default,
        borderWidth: 1,
        borderRadius: 30,
        alignContent: 'center',
        alignItems: 'center',
        width: '40%',
        padding: 10,
        alignSelf: 'center',
        marginVertical: 20,
    },
    buttonContent: {
        flex: 1,
        opacity: 1, // Default opacity when the button is enabled
    },
    disabledButton: {
        opacity: 0.5, // Opacity when the button is disabled
    },
});

export default SignUp;
