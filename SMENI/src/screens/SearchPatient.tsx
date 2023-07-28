import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {WithLocalSvg} from "react-native-svg";
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {PAGE_PATIENTDETAILS, URL_GET_BY_MEDICAL_ID, URL_GET_PATIENT} from "../utils/path";

// Function to get patients from the server
const GetPatients = async () => {
    try {
        const response = await fetch(URL_GET_PATIENT, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                numberPatientToSkip: 0,
            }),
        });
        const json = await response.json();
        return json.patients;
    } catch (error) {
        console.log(error);
    }
}

const GetPatientsById = async (id) => {
    console.log("id: ", id);
    try {
        const response = await fetch(URL_GET_BY_MEDICAL_ID, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                numberPatientToSkip: 0,
                medicalID: id,
            }),
        });
        const json = await response.json();
        //console.log(json);
        return json.patients;
    } catch (error) {
        console.log("merde");
        console.log(error);
    }
}

// SearchPatient component
const SearchPatient = () => {

    const navigation = useNavigation();

    // State variable to hold the search query
    const [searchPatient, setSearchPatient] = useState('');

    // Icons loaded from assets
    const addPatientIcon = require('../assets/images/plus-solid.svg');
    const searchIcon = require('../assets/images/magnifying-glass-solid.svg');
    const folderIcon = require('../assets/images/folder-open-solid.svg');

    // State variables to manage patient data
    const [numberPatientToSkip, setNumberPatientToSkip] = useState(0);
    const [patients, setPatients] = useState([]);

    const isScreenFocused = useIsFocused();

    useEffect(() => {
        // Call GetPatients function to fetch patient data from the server
        GetPatients().then(r => {
            console.log(r);
            // If the response is undefined, return
            if (r == undefined) {
                return;
            }
            // Set the patients state with the fetched data
            setPatients(r);
            setNumberPatientToSkip(numberPatientToSkip + r.length);
        }).catch(e => console.log(e));
    }, [isScreenFocused]);


    // Function to handle search query
    const handleSearch = (text) => {
        setSearchPatient(text);
        // Call GetPatientsById function to fetch patient data from the server
        GetPatientsById(text).then(r => {
            // If the response is undefined, return
            if (r == undefined) {
                return;
            }
            // Set the patients state with the fetched data
            setPatients(r);
            setNumberPatientToSkip(numberPatientToSkip + r.length);
        }).catch(e => console.log(e));

    }

    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                {/* search bar   */}
                <SafeAreaView style={[styles.input, styles.searchBar]}>
                    <WithLocalSvg asset={searchIcon} width={25} height={25} style={styles.icon}/>
                    <TextInput
                        value={searchPatient}
                        placeholder={'Search Patient'}
                        keyboardType="numeric"
                        onChangeText={(text) => handleSearch(text)}
                    />
                </SafeAreaView>
                <WithLocalSvg asset={addPatientIcon} width={25} height={25} style={[styles.icon, styles.iconNew]}
                              onPress={() => {
                                  navigation.navigate('NewPatient')
                              }}/>
            </SafeAreaView>
            <SafeAreaView style={styles.patients}>
                {patients.length != 0 ? patients.map((patient) => {

                    return (<TouchableOpacity
                            key={patient._id}
                            onPress={() => navigation.navigate(PAGE_PATIENTDETAILS, {patient})}>
                            <SafeAreaView style={styles.patient}>
                                <WithLocalSvg asset={folderIcon}
                                              width={25} height={25}
                                              style={[styles.icon, styles.folder]}/>
                                <SafeAreaView style={styles.patientDetails}>
                                    <Text>{patient.medicalID}</Text>
                                    <Text>X files {/*change this to a request to get the number of file*/}</Text>
                                </SafeAreaView>
                            </SafeAreaView>
                        </TouchableOpacity>);
                }) : <Text>No patients</Text>}

            </SafeAreaView>
        </KeyboardAwareScrollView>)

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    }, content: {
        flexDirection: 'row', marginTop: 20, marginLeft: 10, justifyContent: 'space-between',
    }, input: {
        borderRadius: 15,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBackground,
        color: colors.default,
        paddingHorizontal: 15,
        paddingVertical: 5,
        width: '85%',
    }, searchBar: {
        flexDirection: 'row',
    }, icon: {
        marginRight: 10, alignSelf: 'center',
    }, iconNew: {
        marginRight: 15,
    }, patients: {
        flexDirection: 'column', marginTop: 20,
    }, patient: {
        flexDirection: 'row', margin: 10, borderColor: colors.default, borderWidth: 1, borderRadius: 15, padding: 10,
    }, folder: {
        borderColor: colors.default, borderWidth: 1, borderRadius: 15, padding: 30, backgroundColor: "lightblue",
    }, patientDetails: {
        flexDirection: 'column', marginLeft: 10, justifyContent: 'space-around',
    }
});
export default SearchPatient;
