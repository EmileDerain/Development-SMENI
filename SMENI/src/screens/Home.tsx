import {useNavigation, NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PAGE_SIGNIN} from "../utils/path";
import {isTokenValid} from "../utils/jwtCheck";
import {WithLocalSvg} from "react-native-svg";
import NetInfo from "@react-native-community/netinfo";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";


const Tab = createBottomTabNavigator();

const Home = () => {
    const navigation = useNavigation();



    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <Text>Content goes there</Text>
            </SafeAreaView>
        </KeyboardAwareScrollView>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    }, content: {
        flex: 1
    }, footer: {
        backgroundColor: "blue",
    }
});
export default Home;
