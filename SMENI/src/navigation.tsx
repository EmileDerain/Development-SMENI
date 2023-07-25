import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiagnoHelpScreen from "./screens/DiagnoHelpScreen";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import NavigationBar from "./screens/NavigationBar";

// The NavigationContainer must wrap any navigator structure.
const Stack = createNativeStackNavigator();

// Stack Navigator for SignIn, Sign up and Offline DiagnoHelp Screen.
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
                <Stack.Screen name="SignUp" component={SignUp} options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name="SearchPatient" component={NavigationBar} options={{headerShown: false}}/>
                <Stack.Screen name="DiagnoPage" component={DiagnoHelpScreen} options={{
                    headerShown: false
                }}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default Navigation;
