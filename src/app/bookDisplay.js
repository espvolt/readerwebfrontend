import style from "./bookDisplay.module.css"
import { useEffect, useState } from "react"
import { getTimeText } from "./multiSearchDisplay";
import { addTrackToPlaylist, getBookData, removeTrackFromPlaylist, setUpdateTrackProgress } from "./global";
import { setQueue } from "./queue";
import { createContextMenu, getCachedPlaylists, refreshPlaylistsAndBookmarks } from "@/pages/[...app]";

export default function BookDisplay(props) {
    const [chapterEntries, setChapterEntries] = useState([]);
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        window.history.replaceState(null, "New Page Title", `/book/${props.bookId}`);

        getBookData(props.bookId).then(resp => {
            if (resp != null) {
                console.log(resp);
                const title = document.getElementById(style.bookTitle);
                const data = resp.data
                title.textContent = data.title;
                setChapterEntries(data.chapters);
                if (resp.track_progress_data !== undefined) {
                    setProgressData(resp.track_progress_data);
                }
            }    
        });

        return () => {
            setUpdateTrackProgress((id, newProgress) => {})
        }
    }, []);

    setUpdateTrackProgress((id, newProgress) => {
        var currentData = {... progressData };
        console.log(currentData);
        if (parseInt(id) in currentData) {
            currentData[id] = newProgress;
            
            setProgressData(v => currentData);
        }
    })

    return (
        <>
            <div className={style.bookDisplayBackground}>
                <h1 id={style.bookTitle}></h1>
                <table id={style.bookTable}>
                    <thead>
                        <tr id={"tablePercentageHelper"}>
                            <th>#</th>
                            <th>Chapter Title</th>
                            <th>Tags</th>
                            <th>Length</th>
                        </tr>
                        {chapterEntries.map((elem, i) => {            
                            
                            // cancerous
                            var cell_css = [{}, {}, {}, {}];
                            
                            const headerRow = document.getElementById("tablePercentageHelper");
                            const total = headerRow.getBoundingClientRect().width;
                            const target = total * progressData[elem.chapter_track_id];
                            var current = 0;
                            
                            console.log("TARGET", target);

                            for (var index = 0; index < headerRow.children.length; index++) {
                                var currentWidth = headerRow.children[index].getBoundingClientRect().width;
                                
                                current += currentWidth;
                                console.log(current, target, index);

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


                            return (<tr className={style.chapterRow} 
                                onDoubleClick={() => {
                                    const title = document.getElementById(style.bookTitle);
                                    
                                    var queue = [];
                                    
                                    // console.log(i, chapterEntries.length);
                                    for (var j = i; j < chapterEntries.length; j++) {
                                        // console.log("ASDASD", chapterEntries[j]);
                                        queue.push({"trackName": chapterEntries[j].chapter_title,
                                             "trackSource": title.textContent,
                                             "trackId": chapterEntries[j].chapter_track_id});
                                    }
                                    
                                    
                                    setQueue(queue, true, progressData[elem.chapter_track_id] * elem.chapter_length);
                                }}

                                onContextMenu={(ev) => {
                                    ev.preventDefault();
                
                                    const playlists = getCachedPlaylists();
                                    var playlistButtons = [];
                                    
                                    console.log(playlists);
                                    if (playlists.length == 0) {
                                        playlistButtons.push({
                                            "type": "button",
                                            "text": "No playlists!",
                                            "callback": () => {}
                                        })
                                    }
                                    playlists.forEach(playlist => {
                                        var buttonText = playlist.playlistName;
                                        
                                        var callback = () => {
                                            addTrackToPlaylist(playlist.playlistId, elem.chapter_track_id).then(data => {
                                                refreshPlaylistsAndBookmarks();
                                            });
                                        }

                                        if (playlist.playlistTracks.includes(parseInt(elem.chapter_track_id))) {
                                            buttonText += " ✓"
                                            
                                            callback = () => {
                                                removeTrackFromPlaylist(playlist.playlistId, elem.chapter_track_id).then(data => {
                                                    refreshPlaylistsAndBookmarks();
                                                });
                                            }
                                        }

                                        
                                        playlistButtons.push({
                                            "type": "button",
                                            "text": buttonText,
                                            "callback": callback
                                        })
                                    })
                                    createContextMenu([
                                        {
                                            "type": "extension",
                                            "text": "Add to playlist",
                                            "data": playlistButtons
                                        }    
                                    ], {x: ev.clientX, y: ev.clientY})
                                }}>
                                <td style={cell_css[0]}>{i + 1}</td>
                                <td style={cell_css[1]}>{elem.chapter_title}</td>
                                <td style={cell_css[2]}>[{elem.tags}]</td>
                                <td style={cell_css[3]}>{getTimeText(elem.chapter_length)}</td>
                            </tr>);
                        })}
                    </thead>
                </table>
            </div>
        </>

    )    
}
