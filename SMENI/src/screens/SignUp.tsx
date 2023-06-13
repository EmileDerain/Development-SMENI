import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, Text, TextInput, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


const SignUp = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    return (
        // KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <KeyboardAwareScrollView>
            {/*header*/}
            <SafeAreaView>
                <View>
                    <Text>Create Your Account</Text>
                </View>
            </SafeAreaView>
            {/*form*/}
            <SafeAreaView>
                <SafeAreaView>
                    <Text>First Name</Text>
                    <TextInput
                    value={firstName}
                    placeholder={'First Name'}
                    onChangeText={(text) => setFirstName(text)}
                    />

                </SafeAreaView>

            </SafeAreaView>

        </KeyboardAwareScrollView>
    );
}

export default SignUp;