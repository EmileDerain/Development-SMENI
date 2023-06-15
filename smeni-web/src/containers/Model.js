import React from "react";
// ES6 import or TypeScript
import io from "socket.io-client";
import {showReload} from "../redux/actions/smeniActions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

const startTraining = () => {
    const postData = {};

    fetch('http://localhost:2834/api/cnn/train', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Une erreur s\'est produite lors de l\'envoi des données.');
            }
            return response.json();
        })
        .then(data => {
            // Faites quelque chose avec la réponse du serveur
            console.log(data);
        })
        .catch(error => {
            // Gérez les erreurs ici
            console.error(error);
        });
}


const Model = () => {
    const dispatch = useDispatch();
    const logs = useSelector((state) => state.cnn.logsCNN);

    useEffect(() => {
        console.log('io.connect("http://localhost:2834");')
        const socket = io.connect("http://localhost:2834");

        socket.on("receive_cnn_logs", (data) => {
            console.log("data: ", data);
            console.log("data: ", data.message);
            console.log("logs: ", logs);
            dispatch(showReload(data));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <button onClick={startTraining}>RELOAD MODEL</button>
            <div>{logs}</div>
        </div>
    )
}


export default Model;
