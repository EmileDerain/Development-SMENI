import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import navigationBar from "./NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {PAGE_SIGNIN} from "../utils/path";

const Settings = ({ navigation }) => {

    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <TouchableOpacity onPress={() => {
                    AsyncStorage.clear()
                        .then(() => navigation.navigate(PAGE_SIGNIN))
                        .catch(error => console.error('Failed to clear AsyncStorage:', error));
                }}>
                    <Text>Logout</Text>
                </TouchableOpacity>
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
export default Settings;
