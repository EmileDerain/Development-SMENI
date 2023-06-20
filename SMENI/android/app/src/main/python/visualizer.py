import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf

def generate_waveform_image(audio_path):
    audio, sample_rate = sf.read(audio_path)

    output_path = get_output_path(audio_path, 'onde_audio.png')

    plt.figure(figsize=(12, 4))
    time = np.arange(0, len(audio)) / sample_rate
    plt.plot(time, audio)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

    return output_path

def generate_spectrogram_image(audio_path):
    audio, sample_rate = sf.read(audio_path)

    output_path = get_output_path(audio_path, 'spectrogramme.png')

    plt.figure(figsize=(12, 4))
    plt.specgram(audio, Fs=sample_rate)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

    return output_path

def get_output_path(audio_path, filename):
    # Extraire le répertoire en supprimant le nom de fichier
    audio_dir = '/'.join(audio_path.split('/')[:-1])

    # Concaténer le répertoire et le nom de fichier pour obtenir le output_path
    output_path = audio_dir + '/' + filename

    return output_path
