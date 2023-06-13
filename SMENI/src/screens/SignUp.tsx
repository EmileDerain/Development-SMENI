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
                {/*First Name*/}
                <SafeAreaView>
                    <Text>First Name</Text>
                    <TextInput
                        value={firstName}
                        placeholder={'First Name'}
                        onChangeText={(text) => setFirstName(text)}
                    />
                </SafeAreaView>
                {/*Last Name*/}
                <SafeAreaView>
                    <Text>Last Name</Text>
                    <TextInput
                        value={lastName}
                        placeholder={'Last Name'}
                        onChangeText={(text) => setLastName(text)}
                    />
                </SafeAreaView>
                {/*Mail*/}
                <SafeAreaView>
                    <Text>Mail</Text>
                    <TextInput
                        value={mail}
                        placeholder={'Mail'}
                        onChangeText={(text) => setMail(text)}
                    />
                </SafeAreaView>
                {/*Password*/}
                <SafeAreaView>
                    <Text>Password</Text>
                    <TextInput
                        value={password}
                        placeholder={'Password'}
                        onChangeText={(text) => setPassword(text)}
                    />
                </SafeAreaView>
                {/*TODO : peut être rajouter un champ confirm password    */}

            </SafeAreaView>

        </KeyboardAwareScrollView>
    );
}

export default SignUp;