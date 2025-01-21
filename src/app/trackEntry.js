import style from "./trackEntry.module.css"
import { addTrackToPlaylist, removeTrackFromPlaylist, triggerPlayTrack } from "./global";
import { createContextMenu, getCachedPlaylists, refreshPlaylists } from "@/pages";

export function TrackEntryHeader() {
    return (
        <>
        <div className={style.container} style={{"background-color": "rgb(22, 22, 22)"}}>
            <div className={style.nameButton}>
                <h3>Title</h3>
            </div>
            <p id={style.tags}>Tags</p> 
            <p id={style.time}>Length</p>
        </div>
        </>
    )
}

export function TrackEntry(props) {
    const getTime = () => {
        var hou = Math.floor(props.length / 3600) ;
        var min = Math.floor(props.length / 60);
        var sec = Math.trunc(props.length % 60);
        
        var secText = sec > 10 ?  sec + "" : "0" + sec
        if (hou >= 0) {
            console.log(min)
            return min + ":" + secText 
        }
        return hou + ":" + min + ":" + sec
    }

    const attemptPlayTrack = (track_id) => {
        triggerPlayTrack(track_id)
    }

    const onContextMenu = (ev) => {
        ev.preventDefault();
        
        const playlistData = getCachedPlaylists();
        var extensionData = []
        
        Object.values(playlistData).forEach((playlist) => {
            var text = playlist.playlistName;


            if (playlist.playlistTracks) {
                // console.log(" TRACKS", playlist.playlistTracks);
                // console.log("TRCKID", props.trackId);
                // console.log("CONDITION", playlist.playlistTracks.includes(props.trackId))
                if (playlist.playlistTracks.includes(parseInt(props.trackId))) {
                    text += " ✓";
                }
            }

            const currentFunction = () => {
                if (playlist.playlistTracks.includes(parseInt(props.trackId))) {
                    removeTrackFromPlaylist(playlist.playlistId, props.trackId).then(() => {
                        refreshPlaylists();
                    });
                } else {
                    addTrackToPlaylist(playlist.playlistId, props.trackId).then(() => {
                        refreshPlaylists();
                    });    
                }
            }

            extensionData.push({
                "type": "button",
                "text": text,
                "callback": currentFunction
            });
        });

        console.log(playlistData);

        createContextMenu([
            {
                "type": "button",
                "text": "Add to queue",
                "callback": () => {console.log("add to queue");}
            },
            {
                "type": "extension",
                "text": "Add to playlist",
                "data": extensionData
            }
        ], {x: ev.clientX, y: ev.clientY});
    }
    return (
        <>
        <div className={style.container} onDoubleClick={() => {
            attemptPlayTrack(props.trackId);
        }} onContextMenu={onContextMenu}>
            <div className={style.nameButton}>
                <button onClick={() => {
                    attemptPlayTrack(props.trackId);
                }} id={style.button}>{">"}</button>
                <h3>{props.displayName}</h3>
            </div>
            <p id={style.tags}>{"[" + props.tags + "]"}</p> 
            <p id={style.time}>{getTime()}</p>
        </div>
        </>
    )
}