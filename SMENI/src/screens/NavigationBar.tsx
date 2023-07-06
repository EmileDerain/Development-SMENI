import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {PAGE_DIAGNOHELP, PAGE_HOME, PAGE_SEARCH_PATIENT} from "../utils/path";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchPatient from "./SearchPatient";
import DiagnoHelpScreen from "./DiagnoHelpScreen";
import Home from "./Home";


const Tab = createBottomTabNavigator();

const NavigationBar = () => {
    const navigation = useNavigation();


    // @ts-ignore
    return (// KeyboardAwareScrollView is a ScrollView that automatically adjusts its height when the keyboard appears.
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
                <Tab.Screen name={PAGE_HOME} component={Home}/>
                <Tab.Screen name={PAGE_SEARCH_PATIENT} component={SearchPatient}/>
                <Tab.Screen name={PAGE_DIAGNOHELP} component={DiagnoHelpScreen}/>

            </Tab.Navigator>
       )
}

export default NavigationBar;
