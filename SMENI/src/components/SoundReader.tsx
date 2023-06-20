import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, PermissionsAndroid, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import { ShareFile } from '../useGetShare';
import { NativeModules } from 'react-native';

const WaveformGenerator = NativeModules.WaveformGenerator;

const SoundReader = ({ transfertInfo }: { transfertInfo: ShareFile }) => {
  const transferedFile = transfertInfo;
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isPaused: false,
  });
  const [sound, setSound] = useState<Sound | null>(null);
  const [waveformImagePath, setWaveformImagePath] = useState<string | null>(null);
  const [spectrogramImagePath, setSpectrogramImagePath] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Autorisations accordées');
      } else {
        console.log('Autorisations refusées');
      }
    } catch (error) {
      console.log('Erreur lors de la demande des autorisations', error);
    }
  };

  const playAudio = () => {
    generateWaveform();
    if (playerState.isPaused) {
      sound?.play();
      setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
    } else {
      const newSound = new Sound(transferedFile.filePath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Erreur lors de la lecture audio', error);
          setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
        } else {
          newSound.play((success) => {
            if (success) {
              console.log('Lecture audio terminée avec succès');
              setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
            } else {
              console.log('Erreur lors de la lecture audio');
              setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
            }
            newSound.release();
          });
        }
      });

      setSound(newSound);
      setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
    }
  };

  const pauseAudio = () => {
    sound?.pause();
    setPlayerState({ ...playerState, isPlaying: false, isPaused: true });
  };

  const generateWaveform = async () => {
    try {
      console.log('Génération de la waveform en cours...');
      const waveformPath = await WaveformGenerator.generateWaveform(transferedFile.filePath);
      setWaveformImagePath(waveformPath);
      console.log('Waveform générée avec succès');
      generateSpectrogram();
    } catch (error) {
      console.log('Erreur lors de la génération de la waveform', error);
    }
  };

  const generateSpectrogram = async () => {
    try {
      console.log('Génération du spectrogramme en cours...');
      const spectrogramPath = await WaveformGenerator.generateSpectrogram(transferedFile.filePath);
      setSpectrogramImagePath(spectrogramPath);
      console.log('Spectrogramme généré avec succès');
    } catch (error) {
      console.log('Erreur lors de la génération du spectrogramme', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.soundWrapper}>
        {waveformImagePath && (
          <Image source={{ uri: waveformImagePath }} style={styles.waveformImage} /> 
        )}
        {spectrogramImagePath && (
          <Image source={{ uri: spectrogramImagePath }} style={styles.waveformImage} /> 
        )}
      </SafeAreaView>
      <SafeAreaView style={styles.editWrapper}>
        <SafeAreaView style={styles.audioEdit}>
          <TouchableOpacity onPress={playAudio}>
            <MaterialCommunityIcons
              name="play-circle"
              size={24}
              paddingRight={5}
              color={colors.icons}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={pauseAudio}>
            <MaterialCommunityIcons
              name="pause-circle"
              size={24}
              paddingRight={5}
              color={colors.icons}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="volume-minus"
              size={24}
              paddingRight={5}
              color={colors.icons}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="volume-plus"
              size={24}
              paddingRight={5}
              color={colors.icons}
            />
          </TouchableOpacity>
        </SafeAreaView>
        <SafeAreaView style={styles.bookmark}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bookmark-plus" size={24} color={colors.icons} />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  soundWrapper: {
    flexDirection: 'column',
    marginTop: 15,
    height: 150,
    borderColor: colors.default,
    borderWidth: 0,
  },
  waveformImage: {
    borderWidth: 1,
    width: '100%',
    height: '100%',
    borderColor: colors.default,
  },
  editWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 30,
    justifyContent: 'space-between',
  },
  audioEdit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SoundReader;
