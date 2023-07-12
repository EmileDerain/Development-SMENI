import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import {WithLocalSvg} from "react-native-svg";


const NewPatient = () => {

    const [searchPatient, setSearchPatient] = useState('');

    const addPatientIcon = require('../assets/images/plus-solid.svg');
    const searchIcon = require('../assets/images/magnifying-glass-solid.svg');

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
                <WithLocalSvg asset={addPatientIcon} width={25} height={25} style={[styles.icon, styles.iconNew]}/>
            </SafeAreaView>
            <SafeAreaView style={styles.content}>
                {/*    */}
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
export default NewPatient;
