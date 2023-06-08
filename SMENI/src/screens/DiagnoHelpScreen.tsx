import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SoundReader from '../components/SoundReader';
import { useSelector } from 'react-redux';
import colors from '../assets/colors/colors';
import { useGetShare } from '../useGetShare';
import React, { useState } from 'react';
import Autocomplete from 'react-native-autocomplete-input';



const DiagnoHelpScreen = () => {
    const sharedFile = useGetShare();
    const navigation = useNavigation();
    const counterValue = useSelector((state) => state.exemple.value) as number;
    const [selectedValue, setSelectedValue] = useState('');
    const [suggestions, setSuggestions] = useState([
      'Choice 1',
      'Choice 2',
      'Choice 3',
    ]);
  
    const handleTextChange = (text) => {
      setSelectedValue(text);
    };
  
    const findSuggestions = (query) => {
      if (query === '') {
        return [];
      }
  
      const regex = new RegExp(`${query.trim()}`, 'i');
      return suggestions.filter((item) => item.search(regex) >= 0);
    };
  
    const renderSuggestions = (suggestions) => (
      <View>
        {suggestions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleTextChange(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  
    const saveLabeledRecording = () => {
      console.log('saveLabeledRecording');
    };
  
    const filteredSuggestions = findSuggestions(selectedValue);
    return (
        <View style={styles.container}>
            {/* header */}
            <SafeAreaView style={styles.headerWrapper}>
                <Text style={[styles.text, styles.title]}>Diagnostic Page</Text>
                <TouchableOpacity
                onPress={() =>
                    navigation.canGoBack() ? navigation.goBack() : null
                  }>
                    <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={24}
                        color={colors.icons}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Audio reader component */}
            <SoundReader transfertInfo={'info'}/>

            {/* IA prediction*/}


            {/* Labelisation */}
            <SafeAreaView style={styles.labelWrapper}>
                <Text style={[styles.text, styles.subtitle]}>Label :</Text>
                <Autocomplete
                value={selectedValue}
                onChangeText={handleTextChange}
                placeholder="Type here..."
                data={filteredSuggestions}
                renderItem={({ item }) => <Text>{item}</Text>}
                renderSuggestions={renderSuggestions}
            />
            </SafeAreaView>
            <SafeAreaView style={styles.button}>
                <TouchableOpacity
                onPress={saveLabeledRecoding()}>
                    <Text style={[styles.text, styles.title]}>Save</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};
const saveLabeledRecoding = () => {
    console.log("saveLabeledRecoding");
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 65,
        marginLeft: 25,
        marginRight: 20,
    },
    labelWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 30,
    },
    text: {
        color: '#0E1012',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 32,
        letterSpacing: 0.01,
    },
    title: {
        fontWeight: '700',
        fontSize: 27,
    },
    subtitle: {
        fontWeight: '700',
        fontSize: 17,
    },

    image: {
        width: '50%',
        aspectRatio: 1,
    },
    button: {
        borderColor: colors.default,
        borderWidth: 1,
        borderRadius: 30,
        alignContent: 'center',
        alignItems: 'center',
        width: '40%',
        padding: 10,
        alignSelf: 'center', 
        marginBottom: 20,
    },
});

export default DiagnoHelpScreen;
