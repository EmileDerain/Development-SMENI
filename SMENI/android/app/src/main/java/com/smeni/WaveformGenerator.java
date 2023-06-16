package com.smeni;

import android.media.MediaPlayer;
import android.media.audiofx.Visualizer;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.util.Arrays;

public class WaveformGenerator extends ReactContextBaseJavaModule {
    private byte[] fullWaveform;

    public WaveformGenerator(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "WaveformGenerator";
    }

    @ReactMethod
    public void generateWaveform(String audioFilePath, Promise promise) {
        MediaPlayer mediaPlayer = new MediaPlayer();
        try {
            mediaPlayer.setDataSource(audioFilePath);
            mediaPlayer.prepare();
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject("IOError", "Erreur lors de la préparation du lecteur audio");
            return;
        }

        final Visualizer visualizer = new Visualizer(mediaPlayer.getAudioSessionId());
        visualizer.setCaptureSize(Visualizer.getCaptureSizeRange()[1]);
        visualizer.setDataCaptureListener(new Visualizer.OnDataCaptureListener() {
            @Override
            public void onWaveFormDataCapture(Visualizer visualizer, byte[] waveform, int samplingRate) {
                // Concaténer les échantillons de waveform
                if (fullWaveform == null) {
                    fullWaveform = waveform;
                } else {
                    fullWaveform = concatenateArrays(fullWaveform, waveform);
                }
            }

            @Override
            public void onFftDataCapture(Visualizer visualizer, byte[] fft, int samplingRate) {
                // Ne fait rien pour la génération de waveform
            }
        }, Visualizer.getMaxCaptureRate() / 2, true, false);

        visualizer.setEnabled(true);
        mediaPlayer.start();

        mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mp) {
                visualizer.setEnabled(false);
                visualizer.release();
                mediaPlayer.release();

                // Encoder le waveform complet en base64
                System.out.println("WaveformGenerator.FINISH");
                String waveformString = Base64.encodeToString(fullWaveform, Base64.DEFAULT);
                promise.resolve(waveformString);
            }
        });

        mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() {
            @Override
            public boolean onError(MediaPlayer mp, int what, int extra) {
                visualizer.setEnabled(false);
                visualizer.release();
                mediaPlayer.release();

                promise.reject("PlaybackError", "Erreur lors de la lecture du fichier audio");
                return false;
            }
        });
    }

    private byte[] concatenateArrays(byte[] array1, byte[] array2) {
        int length1 = array1.length;
        int length2 = array2.length;
        byte[] result = Arrays.copyOf(array1, length1 + length2);
        System.arraycopy(array2, 0, result, length1, length2);
        return result;
    }
}
