import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchPatient from "./SearchPatient";
import DiagnoHelpScreen from "./DiagnoHelpScreen";
import Home from "./Home";
import Settings from "./Settings";


const Tab = createBottomTabNavigator();

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
                        iconName = focused ? 'help-circle' : 'help-circle-outline';
                    } else if (rn === 'Settings_Bar') {
                        iconName = focused ? 'settings' : 'settings-outline';
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
            <Tab.Screen name={'Search_Screen_Bar'} component={SearchPatient} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={'Diagno_Bar'} component={DiagnoHelpScreen} options={{
                headerShown: false
            }}/>
            <Tab.Screen name={'Settings_Bar'} component={Settings} options={{
                headerShown: false
            }}/>

        </Tab.Navigator>
    )
}

export default NavigationBar;
