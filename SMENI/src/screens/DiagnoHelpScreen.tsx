import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SoundReader from '../components/SoundReader';
import colors from '../assets/colors/colors';
import { useGetShare } from '../useGetShare';
import heartBeat from '../assets/images/heartBeat.png';


const DiagnoHelpScreen = () => {
  const sharedFile = useGetShare();
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    '',
    'murmur',
    'unknown',
    'normal',
    'extrastole',
    'artifact',
    'extrahls',
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleTextChange = (text) => {
    setSelectedValue(text);
    setShowSuggestions(text.length > 0);
    setIsInputValid(suggestions.includes(text));
  };

  const findSuggestions = (query) => {
    if (query === '') {
      return [];
    }

    const regex = new RegExp(`^${query.trim()}`, 'i');
    const finds = suggestions.filter((item) => regex.test(item));
    if (query === finds[0]) {
      return [];
    }
    return finds;
  };

  const saveLabeledRecording = async (value) => {
    console.log('saveLabeledRecording:', value);
    console.log('sharedFile:', sharedFile);

    const url = 'http://172.16.6.115:80/api/audio';

    // @ts-ignore
    const fichierWaveUri = sharedFile[0].contentUri;

    console.log("L'uri du fichier à envoyer: ", fichierWaveUri)

    const formData = new FormData();
    formData.append('audio', {
      uri: fichierWaveUri,
      type: 'audio/x-wav',
      name: '1683880817754.wav',
    });

    formData.append('label', "normal");

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Le fichier a été envoyé avec succès.');
      } else {
        console.error('Erreur lors de l\'envoi du fichier :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier :', error);
    }
  };

  const filteredSuggestions = findSuggestions(selectedValue);

  const closeSuggestions = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* header */}
      <SafeAreaView style={styles.headerWrapper}>
        <Text style={[styles.text, styles.title]}>Diagnostic Page</Text>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.icons} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Audio reader component */}
      {sharedFile !== undefined && <SoundReader transfertInfo={sharedFile[0]} />}
      {sharedFile === undefined && <Image 
      style={styles.image}
      source={heartBeat}/> }


      {/* Labelisation */}
      <SafeAreaView style={[styles.labelWrapper, (sharedFile === undefined) && styles.disabledButton]}>
        <Text style={[styles.text, styles.subtitle]}>Label :</Text>
        <TextInput
          value={selectedValue}
          style={[styles.input, !isInputValid && styles.invalidInput]}
          onChangeText={handleTextChange}
          placeholder="Select a label..."
          placeholderTextColor={colors.textLight}
          onBlur={() => setIsInputValid(suggestions.includes(selectedValue))}
          editable={sharedFile !== undefined}
        />
      </SafeAreaView>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {filteredSuggestions.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleTextChange(item)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SafeAreaView >
        <TouchableOpacity
          onPress={() => saveLabeledRecording(selectedValue)}
          disabled={!isInputValid || selectedValue === ''}
          style={[styles.buttonContent, styles.button, (!isInputValid || selectedValue === '') && styles.disabledButton]}
        >
          <Text style={[styles.text, styles.title]}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAwareScrollView>
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
  image: {
    alignSelf: 'center',
    marginTop: 20,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 30,
    marginBottom: 20,
  },
  suggestionsContainer: {
    width: '40%',
    alignSelf: 'center',
    marginTop: -20,
    marginLeft: -30,
  },
  suggestionItem: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: 1,
    borderWidth: 1,
    borderRadius: 25,
    borderBottomColor: '#0E1012',
  },
  suggestionText: {
    color: '#0E1012',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 32,
    letterSpacing: 0.01,
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
    borderRadius: 30,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBackground,
    color: colors.default,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '50%',
    marginLeft: 10,
  },
  invalidInput: {
    borderColor: 'red', // Couleur de la bordure en cas d'input invalide
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
  buttonContent: {
    flex: 1,
    opacity: 1, // Default opacity when the button is enabled
  },
  disabledButton: {
    opacity: 0.5, // Opacity when the button is disabled
  },
});

export default DiagnoHelpScreen;
