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
    const weightPicture = require('../assets/images/weight-scale-solid.svg');
    const heightPicture = require('../assets/images/ruler-vertical-solid.svg');
    const agePicture = require('../assets/images/cake-candles-solid.svg');
    const genderPicture = require('../assets/images/venus-mars-solid.svg');
    const medicalIDPicture = require('../assets/images/id-card-solid.svg');


    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <WithLocalSvg asset={goBack} width={25} height={25} style={styles.back} onPress={() => {
                    navigation.goBack();
                }}/>
                <Text style={[styles.text, styles.title]}>{patient.firstName} {patient.lastName}</Text>
            </SafeAreaView>
            <SafeAreaView>
                <SafeAreaView style={styles.field}>
                    <WithLocalSvg asset={heightPicture} width={25} height={25} style={styles.icon}/>
                    <Text style={styles.text}>{patient.height} cm</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.field}>
                    <WithLocalSvg asset={weightPicture} width={25} height={25} style={styles.icon}/>
                    <Text style={styles.text}>{patient.weight} Kg</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.field}>
                    <WithLocalSvg asset={agePicture} width={25} height={25} style={styles.icon}/>
                    <Text style={styles.text}>{moment().diff(patient.birthDate, 'years')} years old
                    </Text>
                </SafeAreaView>
                <SafeAreaView style={styles.field}>
                    <WithLocalSvg asset={medicalIDPicture} width={25} height={25} style={styles.icon}/>
                    <Text style={styles.text}>Medical ID {patient.medicalID}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.field}>
                    <WithLocalSvg asset={genderPicture} width={25} height={25} style={styles.icon}/>
                    <Text style={styles.text}>Gender
                        {patient.gender != 1 ? <Text> Male</Text> :
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
        marginBottom: 20,
    }, back: {
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
    }, icon: {
        marginLeft:10,
        alignSelf: 'center',
        marginRight: 10,
    }, field:{
        flexDirection: 'row',
        marginBottom: 15,
    }
});

export default PatientDetails;
