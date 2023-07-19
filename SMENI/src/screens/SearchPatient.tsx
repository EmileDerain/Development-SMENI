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
    //let patients: any = [];

    const isScreenFocused = useIsFocused();

    /*const getPatients = async () => {
        try {
            const response = await fetch(URL_GET_PATIENT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numberPatientToSkip: numberPatientToSkip,
                }),
            });
            const json = await response.json();
            setNumberPatientToSkip(numberPatientToSkip + json.patients.length);
            setNumberPatientToSkip(0);
            return json.patients;
        } catch (error) {
            console.log(error);
        }
    };*/

    /*getPatients().then(r => {
        r.forEach((element: { _id: any; __v: any; birthDate:any; height:any; weight:any}) => {
            delete element._id;
            delete element.__v;
            delete element.birthDate;
            delete element.height;
            delete element.weight;
        })
        console.log(r);
        const array = r.map((patient: any) => {
            return JSON.stringify(patient);
        });
        console.log(array);
        patients = r;
        //setPatients(array);
    }).catch(e => console.log(e));*/

    useEffect(() => {
        GetPatients().then(r => {
            /*r.forEach((element: { _id: any; __v: any; birthDate:any; height:any; weight:any}) => {
                delete element._id;
                delete element.__v;
                delete element.birthDate;
                delete element.height;
                delete element.weight;
            })*/
            console.log(r);
            /*const array = r.map((patient: any) => {
                return JSON.stringify(patient);
            });
            console.log(array);*/
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
            <Text>All Patients</Text>
            <SafeAreaView style={styles.content}>
                {patients.map((patient) => {
                        return (
                            <SafeAreaView>
                                <Text>{patient.firstName}</Text>
                                <Text>Coucou</Text>
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
    }
});
export default SearchPatient;
