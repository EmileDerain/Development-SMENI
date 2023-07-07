/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import Navigation from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/store';
import NavigationBar from "./src/screens/NavigationBar";

export default function App() {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <Navigation/>
                <StatusBar style="auto"/>
            </View>
        </Provider>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
