import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {setAudios} from "../redux/actions/smeniActions";
import AudioComponent from "./AudioComponent";


const Audios = () => {
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

    useEffect(() => {
        getAudioFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <AudioComponent/>
        </div>
    )
}


export default Audios;
