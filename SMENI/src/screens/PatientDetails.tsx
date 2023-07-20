import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


const PatientDetails = ({patient} : {patient: []}) => {


    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>


        </KeyboardAwareScrollView>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    },
});

export default PatientDetails;
