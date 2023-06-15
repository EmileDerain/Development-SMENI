import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Howl} from 'howler';
import './AudioComponent.css';
import {setAudios} from "../redux/actions/smeniActions";


// Définir l'état initial
let isPlaying = false;
let sound = null;

// Méthode pour démarrer ou mettre en pause la lecture
const playAudio = (audioFile) => {
    console.log("playAudio")
    sound = new Howl({
        src: [audioFile],
        html5: true // Force la lecture en utilisant la balise audio HTML5 pour le streaming
    });

    if (sound) {
        if (!isPlaying) {
            sound.play();
        } else {
            sound.pause();
        }
        isPlaying = !isPlaying;
    }
};

// Méthode pour arrêter complètement la lecture et nettoyer l'instance de Howl
// const stopAudio = () => {
//     if (sound) {
//         sound.stop();
//         sound.unload();
//     }
// };


const AudioComponent = () => {
    const audios = useSelector((state) => state.allAudios.audios);

    const renderList = audios.map((product) => {
        const {_id, audioName, date, label} = product;
        return (
            <div className="audio-track" key={_id}>
                <div className="audio-info">
                    <div className="audio-name">{audioName}</div>
                    <div className="audio-date">{date}</div>
                    <div className="audio-label">{label}</div>
                </div>
                <div className="audio-controls">
                    <button
                        className="play-button"
                        onClick={() => playAudio(`http://localhost:2834/api/audio/stream/${_id}`)}
                    >
                        Play/Stop
                    </button>
                </div>
            </div>
        );
    });

    const dispatch = useDispatch();

    const getAudioFiles = () => {
        console.log("Req getAudioFiles")
        fetch('http://localhost:2834/api/audio/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioFiles => {
                // console.log("audioFilesDisplay: ", this.state.audioFilesDisplay);
                // Faites quelque chose avec les données récupérées
                dispatch(setAudios(audioFiles));
                // console.log("audioFilesDisplay: ", this.state.audioFilesDisplay);
            })
            .catch(error => {
                // Gérez les erreurs ici
                console.error(error);
            });
    };


    return <>
        <button onClick={getAudioFiles}>REFRESH</button>
        {renderList}
    </>;
};

export default AudioComponent;
