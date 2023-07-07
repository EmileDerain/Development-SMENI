import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {PAGE_DIAGNOHELP, PAGE_HOME, PAGE_SEARCH_PATIENT} from "../utils/path";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchPatient from "./SearchPatient";
import DiagnoHelpScreen from "./DiagnoHelpScreen";
import Home from "./Home";
import SignIn from "./SignIn";


const Tab = createBottomTabNavigator();

const NavigationBar = () => {

    return (
        <Tab.Navigator
            initialRouteName={PAGE_HOME}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === PAGE_HOME) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === PAGE_SEARCH_PATIENT) {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (rn === PAGE_DIAGNOHELP) {
                        iconName = focused ? 'help-circle' : 'help-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'blue',
                inactiveTintColor: 'gray',
                labelStyle: {paddingBottom: 10, fontSize: 1},
                style: {height: 70, padding: 10}
            }
            }
        >
            <Tab.Screen name={PAGE_HOME} component={Home} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={PAGE_SEARCH_PATIENT} component={SearchPatient} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={PAGE_DIAGNOHELP} component={SignIn} options={{
                headerShown: false
            }}/>

        </Tab.Navigator>
    )
}

export default NavigationBar;
