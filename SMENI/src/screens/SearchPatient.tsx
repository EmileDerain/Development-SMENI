import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PAGE_SIGNIN} from "../utils/path";
import {isTokenValid} from "../utils/jwtCheck";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import NavigationBar from "./NavigationBar";


const CheckToken = async () => {
    const navigation = useNavigation();
    const tokenFromStorage = await AsyncStorage.getItem('token');
    if (!isTokenValid(tokenFromStorage)) {
        console.log("token is not valid")
        navigation.navigate(PAGE_SIGNIN);
    }
}

const Tab = createBottomTabNavigator();

const SearchPatient = () => {
    const navigation = useNavigation();

    //CheckToken();


    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <Text>Content goes there compris ?</Text>
            </SafeAreaView>
            {/*footer*/}

            <NavigationBar/>
        </KeyboardAwareScrollView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex:1, backgroundColor: '#fff',
    }, content: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    }, footer: {
        backgroundColor: "blue", bottom:0
    }
});
export default SearchPatient;
