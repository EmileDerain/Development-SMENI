import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../assets/colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShareFile } from '../useGetShare';

const Prediction = ({ transfertInfo }: { transfertInfo: ShareFile }) => {
  const transferedFile = transfertInfo;

  const [predictionLabel1, setPredictionLabel1] = useState('-');
  const [predictionAccuracy1, setPredictionAccuracy1] = useState(' ');
  const [predictionLabel2, setPredictionLabel2] = useState(' ');
  const [predictionAccuracy2, setPredictionAccuracy2] = useState(' ');

  useEffect(() => {
    askPrediction();
  }, []);

  const askPrediction = async () => {
    const url = 'http://172.16.6.115:2834/api/cnn/predict'; // URL de l'API

    // @ts-ignore
    const fichierWaveUri = transfertInfo.contentUri;

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
        console.log('New prediction received !');
        const data = await response.json();
        setPredictionLabel1(data.label_1.label);
        setPredictionAccuracy1(data.label_1.accuracy);
        setPredictionLabel2(data.label_2.label);
        setPredictionAccuracy2(data.label_2.accuracy);
      } else {
        console.error('Erreur lors de l\'envoi du fichier :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier :', error);
    }
   // Mise à jour des valeurs de prédiction
  };

  useEffect(() => {
    
  }, [transfertInfo]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={[styles.text, styles.subtitle]}>Prediction :</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.predictionWrapper}>
        <Text style={[styles.text]}>{predictionLabel1}</Text>
        <Text style={[styles.text]}>{predictionAccuracy1}</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.predictionWrapper}>
        <Text style={[styles.text]}>{predictionLabel2}</Text>
        <Text style={[styles.text]}>{predictionAccuracy2}</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  predictionWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  text: {
    color: colors.default,
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
});

export default Prediction;
