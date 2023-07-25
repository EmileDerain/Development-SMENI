import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

// This page will serve as the home page of the application.
const Home = () => {

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
