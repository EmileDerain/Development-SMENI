import React from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


const SearchPatient = () => {

    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView style={styles.container}>
            {/*contenu*/}
            <SafeAreaView style={styles.content}>
                <Text>Content goes there compris ?</Text>
            </SafeAreaView>
            {/*footer*/}
        </KeyboardAwareScrollView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff',
    }, content: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    }, footer: {
        backgroundColor: "blue",
    }
});
export default SearchPatient;
