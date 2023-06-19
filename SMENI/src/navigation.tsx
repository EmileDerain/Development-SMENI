import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiagnoHelpScreen from "./screens/DiagnoHelpScreen";
import ExempleScreen2 from "./screens/ExempleScreen2";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import {StyleSheet} from "react-native";
import colors from "./assets/colors/colors";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{contentStyle: {backgroundColor: 'blue'}}}
            >
                <Stack.Screen name="DiagnoHelp" component={DiagnoHelpScreen} options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="SignUp" component={SignUp} options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="Exemple2" component={ExempleScreen2} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default Navigation;
