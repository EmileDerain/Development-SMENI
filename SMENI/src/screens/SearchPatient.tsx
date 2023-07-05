import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PAGE_DIAGNOHELP, PAGE_SIGNIN, PAGE_SIGNUP, URL_LOGIN} from "../utils/path";
import {isTokenValid} from "../utils/jwtCheck";
import {WithLocalSvg} from "react-native-svg";
import NetInfo from "@react-native-community/netinfo";


const CheckToken = async () => {
    const navigation = useNavigation();
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (!isTokenValid(tokenFromStorage)) {
        console.log("token is not valid")
        navigation.navigate(PAGE_SIGNIN);
    }
}

const SearchPatient = () => {
    const navigation = useNavigation();

    //CheckToken();



    return (
        // KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <Text>Content goes there</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.footer}>
                <Text>This footer will be pushed to the bottom</Text>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    },
    content: {
        flex: 1
    },
    footer: {
        backgroundColor: "blue",
    }
});
export default SearchPatient;
