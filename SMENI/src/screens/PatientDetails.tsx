import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from 'moment';
import {WithLocalSvg} from "react-native-svg";

const PatientDetails = ({route}) => {
    const {patient} = route.params;
    console.log("coucou", patient);

    const navigation = useNavigation();

    const goBack = require('../assets/images/arrow-left-solid.svg');


    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <WithLocalSvg asset={goBack} width={25} height={25} style={styles.icon} onPress={() => {
                    navigation.goBack();
                }}/>
                <Text style={[styles.text, styles.title]}>{patient.firstName} {patient.lastName}</Text>
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
                        {patient.gender != 0 ? <Text> Male</Text> :
                            <Text> Female</Text>
                        }
                    </Text>
                </SafeAreaView>

            </SafeAreaView>

        </KeyboardAwareScrollView>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    }, content: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 10,
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
    },
});

export default PatientDetails;
