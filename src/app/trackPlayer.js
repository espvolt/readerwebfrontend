import style from "./trackPlayer.module.css"
import { useEffect, useState } from "react"
import { SERVER_IP, getTrackInformation } from "./global";

export default function TrackPlayer(props) {
    const [playing, setPlaying] = useState(true);

    useEffect(() => {

        getTrackInformation(props.trackId).then((data) => {
            console.log(data);
            const leftSectionText = document.getElementById(style.playerTitle);


            leftSectionText.textContent = data.display_name;
        });
    }, []);

    const onPlayButtonPushed = () => {
        setPlaying(!playing);
        const audioPlayer = document.getElementById(style.audioPlayer);

        if (!playing){
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    const timeUpdated = () => {
        const audioPlayer = document.getElementById(style.audioPlayer);
        const progressBar = document.getElementById(style.barProgress);
        if (progressBar) {
            progressBar.style.width = ((audioPlayer.currentTime / audioPlayer.duration) * 100) + "%"
        }
    }
    
    const progressBar = (event) => {
        const audioPlayer = document.getElementById(style.audioPlayer);

        const progressBar = document.getElementById(style.progressBar);
        const computed = progressBar.getBoundingClientRect();
        const progress = (event.clientX - computed.left) / parseInt(computed.width);

        // console.log(audioPlayer.duration * progress)
        audioPlayer.currentTime = audioPlayer.duration * progress;
    }

    const queueButtonClicked = (event) => {

    }
    return (
        <>
        
        <div className={style.trackPlayerBody}>
            <audio controls id={style.audioPlayer} autoPlay={true} onTimeUpdate={timeUpdated}>
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
                    <button id={style.queueButton} onClick={queueButtonClicked}>Q</button>

                </div>
            </div>
        </div>
        </>
    )
}