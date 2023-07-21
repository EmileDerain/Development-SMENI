import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from 'moment';

const PatientDetails = ({patient} : {patient: any}) => {

    console.log("coucou", patient)

    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            <SafeAreaView>
                <Text>{patient.firstName} {patient.lastName}</Text>
            </SafeAreaView>
            <SafeAreaView>
                <SafeAreaView>
                <Text>Height {patient.height}</Text>
                </SafeAreaView>
                <SafeAreaView>
                <Text>Weight {patient.weight}</Text>
                </SafeAreaView>
                <SafeAreaView>
                <Text>Age {moment().diff(patient.birthDate, 'years')}
                </Text>
                </SafeAreaView>
                <SafeAreaView>
                <Text>MedicalID {patient.medicalID}</Text>
                </SafeAreaView>
                <SafeAreaView>
                <Text>Gender
                    {patient.gender == 0 ? <Text>Male</Text> :
                        <Text>Female</Text>
                    }
                </Text>
                </SafeAreaView>

            </SafeAreaView>

        </KeyboardAwareScrollView>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    },
});

export default PatientDetails;
