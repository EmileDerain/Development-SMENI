import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {WithLocalSvg} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import {URL_CREATE_PATIENT} from "../utils/path";
import PatientInformation from "../components/PatientInformation";

// NewPatient component
const NewPatient = () => {

    const navigation = useNavigation();

    // State variables to hold form data and their respective errors
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
    const [medicalID, setMedicalID] = useState('');
    const [medicalIDError, setMedicalIDError] = useState('');


    const [patientData, setPatientData] = useState({
        selectedMedicalID: '',
        selectedName: '',
        selectedSurname: '',
        selectedBirthDate: new Date(),
        selectedWeight: '',
        selectedHeight: '',
        selectedGender: '',
    });


    const goBack = require('../assets/images/arrow-left-solid.svg');


    const handlePatientDataChange = (data) => {
        setPatientData({...patientData, ...data});
        console.log("patientData: ", data);
    };

    // Function to handle form submission
    const handleSubmit = () => {
        // Validate the form fields
        saveNewPatient();

    }

    // Function to clear the form fields
    const clearForm = () => {
        setPatientData({
            selectedMedicalID: '',
            selectedName: '',
            selectedSurname: '',
            selectedBirthDate: new Date(),
            selectedWeight: '',
            selectedHeight: '',
            selectedGender: '',

        });
    }

    // Function to save a new patient to the server
    const saveNewPatient = async () => {
        console.log("coucou");
        const url = URL_CREATE_PATIENT;

        if (patientData.selectedGender === 'male') {
            setPatientData({...patientData, selectedGender: '2'});
        } else {
            setPatientData({...patientData, selectedGender: '1'})
        }

        // Parameters to be sent in the request body
        const params = {
            firstName: patientData.selectedName,
            lastName: patientData.selectedSurname,
            birthDate: patientData.selectedBirthDate,
            height: patientData.selectedHeight,
            weight: patientData.selectedWeight,
            gender: patientData.selectedGender,
            medicalID: patientData.selectedMedicalID,
        };

        // Create a URLSearchParams object and append the parameters to it
        const formData = new URLSearchParams();
        for (const key in params) {
            // @ts-ignore
            formData.append(key, params[key]);
        }

        try {
            // Send a POST request to the server with the form data
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
                // If there is an error in the response, log the error message
                const error = await response.json();
                console.log('first:', error.message);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    // NewPatient component UI
    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <WithLocalSvg asset={goBack} width={25} height={25} style={styles.icon} onPress={() => {
                    navigation.goBack();
                }}/>
                <Text style={[styles.text, styles.title]}>Add A New Patient</Text>
            </SafeAreaView>
            {/*Overview    */}
            <SafeAreaView style={[styles.content, styles.overwiew]}>
                <PatientInformation onChangeInput={handlePatientDataChange}/>

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
        </KeyboardAwareScrollView>)

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    }, content: {
        flexDirection: 'row', marginTop: 20, marginLeft: 10,
    }, overwiew: {
        flexDirection: 'column',
    }, inputWrapper: {
        flexDirection: 'row', marginTop: 10,
    }, input: {
        borderRadius: 15,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBackground,
        color: colors.default,
        paddingHorizontal: 15,
        paddingVertical: 5,
        width: '70%',
    }, icon: {
        marginRight: 10, alignSelf: 'center',
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
    }, buttonContent: {
        flex: 1, opacity: 1, // Default opacity when the button is enabled
    }, disabledButton: {
        opacity: 0.5, // Opacity when the button is disabled
    }, errorInput: {
        color: 'red', marginTop: 5,
    },
});
export default NewPatient;
