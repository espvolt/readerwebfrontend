import { useEffect, useState } from "react";
import { getSessionId, getPlaylist, getTracksFromArray, setUpdateTrackProgress } from "./global";
import { setQueue } from "./queue";
import { TrackEntry, TrackEntryHeader } from "./trackEntry";
import style from "./playlistDisplay.module.css"
import { getTimeText } from "./multiSearchDisplay";

export default function PlaylistDisplay(props) {
    const [playlistEntries, setPlaylistEntries] = useState([]);
    const [progressData, setTrackProgress] = useState([]);

    useEffect(() => {
        console.log(props.playlistId);
        window.history.replaceState(null, "New Page Title", `/playlist/${props.playlistId}`);

        const titleElement = document.getElementById(style.playlistTitle);
        
        getPlaylist(props.playlistId).then((data) => {
            if (!data.success) {
                return;
            }
            
            var playlist = data.playlist;

            if (titleElement != null) {
                titleElement.textContent = playlist.playlist_name;

            }
            
            setPlaylistEntries(v => data.playlist.tracks);

            if (data.track_progress_data !== undefined || data.track_progress_data != null) {
                setTrackProgress(data.track_progress_data);
            }
        });
    }, [])

    setUpdateTrackProgress((id, newProgress) => {
        var currentData = { ...progressData };
        console.log(id);
        if (parseInt(id) in currentData) {
            currentData[parseInt(id)] = newProgress
            
            setTrackProgress(currentData);
        }
    })

    return (
        <div className={style.playlistBackground}>
            <h1 id={style.playlistTitle}></h1>
            <table className={style.playlistTable}>
                <thead>
                    <tr id={style.playlistHeader}>
                        <th>#</th>
                        <th>Track Name</th>
                        <th>Length</th>
                    </tr>
                    {playlistEntries.map((elem, i) => {
                        var cell_css = [{}, {}, {}];
                        
                        console.log(progressData);
                        const headerRow = document.getElementById(style.playlistHeader);
                        const total = headerRow.getBoundingClientRect().width;
                        const target = total * progressData[elem.track_id];
                        var current = 0;
                        
                        
                        for (var index = 0; index < headerRow.children.length; index++) {
                            var currentWidth = headerRow.children[index].getBoundingClientRect().width;
                            
                            current += currentWidth;
                            // console.log(current, target, index);

                            if (current < target) {
                                cell_css[index] = {
                                    "borderBottom": "2px solid purple"
                                }
                            } else if (current > target) {
                                var gradient_from = current - currentWidth;
                                var gradient_to = target - gradient_from;

                                var percent_to = gradient_to / currentWidth * 100;
                                var percent_end = 100 - percent_to;

                                console.log(percent_to, percent_end);
                                cell_css[index] = {
                                    "borderBottom": "2px solid blue",
                                    "borderImage": `linear-gradient(to right, purple ${percent_to}%, transparent 0%) 100% 1`
                                }
                                break;
                            }
                        }
                        console.log(cell_css)
                        return (
                            <tr 
                                onDoubleClick={() => {
                                    const titleElement = document.getElementById(style.playlistTitle);

                                    var queue = [];

                                    for (var j = i; j < playlistEntries.length; j++) {
                                        queue.push({"trackName": playlistEntries[j].track_name,
                                            "trackSource": titleElement.textContent,
                                            "trackId": playlistEntries[j].track_id});
                                    }

                                    setQueue(queue, true, elem.length * progressData[elem.track_id]);

                                }}>
                                <td style={cell_css[0]}>{i + 1}</td>
                                <td style={cell_css[1]}>{elem.track_name}</td>
                                <td style={cell_css[2]}>{getTimeText(elem.length)}</td>
                            </tr>
                        )
                    })}
                </thead>
            </table>
        </div>
    )
}