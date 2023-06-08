import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';

const SoundReader = ({ transfertInfo }: { transfertInfo: string }) => {
    const [playerState, setPlayerState] = useState({
      isPlaying: false,
      isPaused: false,
    });
    const [sound, setSound] = useState<Sound | null>(null); // Déclaration de la variable sound
  
    const playAudio = () => {
      if (playerState.isPaused) {
        sound.play(); // Utilisation de la variable sound avec l'opérateur de navigation optionnelle
        setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
      } else {
        const newSound = new Sound('beep.wav', Sound.MAIN_BUNDLE, (error) => {
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
  
        setSound(newSound); // Affectation de la variable sound avec la nouvelle instance de Sound
        setPlayerState({ ...playerState, isPlaying: true, isPaused: false });
      }
    };
  
    const pauseAudio = () => {
      sound?.pause(); // Utilisation de la variable sound avec l'opérateur de navigation optionnelle
      setPlayerState({ ...playerState, isPlaying: false, isPaused: true });
    };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.soundWrapper} />
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
