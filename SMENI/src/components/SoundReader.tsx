import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import { ShareFile } from '../useGetShare';
import { NativeModules } from 'react-native';
import Slider from '@react-native-community/slider';

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
  const [currentPosition, setCurrentPosition] = useState(0);

  

  useEffect(() => {
    requestPermissions();
    if (waveformImagePath === null && spectrogramImagePath === null)
      generateWaveform();
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

  const togglePlayback = () => {
    if (playerState.isPlaying) {
      sound?.pause();
      setPlayerState({ ...playerState, isPlaying: false, isPaused: true });
    } else {
      if (playerState.isPaused && sound) {
        console.log('sound chien casse bark bark');
        sound?.play((success) => {
          if (success) {
            console.log('Lecture audio terminée avec succès');
            setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
          } else {
            console.log('Erreur lors de la lecture audio');
            setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
          }
          sound.release();
        });
        setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
      } else {
        const newSound = new Sound(transferedFile.filePath, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Erreur lors de la lecture audio', error);
            setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
          } else {
            if (currentPosition > 0) {
              newSound.setCurrentTime(currentPosition);
            }
            newSound.play((success) => {
              if (success) {
                console.log('Lecture audio terminée avec succès');
                setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
                setCurrentPosition(0);
              } else {
                console.log('Erreur lors de la lecture audio');
                setPlayerState({ ...playerState, isPlaying: false, isPaused: false });
              }
              newSound.release();
            });
          }
        });

        const timerId = setInterval(() => {
          if (newSound && newSound.isLoaded()) {
            newSound.getCurrentTime((seconds) => {
              setCurrentPosition(seconds);
            });
          }
        }, 250);

        setSound(newSound);
        setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
      }
    }
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

  const calculateSeebBar = () => {
    if (sound && sound.isLoaded()) {
      return currentPosition / sound.getDuration();
    } else {
      return 0;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.soundWrapper}>
        {waveformImagePath && (
          <Image
          source={{ uri: waveformImagePath }}
          style={[styles.waveformImage, { zIndex: waveformImagePath ? 0 : -1 }]}
        />
        )}
        {spectrogramImagePath && (
          <Image
          source={{ uri: spectrogramImagePath }}
          style={[styles.waveformImage, { zIndex: spectrogramImagePath ? 0 : -1 }]}
        />
        )}

      <View
        style={[styles.cursor, { left: (currentPosition / (sound?.getDuration() || 1)) * 100 + '%' }]}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={calculateSeebBar()}
        minimumTrackTintColor={colors.textLight}
        maximumTrackTintColor={colors.background}
        onValueChange={ value => {
          console.log(value * (sound?.getDuration() || 1));
          setCurrentPosition(value * (sound?.getDuration() || 1));
        }}
        onSlidingStart={ () => {
          if (sound && sound.isLoaded() && playerState.isPlaying) {
            togglePlayback();
          }
        }}
        onSlidingComplete={ value => {
          if (sound && sound.isLoaded()) {
            sound.setCurrentTime(value * (sound?.getDuration() || 1));
            togglePlayback();
          }
        }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.editWrapper}>
        <SafeAreaView style={styles.audioEdit}>
          <TouchableOpacity onPress={togglePlayback}>
            <MaterialCommunityIcons
              name={playerState.isPlaying ? 'pause-circle' : 'play-circle'}
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

const IMAGE_SIZE = 150;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  soundWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformImage: {
    width: '100%',
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
  cursor: {
    position: 'absolute',
    top: 5,
    height: IMAGE_SIZE*2,
    width: 1,
    backgroundColor: 'red',
  },
  editWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  audioEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    top: 5,
    height: IMAGE_SIZE*2,
    opacity: 0,
    zIndex: 1,
  },
});

export default SoundReader;
