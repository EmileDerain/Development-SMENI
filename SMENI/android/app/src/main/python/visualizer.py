import librosa
import matplotlib.pyplot as plt
import numpy as np


# Chemin relatif vers le fichier audio
audio_path = '1683880817754.wav'

# Charger le fichier audio
audio, sr = librosa.load(audio_path)

# Générer l'onde audio (oscillogramme)
plt.figure(figsize=(12, 4))
librosa.display.waveshow(audio, sr=sr)
plt.title('Onde audio (oscillogramme)')
plt.xlabel('Temps (s)')
plt.ylabel('Amplitude')
plt.show()

# Calculer le spectrogramme
plt.figure(figsize=(12, 4))
D = librosa.amplitude_to_db(np.abs(librosa.stft(audio)), ref=np.max)
librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.title('Spectrogramme')
plt.xlabel('Temps (s)')
plt.ylabel('Fréquence (Hz)')
plt.show()
