import { useNavigation } from '@react-navigation/native';
import { Pressable, SafeAreaView, StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SoundReader from '../components/SoundReader';
import { useSelector } from 'react-redux';
import colors from '../assets/colors/colors';
import { useGetShare } from '../useGetShare';
import React, { useState } from 'react';

const DiagnoHelpScreen = () => {
  const sharedFile = useGetShare();
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    'murmur',
    'unknown',
    'normal',
    'extrastole',
    'artifact',
    'extrahls',
  ]);

  const handleTextChange = (text) => {
    setSelectedValue(text);
  };

  const findSuggestions = (query) => {
    if (query === '') {
      return [];
    }
  
    const regex = new RegExp(`^${query.trim()}`, 'i');
    return suggestions.filter((item) => regex.test(item));
  };
  
  const saveLabeledRecording = () => {
    console.log('saveLabeledRecording');
  };

  const filteredSuggestions = findSuggestions(selectedValue);

  return (
    <View style={styles.container}>
      {/* header */}
      <SafeAreaView style={styles.headerWrapper}>
        <Text style={[styles.text, styles.title]}>Diagnostic Page</Text>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.icons} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Audio reader component */}
      <SoundReader transfertInfo={'info'} />

      {/* IA prediction*/}

      {/* Labelisation */}
      <SafeAreaView style={styles.labelWrapper}>
        <Text style={[styles.text, styles.subtitle]}>Label :</Text>
        <TextInput
          value={selectedValue}
          style={styles.input}
          onChangeText={handleTextChange}
          placeholder="Select a label..."
          placeholderTextColor={colors.placeholder}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.suggestionsWrapper}>
        {filteredSuggestions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleTextChange(item)}
            style={styles.suggestionItem}
          >
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
      <SafeAreaView style={styles.button}>
        <TouchableOpacity onPress={saveLabeledRecording}>
          <Text style={[styles.text, styles.title]}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
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
  suggestionsWrapper: {
    marginTop: 10,
    marginLeft: 30,
  },
  suggestionItem: {
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 17,
    color: colors.text,
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
  input: {
    borderColor: colors.default,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '50%',
    marginLeft: 10,
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
    marginVertical: 20,
  },
});

export default DiagnoHelpScreen;
