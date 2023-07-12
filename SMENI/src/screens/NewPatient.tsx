import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {WithLocalSvg} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import {URL_CREATE_PATIENT} from "../utils/path";


const NewPatient = () => {

    const navigation = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [height, setHeight] = useState('');
    const [heightError, setHeightError] = useState('');
    const [weight, setWeight] = useState('');
    const [weightError, setWeightError] = useState('');
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');


    const goBack = require('../assets/images/arrow-left-solid.svg');

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

        /*let dateOfBirthValid = false;
        if (dateOfBirth.length == 0) {
            setDateOfBirthError('Date of Birth is required');
        } else {
            setDateOfBirthError('');
            dateOfBirthValid = true;
        }

        let heightValid = false;
        if (height.length == 0) {
            setHeightError('Height is required');
        } else {
            setHeightError('');
            heightValid = true;
        }

        let weightValid = false;
        if (weight.length == 0) {
            setWeightError('Weight is required');
        } else {
            setWeightError('');
            weightValid = true;
        }

        let genderValid = false;
        if (gender.length == 0) {
            setGenderError('Gender is required');
        } else {
            setGenderError('');
            genderValid = true;
        }*/

        if (firstNameValid && lastNameValid) {// && dateOfBirthValid && heightValid && weightValid && genderValid) {
            saveNewPatient();
        }
    }

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setHeight('');
        setWeight('');
    }

    const saveNewPatient = async () => {
        const url = URL_CREATE_PATIENT;

        //TODO change birthdate parameter
        const params = {
            firstName: firstName, lastName: lastName, birthDate: Date.now(), height: height, weight: weight//, gender:gender
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
                navigation.goBack();
            } else {
                const error = await response.json()
                console.log('first:', error.message);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <WithLocalSvg asset={goBack} width={25} height={25} style={styles.icon} onPress={() => {
                    navigation.goBack();
                }}/>
                <Text style={[styles.text, styles.title]}>Add A New Patient</Text>
            </SafeAreaView>
            {/*Overview    */}
            <SafeAreaView style={[styles.content, styles.overwiew]}>
                <Text style={[styles.text, styles.subtitle]}>Overview :</Text>
                <SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>First Name : </Text>
                    <TextInput style={styles.input}
                               value={firstName}
                               placeholder={'First Name'}
                               onChangeText={(text) => setFirstName(text)}
                    />
                    <Text style={styles.errorInput}>{firstNameError}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>Last Name : </Text>
                    <TextInput style={styles.input}
                               value={lastName}
                               placeholder={'Last Name'}
                               onChangeText={(text) => setLastName(text)}
                    />
                    <Text style={styles.errorInput}>{lastNameError}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>Date of Birth : </Text>
                    <TextInput style={styles.input}
                               value={dateOfBirth}
                               placeholder={'Date of Birth'}
                               onChangeText={(text) => setDateOfBirth(text)}
                    />
                    <Text style={styles.errorInput}>{dateOfBirthError}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>Height : </Text>
                    <TextInput style={styles.input}
                               value={height}
                               placeholder={'Height'}
                               onChangeText={(text) => setHeight(text)}
                    />
                    <Text style={styles.errorInput}>{heightError}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>Weight : </Text>
                    <TextInput style={styles.input}
                               value={weight}
                               placeholder={'Weight'}
                               onChangeText={(text) => setWeight(text)}
                    />
                    <Text style={styles.errorInput}>{weightError}</Text>
                </SafeAreaView>
                {/*<SafeAreaView style={styles.inputWrapper}>
                    <Text style={styles.text}>Gender : </Text>
                    <TextInput style={styles.input}
                        value={gender}
                        placeholder={'Gender'}
                        onChangeText={(text) => setGender(text)}
                    />
                    <Text style={styles.errorInput}>{genderError}</Text>
                </SafeAreaView>*/}
            </SafeAreaView>
            <SafeAreaView style={styles.content}>
                {/*Comprehensive Overview */}
            </SafeAreaView>
            <SafeAreaView>
                <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={[styles.buttonContent, styles.button]}
                >
                    <Text style={[styles.text, styles.title]}>Save</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    }, content: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 10,
    }, overwiew: {
        flexDirection: 'column',
    }, inputWrapper: {
        flexDirection: 'row',
        marginTop: 10,
    },
    input: {
        borderRadius: 15,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBackground,
        color: colors.default,
        paddingHorizontal: 15,
        paddingVertical: 5,
        width: '70%',
    }, icon: {
        marginRight: 10,
        alignSelf: 'center',
    }, title: {
        fontWeight: '700', fontSize: 30,
    }, subtitle: {
        fontWeight: '700', fontSize: 23,
    }, text: {
        color: '#0E1012',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 32,
        letterSpacing: 0.01,
    }, button: {
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
    }, errorInput: {
        color: 'red',
        marginTop: 5,
    },
});
export default NewPatient;
