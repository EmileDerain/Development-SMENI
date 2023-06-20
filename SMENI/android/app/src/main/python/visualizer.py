import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf

def generate_waveform_image(audio_path, output_path):
    audio, sample_rate = sf.read(audio_path)

    plt.figure(figsize=(12, 4))
    time = np.arange(0, len(audio)) / sample_rate
    plt.plot(time, audio)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

def generate_spectrogram_image(audio_path, output_path):
    audio, sample_rate = sf.read(audio_path)

    plt.figure(figsize=(12, 4))
    plt.specgram(audio, Fs=sample_rate)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

# Chemin relatif vers le fichier audio
audio_path = '1683880817754.wav'

# Générer l'onde audio (oscillogramme)
generate_waveform_image(audio_path, 'onde_audio.png')

# Calculer et générer le spectrogramme
generate_spectrogram_image(audio_path, 'spectrogramme.png')
