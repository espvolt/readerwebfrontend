import { useEffect, useState } from "react";
import { getSessionId, getPlaylist } from "./global";
import { TrackEntry, TrackEntryHeader } from "./trackEntry";
import style from "./playlistDisplay.module.css"

export default function PlaylistDisplay(props) {
    const [playlistEntries, setPlaylistEntries] = useState([]);

    useEffect(() => {
        // console.log("I EXIST");
        var titleElement = document.getElementById(style.playlistTitle);
        getPlaylist(props.playlistId).then((data) => {
            if (!data.success) {
                return;
            }

            var playlist = data.playlist;
            if (titleElement)
            titleElement.textContent = playlist.display_name;
            console.log(data.playlist);
            
            var res = [];

            data.playlist.tracks.forEach((element) => {
                res.push(<TrackEntry 
                    key={element.track_id} trackId={element.track_id} 
                    tags={element.tags} displayName={element.display_name} length={element.length}/>);
            })

            setPlaylistEntries(v => [<TrackEntryHeader/>, ...res]);
        });
    }, [])


    return (
        <div className={style.playlistBackground}>
            <h1 id={style.playlistTitle}></h1>
            <ul id={style.trackEntries}>
                {playlistEntries.map((element) => element)}
            </ul>
        </div>
    )
}