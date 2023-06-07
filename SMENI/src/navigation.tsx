import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ExempleScreen from "./screens/ExempleScreen";
import ExempleScreen2 from "./screens/ExempleScreen2";
import TempScreen from "./screens/TempScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{contentStyle: {backgroundColor: 'blue'}}}
            >
                <Stack.Screen name="Exemple" component={ExempleScreen} />
                <Stack.Screen name="Exemple2" component={ExempleScreen2} />
                <Stack.Screen name="TempScreen" component={TempScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
