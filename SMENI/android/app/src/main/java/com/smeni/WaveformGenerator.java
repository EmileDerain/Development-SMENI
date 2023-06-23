package com.smeni;

import android.media.MediaPlayer;
import android.media.audiofx.Visualizer;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.chaquo.python.PyObject;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
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
        if (! Python.isStarted()) {
            Python.start(new AndroidPlatform(this.getReactApplicationContext()));
        }
        Python py = Python.getInstance();
        PyObject pyObj = py.getModule("visualizer");
        PyObject waveForm = pyObj.callAttr("generate_waveform_image", audioFilePath);
        //output_path
        promise.resolve("file://" + waveForm.toString());
    }

    @ReactMethod
    public void generateSpectrogram(String audioFilePath, Promise promise) {
        if (! Python.isStarted()) {
            Python.start(new AndroidPlatform(this.getReactApplicationContext()));
        }
        Python py = Python.getInstance();
        PyObject pyObj = py.getModule("visualizer");
        PyObject spectrogram = pyObj.callAttr("generate_spectrogram_image", audioFilePath);
        //output_path
        promise.resolve("file://" + spectrogram.toString());
    }

}
