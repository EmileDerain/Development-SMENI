import numpy as np
import librosa
import tensorflow as tf
import json
import argparse

MAX_SOUND_CLIP_DURATION = 10


def stretch(data, rate):
    data = librosa.effects.time_stretch(data, rate=rate)
    return data


def load_file_data(file_path, duration=10, sr=22050):
    input_length = sr * duration
    features = 55
    data = []

    try:
        print("Loading file")
        X, sr = librosa.load(file_path, sr=sr, duration=duration)
        dur = librosa.get_duration(y=X, sr=sr)
        # pad audio file same duration
        if round(dur) < duration:
            print("fixing audio lenght :", file_path)
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

    except Exception as e:
        print("Error encountered while parsing file: ", file_path)

    return data


def predict(file_path, model_path):
    new_model = tf.keras.models.load_model(model_path)

    # Map label text to integer
    CLASSES = ['artifact', 'murmur', 'normal', 'extrahls', 'extrastole']

    # Map integer value to text labels
    label_to_int = {k: v for v, k in enumerate(CLASSES)}
    print(label_to_int)
    print(" ")
    int_to_label = {v: k for k, v in label_to_int.items()}
    print(int_to_label)

    file = load_file_data(file_path=file_path,
                          duration=MAX_SOUND_CLIP_DURATION)

    test_x = np.array(file)

    preds = new_model.predict(test_x)

    temp = preds[0]
    first = np.argmax(temp)
    proba = temp[first]

    temp[first] = -1
    second = np.argmax(temp)
    proba_2 = temp[second]

    dico = {
        "label_1": {
            "label": int_to_label[first],
            "accuracy": round(proba * 100, 2)
        },
        "label_2": {
            "label": int_to_label[second],
            "accuracy": round(proba_2 * 100, 2)
        }
    }

    json_data = json.dumps(dico)

    return json_data

def main():
    parser = argparse.ArgumentParser(description='Predict')
    parser.add_argument('inputFile', type=str, help='Path to input file.')
    parser.add_argument('modelFile', type=str, help='Path to the model.')
    args = parser.parse_args()

    print(predict(args.inputFile, args.modelFile))


main()
