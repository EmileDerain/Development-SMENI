import React, {useState, useRef, useEffect, useCallback} from 'react';

import './Global.css';
import './ProgressBar.css';
import './ProgressBarWaveForm.css';

import {
    mdiPlay,
    mdiPause,
    mdiOpenInNew,
} from "@mdi/js";
import Icon from "@mdi/react";

import useWavesurfer from './component/useWavesurfer.js'

const ProgressBarWaveForm = ({audio, setProgressbar}) => {
        const url = "http://localhost:2834/audioFiles/" + audio.path
        console.log('path', url)

        const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;


        const WaveSurferPlayer = (props) => {
            const containerRef = useRef()
            const [isPlaying, setIsPlaying] = useState(false)
            const [currentTime, setCurrentTime] = useState(0)
            const wavesurfer = useWavesurfer(containerRef, props)

            // On play button click
            const onPlayClick = useCallback(() => {
                wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
            }, [wavesurfer])

            // Initialize wavesurfer when the container mounts
            // or any of the props change
            useEffect(() => {
                if (!wavesurfer) return

                setCurrentTime(0)
                setIsPlaying(false)

                const subscriptions = [
                    wavesurfer.on('play', () => setIsPlaying(true)),
                    wavesurfer.on('pause', () => setIsPlaying(false)),
                    wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
                ]

                return () => {
                    subscriptions.forEach((unsub) => unsub())
                }
            }, [wavesurfer])

            return (
                <div className={"player"}>

                    <div className={"progressBarWave"}>
                        <div className={"progressBarWaveDiv"}>
                            <div ref={containerRef} style={{height: '100%', backgroundColor: 'white'}}/>
                        </div>
                    </div>


                    <div className={"progressBarButtonWave"}>

                        <div className={"playPauseDiv menuRightTopTitreCentre"}>
                            {isPlaying ? <Icon path={mdiPause} size={1} onClick={onPlayClick}/> :
                                <Icon path={mdiPlay} size={1} onClick={onPlayClick}/>}
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
                            <Icon path={mdiOpenInNew} className={"cursorHoverPointerBlue"} onClick={() => setProgressbar(1)} size={1}/>
                        </div>

                    </div>
                </div>

            )
        }
        return (
            <WaveSurferPlayer
                height="auto"
                waveColor="rgb(28,107,164)"
                progressColor="rgb(107,178,230)"
                url={url}
            />
        );
    }
;

export default ProgressBarWaveForm;
