import style from "./trackPlayer.module.css"
import { useEffect, useState } from "react"
import { SERVER_IP, getTrackInformation, getVolume, setVolume, updateTrackProgress, uploadTrackProgress } from "./global";
import { playNextTrack, getQueue } from "./queue";
import { toggleQueue } from "@/pages/[...app]";

const UPLOAD_TRACK_PROGRESS_INTERVAL = 5

export default function TrackPlayer(props) {
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        getTrackInformation(props.trackId).then((data) => {
            const leftSectionText = document.getElementById(style.playerTitle);


            leftSectionText.textContent = data.title;
        });        
        
        const audioPlayer = document.getElementById(style.audioPlayer);
        audioPlayer.volume = getVolume();
        audioPlayer.play(); // why
        audioPlayer.currentTime = props.progress;
    }, []);

    useEffect(() => {
        const audioPlayer = document.getElementById(style.audioPlayer);

        var interval = setInterval(() => {
            if (playing) {
                uploadTrackProgress(props.trackId, audioPlayer.currentTime / audioPlayer.duration);
                updateTrackProgress(props.trackId, audioPlayer.currentTime / audioPlayer.duration);
            }
        }, 1000 * UPLOAD_TRACK_PROGRESS_INTERVAL); // every 10 seconds

        return () => {
            clearInterval(interval);
        }
    }, [playing]);

    const onPlayButtonPushed = () => {
        setPlaying(playing => !playing);
        const audioPlayer = document.getElementById(style.audioPlayer);
        console.log("set", playing);

        if (!playing){
            audioPlayer.play();
        } else {
            audioPlayer.pause();
            updateTrackProgress(props.trackId, audioPlayer.currentTime / audioPlayer.duration);
            uploadTrackProgress(props.trackId, audioPlayer.currentTime / audioPlayer.duration);
        }
    }

    const timeUpdated = () => {
        const audioPlayer = document.getElementById(style.audioPlayer);
        const progressBar = document.getElementById(style.barProgress);
        if (progressBar) {
            progressBar.style.width = ((audioPlayer.currentTime / audioPlayer.duration) * 100) + "%"
        }7
    }
    
    const progressBar = (event) => {
        const audioPlayer = document.getElementById(style.audioPlayer);

        const progressBar = document.getElementById(style.progressBar);
        const computed = progressBar.getBoundingClientRect();
        const progress = (event.clientX - computed.left) / parseInt(computed.width);

        audioPlayer.currentTime = audioPlayer.duration * progress;
    }

    const queueButtonClicked = (event) => {
        toggleQueue();
    }
    
    const finished = (event) => {
        const audioPlayer = document.getElementById(style.audioPlayer);

        uploadTrackProgress(props.trackId, audioPlayer.currentTime / audioPlayer.duration);
        playNextTrack();
    }

    const volumeSet = (event) => {
        const slider = document.getElementById(style.slider);
        const audio = document.getElementById(style.audioPlayer);

        
        setVolume(slider.value / 100);
        audio.volume = slider.value / 100;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return (
        <>
        
        <div className={style.trackPlayerBody}>
            <audio onCanPlayThrough={async () => {
                const audioPlayer = document.getElementById(style.audioPlayer);
                
            }} controls id={style.audioPlayer} autoPlay={false} onTimeUpdate={timeUpdated} onEnded={finished}>
                <source src={`${SERVER_IP}/audio?id=${props.trackId}`}></source>
            </audio>

            <div className={style.leftSection}>
                <p id={style.playerTitle}></p>
            </div>
            <div className={style.mainSection}>
                <button onClick={onPlayButtonPushed} className={style.playButton}>{!playing ? ">" : "||"}</button>
                <div id={style.progressBar} onClick={progressBar}>
                    <div id={style.barProgress}></div>
                </div>
            </div>
            <div className={style.rightSection}>
                <div>
                    <input type="range" min="0" max="100" defaultValue={"" + getVolume() * 100} step="1" id={style.slider} onInput={volumeSet}/>
                    <button id={style.queueButton} onClick={queueButtonClicked}>Q</button>

                </div>
            </div>
        </div>
        </>
    )
}