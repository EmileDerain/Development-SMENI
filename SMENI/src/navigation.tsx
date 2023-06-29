import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiagnoHelpScreen from "./screens/DiagnoHelpScreen";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{contentStyle: {backgroundColor: 'blue'}}}
            >
                <Stack.Screen name="SignIn" component={SignIn} options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name="DiagnoHelp" component={DiagnoHelpScreen} options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="SignUp" component={SignUp} options={{
                    headerShown: false
                }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default Navigation;
