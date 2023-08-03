import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchPatient from "./SearchPatient";
import DiagnoHelpScreen from "./DiagnoHelpScreen";
import Home from "./Home";
import Settings from "./Settings";
import Chat from "./Chat";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import NewPatient from "./NewPatient";
import PatientDetails from "./PatientDetails";

// Tab serves as the navigation bar at the bottom of the screen
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Patient is a stack navigator that contains the screens for searching for a patient, creating a new patient, and viewing a patient's details
const Patient = () => {

    return (
        <Stack.Navigator initialRouteName="SearchPatient">
            <Stack.Screen name={'SearchPatient'} component={SearchPatient} options={{
                headerShown: false
            }}/>
            <Stack.Screen name={'NewPatient'} component={NewPatient} options={{
                headerShown: false
            }}/>
            <Stack.Screen name={'PatientDetails'} component={PatientDetails} options={{
                headerShown: false
            }}/>
        </Stack.Navigator>
    )
}

// NavigationBar is the main navigation bar that contains the screens for the home page, searching for a patient, getting help with diagnosis, and settings
const NavigationBar = () => {

    // @ts-ignore
    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
        <Tab.Navigator
            initialRouteName={'Home_Bar'}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === 'Home_Bar') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === 'Search_Screen_Bar') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (rn === 'Diagno_Bar') {
                        iconName = focused ? 'medkit' : 'medkit-outline';
                    } else if (rn === 'Settings_Bar') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (rn === 'Chat_Bar') {
                        iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>;
                },

                "tabBarActiveTintColor": "blue",
                "tabBarInactiveTintColor": "gray",
                "tabBarLabelStyle": {
                    "paddingBottom": 10,
                    "fontSize": 1
                },
                "tabBarStyle": [
                    {
                        "display": "flex"
                    },
                    null
                ]

            })}>
            <Tab.Screen name={'Home_Bar'} component={Home} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={'Search_Screen_Bar'} options={{
                headerShown: false
            }} component={Patient}/>
            <Tab.Screen name={'Diagno_Bar'} component={DiagnoHelpScreen} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={'Chat_Bar'} component={Chat} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={'Settings_Bar'} component={Settings} options={{
                headerShown: false
            }}/>

        </Tab.Navigator>
    )
}

export default NavigationBar;
