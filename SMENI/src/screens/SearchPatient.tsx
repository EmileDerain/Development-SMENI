import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {WithLocalSvg} from "react-native-svg";
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {URL_GET_PATIENT} from "../utils/path";


const GetPatients = async () => {
    try {
        const response = await fetch(URL_GET_PATIENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numberPatientToSkip: 0,
            }),
        });
        const json = await response.json();
        return json.patients;
    } catch (error) {
        console.log(error);
    }
}

const SearchPatient = () => {

    const navigation = useNavigation();

    const [searchPatient, setSearchPatient] = useState('');

    const addPatientIcon = require('../assets/images/plus-solid.svg');
    const searchIcon = require('../assets/images/magnifying-glass-solid.svg');

    const [numberPatientToSkip, setNumberPatientToSkip] = useState(0);
    const [patients, setPatients] = useState([]);

    const folderIcon = require('../assets/images/folder-open-solid.svg');

    const isScreenFocused = useIsFocused();

    useEffect(() => {
        GetPatients().then(r => {
            console.log(r);
            setPatients(r);
            setNumberPatientToSkip(0+r.length);
        }).catch(e => console.log(e));
    }, [isScreenFocused]);

    console.log("coucou", patients);

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
                        onChangeText={(text) => setSearchPatient(text)}
                    />
                </SafeAreaView>
                <WithLocalSvg asset={addPatientIcon} width={25} height={25} style={[styles.icon, styles.iconNew]}
                              onPress={() => {
                                  navigation.navigate('NewPatient')
                              }
                              }/>
            </SafeAreaView>
            <SafeAreaView style={styles.patients}>
                {patients.map((patient) => {
                        return (
                            <SafeAreaView style={styles.patient}>
                                <WithLocalSvg asset={folderIcon} width={25} height={25} style={[styles.icon, styles.folder]}/>
                                <SafeAreaView style={styles.patientDetails}>
                                    <Text>{patient.firstName} {patient.lastName}</Text>
                                    <Text>X files</Text>
                                </SafeAreaView>
                            </SafeAreaView>
                        )
                    }
                )}

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
        justifyContent: 'space-between',
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
        marginRight: 10,
        alignSelf: 'center',
    }, iconNew: {
        marginRight: 15,
    }, patients:{
        flexDirection: 'column',
        marginTop: 20,
    }, patient:{
        flexDirection: 'row',
        margin: 10,
        borderColor: colors.default,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
    }, folder:{
        borderColor: colors.default,
        borderWidth: 1,
        borderRadius: 15,
        padding: 30,
        backgroundColor: "lightblue",
    }, patientDetails:{
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'space-around',
    }
});
export default SearchPatient;
