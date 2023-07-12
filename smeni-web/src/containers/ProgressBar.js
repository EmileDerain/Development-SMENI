import React, {useState, useRef, useEffect} from 'react';

import './Global.css';
import './ProgressBar.css';
import {useDispatch, useSelector} from "react-redux";
import {setStreamAudioDuration} from "../redux/actions/smeniActions";

import {
    mdiPlay,
    mdiPause,
    mdiOpenInNew,
} from "@mdi/js";
import Icon from "@mdi/react";

const ProgressBar = ({audio}) => {
    // console.log('path', audioInfo.path)

    const url = "http://localhost:2834/audioFiles/" + audio.path

    // console.log('url', url)
    // state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // references
    const audioPlayer = useRef();   // reference our audio component
    const progressBar = useRef();   // reference our progress bar
    const animationRef = useRef();  // reference the animation


    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);


    const onLoadedMetadata = ()=>{
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
    }

    const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        if (audioPlayer.current !== null) {
            progressBar.current.value = audioPlayer.current.currentTime;
            changePlayerCurrentTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value);
    }

    useEffect(() => {
        console.log("audioInfo change")
        setIsPlaying(false);
    }, [audio]);

    return (
        <div className={"player"}>
            <audio ref={audioPlayer} src={url} onLoadedMetadata={onLoadedMetadata}/>

            {/* progress bar */}
            <div className={"progressBarDiv"}>
                <input type="range" className={"progressBar"} defaultValue="0" ref={progressBar}
                       onChange={changeRange}/>
            </div>
            <div className={"progressBarButton"}>

                <div className={"playPauseDiv menuRightTopTitreCentre"}>
                    {isPlaying ? <Icon path={mdiPause} size={1} onClick={togglePlayPause}/> :
                        <Icon path={mdiPlay} size={1} onClick={togglePlayPause}/>}
                </div>

                <div className={"nameDiv menuRightTopTitreCentre"}>
                    {audio.audioName}
                </div>

                {/* current time */}
                <div className={"currentTime menuRightTopTitreCentre"}>
                    {calculateTime(currentTime)}/{calculateTime(audio.duration)}
                </div>

                {/* duration */}
                {/*<div className={"duration"}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>*/}
                <div className={"moreInfoDiv menuRightTopTitreCentre"}>
                    <Icon path={mdiOpenInNew} size={1}/>
                </div>

            </div>
        </div>
    );
};

export default ProgressBar;
