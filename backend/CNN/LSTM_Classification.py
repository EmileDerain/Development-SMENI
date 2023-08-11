import os
import fnmatch
import numpy as np
import librosa
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, LSTM, Bidirectional, Flatten
from tensorflow.keras.callbacks import ModelCheckpoint, LearningRateScheduler, EarlyStopping
from keras.layers import Input, Conv1D, MaxPool1D, BatchNormalization, MaxPooling1D

import argparse

global audio_load

audio_load = 0


def stretch(data, rate):
    data = librosa.effects.time_stretch(data, rate=rate)
    return data


def load_file_data(folder, file_names, duration=10, sr=22050):
    global audio_load, TRAIN_IMG_COUNT

    input_length = sr * duration
    features = 55
    data = []
    for file_name in file_names:

        sound_file = folder + file_name
        # print("Loading file :", file_name)
        X, sr = librosa.load(sound_file, sr=sr, duration=duration)
        dur = librosa.get_duration(y=X, sr=sr)
        # pad audio file same duration
        if round(dur) < duration:
            # print("fixing audio lenght :", file_name)
            X = librosa.util.fix_length(X, size=input_length)

            # extract normalized mfcc feature from data
        mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sr, n_mfcc=features).T, axis=0)
        feature = np.array(mfccs).reshape([-1, 1])
        data.append(feature)

        stretch_data_1 = stretch(X, 0.8)
        mfccs_stretch_1 = np.mean(librosa.feature.mfcc(y=stretch_data_1, sr=sr, n_mfcc=features).T, axis=0)
        feature_1 = np.array(mfccs_stretch_1).reshape([-1, 1])
        data.append(feature_1)

        stretch_data_2 = stretch(X, 1.2)
        mfccs_stretch_2 = np.mean(librosa.feature.mfcc(y=stretch_data_2, sr=sr, n_mfcc=features).T, axis=0)
        feature_2 = np.array(mfccs_stretch_2).reshape([-1, 1])
        data.append(feature_2)
        audio_load += 1
        print(audio_load,"/", TRAIN_IMG_COUNT ,"- Loaded file :", file_name)

    return data


def trainModel(model_name):
    global audio_load, TRAIN_IMG_COUNT
    ###############
    ### Folders ###
    ###############

    data_path = "CNN/data/Test"
    data_path2 = "CNN/dataStemoscope/Test"

    # Kaggel dataet
    normal_data = data_path + '/normal/'
    murmur_data = data_path + '/murmur/'
    extrastole_data = data_path + '/extrastole/'
    artifact_data = data_path + '/artifact/'
    extrahls_data = data_path + '/extrahls/'

    # Stemoscope dataet
    normal_dataS = data_path2 + '/normal/'
    murmur_dataS = data_path2 + '/murmur/'
    extrastole_dataS = data_path2 + '/extrastole/'
    artifact_dataS = data_path2 + '/artifact/'
    extrahls_dataS = data_path2 + '/extrahls/'


    COUNT_0 = len(os.listdir(artifact_data) + os.listdir(artifact_dataS)) - 2  # artifact
    COUNT_1 = len(os.listdir(murmur_data) + os.listdir(murmur_dataS)) - 2  # murmur
    COUNT_2 = len(os.listdir(normal_data) + os.listdir(normal_dataS)) - 2  # normal
    COUNT_3 = len(os.listdir(extrahls_data) + os.listdir(extrahls_dataS)) - 2  # extrahls
    COUNT_4 = len(os.listdir(extrastole_data) + os.listdir(extrastole_dataS)) - 2  # extrastole

    TRAIN_IMG_COUNT = COUNT_0 + COUNT_1 + COUNT_2 + COUNT_3 + COUNT_4

    print("Normal files:", len(os.listdir(normal_data)) - 1)  # length of normal training sounds
    print("Murmur files:", len(os.listdir(murmur_data)) - 1)  # length of murmur training sounds
    print("Extrastole files", len(os.listdir(extrastole_data)) - 1)  # length of extrastole training sounds
    print("Artifact files:", len(os.listdir(artifact_data)) - 1)  # length of artifact training sounds
    print("Extrahls files:", len(os.listdir(extrahls_data)) - 1)  # length of extrahls training sounds

    print("Normal stemoscope files:", len(os.listdir(normal_dataS)) - 1)  # length of normal training sounds
    print("Murmur stemoscope files:", len(os.listdir(murmur_dataS)) - 1)  # length of murmur training sounds
    print("Extrastole stemoscope files", len(os.listdir(extrastole_dataS)) - 1)  # length of extrastole training sounds
    print("Artifact stemoscope files:", len(os.listdir(artifact_dataS)) - 1)  # length of artifact training sounds
    print("Extrahls stemoscope files:", len(os.listdir(extrahls_dataS)) - 1)  # length of extrahls training sounds

    print("Total Normal files:", COUNT_2)  # length of normal training sounds
    print("Total Murmur files:", COUNT_1)  # length of murmur training sounds
    print("Total Extrastole files", COUNT_4)  # length of extrastole training sounds
    print("Total Artifact files:", COUNT_0)  # length of artifact training sounds
    print("Total Extrahls files:", COUNT_3)  # length of extrahls training sounds

    print("Total files:", TRAIN_IMG_COUNT)  # length of extrahls training sounds

    # Map label text to integer
    CLASSES = ['artifact', 'murmur', 'normal', 'extrahls', 'extrastole']
    NB_CLASSES = len(CLASSES)

    # Map integer value to text labels
    label_to_int = {k: v for v, k in enumerate(CLASSES)}
    # print(label_to_int)
    # print(" ")
    int_to_label = {v: k for k, v in label_to_int.items()}
    # print(int_to_label)

    ##################
    ### Load files ###
    ##################

    # 22 KHz
    SAMPLE_RATE = 22050
    # seconds
    MAX_SOUND_CLIP_DURATION = 10

    # print("rest")
    # print(os.path.dirname(__file__))

    artifact_files = fnmatch.filter(os.listdir(artifact_data), 'artifact*.wav')
    artifact_sounds = load_file_data(folder=artifact_data, file_names=artifact_files, duration=MAX_SOUND_CLIP_DURATION,
                                     sr=SAMPLE_RATE)
    # artifact_labels = [0 for _ in artifact_sounds]

    normal_files = fnmatch.filter(os.listdir(normal_data), 'normal*.wav')
    normal_sounds = load_file_data(folder=normal_data, file_names=normal_files, duration=MAX_SOUND_CLIP_DURATION,
                                   sr=SAMPLE_RATE)
    # normal_labels = [2 for _ in normal_sounds]

    extrahls_files = fnmatch.filter(os.listdir(extrahls_data), 'extrahls*.wav')
    extrahls_sounds = load_file_data(folder=extrahls_data, file_names=extrahls_files, duration=MAX_SOUND_CLIP_DURATION,
                                     sr=SAMPLE_RATE)
    # extrahls_labels = [3 for _ in extrahls_sounds]

    murmur_files = fnmatch.filter(os.listdir(murmur_data), 'murmur*.wav')
    murmur_sounds = load_file_data(folder=murmur_data, file_names=murmur_files, duration=MAX_SOUND_CLIP_DURATION,
                                   sr=SAMPLE_RATE)
    # murmur_labels = [1 for _ in murmur_sounds]

    extrastole_files = fnmatch.filter(os.listdir(extrastole_data), 'extrastole*.wav')
    extrastole_sounds = load_file_data(folder=extrastole_data, file_names=extrastole_files,
                                       duration=MAX_SOUND_CLIP_DURATION, sr=SAMPLE_RATE)
    # extrastole_labels = [4 for _ in extrastole_sounds]

    print("Loading 0 Done")

    artifact_files = fnmatch.filter(os.listdir(artifact_dataS), 'artifact*.wav')
    artifact_sounds += load_file_data(folder=artifact_dataS, file_names=artifact_files, duration=MAX_SOUND_CLIP_DURATION,
                                      sr=SAMPLE_RATE)
    artifact_labels = [0 for _ in artifact_sounds]

    normal_files = fnmatch.filter(os.listdir(normal_dataS), 'normal*.wav')
    normal_sounds += load_file_data(folder=normal_dataS, file_names=normal_files, duration=MAX_SOUND_CLIP_DURATION,
                                    sr=SAMPLE_RATE)
    normal_labels = [2 for _ in normal_sounds]

    extrahls_files = fnmatch.filter(os.listdir(extrahls_dataS), 'extrahls*.wav')
    extrahls_sounds += load_file_data(folder=extrahls_dataS, file_names=extrahls_files, duration=MAX_SOUND_CLIP_DURATION,
                                      sr=SAMPLE_RATE)
    extrahls_labels = [3 for _ in extrahls_sounds]

    murmur_files = fnmatch.filter(os.listdir(murmur_dataS), 'murmur*.wav')
    murmur_sounds += load_file_data(folder=murmur_dataS, file_names=murmur_files, duration=MAX_SOUND_CLIP_DURATION,
                                    sr=SAMPLE_RATE)
    murmur_labels = [1 for _ in murmur_sounds]

    extrastole_files = fnmatch.filter(os.listdir(extrastole_dataS), 'extrastole*.wav')
    extrastole_sounds += load_file_data(folder=extrastole_dataS, file_names=extrastole_files,
                                        duration=MAX_SOUND_CLIP_DURATION, sr=SAMPLE_RATE)
    extrastole_labels = [4 for _ in extrastole_sounds]

    print("Loading (Stemoscope) 1 Done")

    print(audio_load, '/', TRAIN_IMG_COUNT)

    ###################
    ### Split files ###
    ###################

    artifact_train, artifact_test, artifact_train_labels, artifact_test_labels = train_test_split(artifact_sounds,
                                                                                                  artifact_labels,
                                                                                                  test_size=0.2,
                                                                                                  random_state=42)
    normal_train, normal_test, normal_train_labels, normal_test_labels = train_test_split(normal_sounds, normal_labels,
                                                                                          test_size=0.2,
                                                                                          random_state=42)
    extrahls_train, extrahls_test, extrahls_train_labels, extrahls_test_labels = train_test_split(extrahls_sounds,
                                                                                                  extrahls_labels,
                                                                                                  test_size=0.2,
                                                                                                  random_state=42)
    murmur_train, murmur_test, murmur_train_labels, murmur_test_labels = train_test_split(murmur_sounds, murmur_labels,
                                                                                          test_size=0.2,
                                                                                          random_state=42)
    extrastole_train, extrastole_test, extrastole_train_labels, extrastole_test_labels = train_test_split(
        extrastole_sounds,
        extrastole_labels,
        test_size=0.2,
        random_state=42)

    artifact_train, artifact_val, artifact_train_labels, artifact_val_labels = train_test_split(artifact_train,
                                                                                                artifact_train_labels,
                                                                                                test_size=0.1,
                                                                                                random_state=42)
    normal_train, normal_val, normal_train_labels, normal_val_labels = train_test_split(normal_train,
                                                                                        normal_train_labels,
                                                                                        test_size=0.1, random_state=42)
    extrahls_train, extrahls_val, extrahls_train_labels, extrahls_val_labels = train_test_split(extrahls_train,
                                                                                                extrahls_train_labels,
                                                                                                test_size=0.1,
                                                                                                random_state=42)
    murmur_train, murmur_val, murmur_train_labels, murmur_val_labels = train_test_split(murmur_train,
                                                                                        murmur_train_labels,
                                                                                        test_size=0.1, random_state=42)
    extrastole_train, extrastole_val, extrastole_train_labels, extrastole_val_labels = train_test_split(
        extrastole_train,
        extrastole_train_labels,
        test_size=0.1,
        random_state=42)

    x_train = np.concatenate((artifact_train, normal_train, extrahls_train, murmur_train, extrastole_train))
    y_train = np.concatenate(
        (artifact_train_labels, normal_train_labels, extrahls_train_labels, murmur_train_labels,
         extrastole_train_labels))
    x_val = np.concatenate((artifact_val, normal_val, extrahls_val, murmur_val, extrastole_val))
    y_val = np.concatenate(
        (artifact_val_labels, normal_val_labels, extrahls_val_labels, murmur_val_labels, extrastole_val_labels))
    x_test = np.concatenate((artifact_test, normal_test, extrahls_test, murmur_test, extrastole_test))
    y_test = np.concatenate(
        (artifact_test_labels, normal_test_labels, extrahls_test_labels, murmur_test_labels, extrastole_test_labels))

    ############################
    ### Encoding for classes ###
    ############################

    # One-Hot encoding for classes
    y_train = np.array(tf.keras.utils.to_categorical(y_train, len(CLASSES)))
    y_test = np.array(tf.keras.utils.to_categorical(y_test, len(CLASSES)))
    y_val = np.array(tf.keras.utils.to_categorical(y_val, len(CLASSES)))

    ##############
    ### Weight ###
    ##############

    weight_for_0 = TRAIN_IMG_COUNT / (3 * COUNT_0)
    weight_for_1 = TRAIN_IMG_COUNT / (3 * COUNT_1)
    weight_for_2 = TRAIN_IMG_COUNT / (3 * COUNT_2)
    weight_for_3 = TRAIN_IMG_COUNT / (3 * COUNT_3)
    weight_for_4 = TRAIN_IMG_COUNT / (3 * COUNT_4)
    class_weight = {0: weight_for_0, 1: weight_for_1, 2: weight_for_2, 3: weight_for_3, 4: weight_for_4}

    x_train_lstm = x_train
    x_val_lstm = x_val
    x_test_lstm = x_test

    y_train_lstm = y_train
    y_val_lstm = y_val
    y_test_lstm = y_test

    #############
    ### Model ###
    #############

    lstm_model = Sequential()

    lstm_model.add(Conv1D(1024, kernel_size=10, strides=1, activation='relu', input_shape=(55, 1)))
    lstm_model.add(MaxPooling1D(pool_size=2, strides=2))
    lstm_model.add(BatchNormalization())

    lstm_model.add(Conv1D(1024, kernel_size=1, strides=1, activation='relu', input_shape=(55, 1)))
    lstm_model.add(MaxPooling1D(pool_size=2, strides=2))
    lstm_model.add(BatchNormalization())

    lstm_model.add(Conv1D(512, kernel_size=1, strides=1, activation='relu'))
    lstm_model.add(MaxPooling1D(pool_size=2, strides=2))
    lstm_model.add(BatchNormalization())

    lstm_model.add(LSTM(256, return_sequences=True))
    lstm_model.add(LSTM(128))

    lstm_model.add(Dense(64, activation='relu'))
    lstm_model.add(Dropout(0.5))

    lstm_model.add(Dense(32, activation='relu'))
    lstm_model.add(Dropout(0.5))

    lstm_model.add(Dense(5, activation='softmax'))

    lstm_model.summary()

    ###################
    ### Train model ###
    ###################

    optimiser = tf.keras.optimizers.Adam(learning_rate=1e-4)
    lstm_model.compile(optimizer=optimiser,
                       loss='categorical_crossentropy',
                       metrics=['accuracy'])

    callback = tf.keras.callbacks.EarlyStopping(patience=50, monitor='val_accuracy', mode='max',
                                                restore_best_weights=True), \
        ModelCheckpoint("./CNN/models/" + model_name + "_EarlyStopping.h5",
                        save_best_only=True)

    lstm_model.fit(x_train_lstm, y_train_lstm,
                   validation_data=(x_val_lstm, y_val_lstm),
                   batch_size=8, epochs=1,
                   class_weight=class_weight,
                   callbacks=callback)

    lstm_model.save("./CNN/models/" + model_name + ".h5")

    print("lstm_model.save: ", "./CNN/models/" + model_name + ".h5")
    return lstm_model.evaluate(x_test_lstm, y_test_lstm)


def main():
    parser = argparse.ArgumentParser(description='Predict')
    parser.add_argument('modelName', type=str, help='Model name.')
    args = parser.parse_args()

    print(trainModel(args.modelName))


main()
