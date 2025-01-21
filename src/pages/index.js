import styles from "./index.module.css"
import Header from "@/app/header.js"
import { getSessionId, _fetch, createPlaylist, getPlaylists, getTracks, setPlayTrackCallback, setHandleContextMenuCreation } from "@/app/global"
import { useEffect, useState } from "react";
import PlaylistNameEntry from "@/app/playlistNameEntry";
import PlaylistEntry from "@/app/playlistEntry";
import PlaylistDisplay from "@/app/playlistDisplay";
import TrackSearchDisplay from "@/app/trackSearchDisplay";
import TrackPlayer from "@/app/trackPlayer";
import ContextMenu from "@/app/contextMenu";

export function refreshPlaylists() {}
export function createContextMenu(data, position) {}
export function getCachedPlaylists() {}

export class PlaylistCacheData {
    playlistId = -1;
    playlistName = "";
    playlistTracks = [];

    constructor(id, name, tracks) {
        this.playlistId = id;
        this.playlistName = name
        this.playlistTracks = tracks
    }
}
export default function App() {
    // console.log(getSessionId());
    const [playlistNameEntries, setPlaylistNameEntry] = useState([])
    const [playlistEntries, setPlaylistEntries] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState();
    const [currentPlayer, setCurrentPlayer] = useState();
    const [contextMenu, setContextMenu] = useState();

    useEffect(() => {
        var playlistList = document.getElementById(styles.playlistList);
        searchCallback("");
        if (getSessionId() != -1) {
            setPlaylists().then(() => {
            });
        }
        
        const sessionInfoProcessedHook = async () => {
            await setPlaylists();
        }

        const mouseDownListener = (ev) => {
            if (ev.target.onclick && ev.target.className.startsWith("contextMenu")) {
                ev.target.onclick(ev);
                setContextMenu(null);
            } else {
                setContextMenu(null);
            }
        }

        document.addEventListener("sessioninfoprocessed", sessionInfoProcessedHook)
        document.addEventListener("mousedown", mouseDownListener);
        return () => {
            document.removeEventListener("sessioninfoprocessed", sessionInfoProcessedHook);
            document.removeEventListener("mousedown", mouseDownListener);
        }
    }, []);

    const createPlaylistClicked = () => {
        setPlaylistNameEntry(v => [<PlaylistNameEntry onSubmitted={onPlaylistNameSubmit}/>])
    }

    const playlistEntryClicked = (event) => {
        var node = event.target;
        if (node) {
            // console.log("HERE", node.getAttribute("playlistentryid"));
            // setCurrentDisplay(v => [])
            setCurrentDisplay(<PlaylistDisplay playlistId={node.getAttribute("playlistentryid")} key={node.getAttribute("playlistentryid")}/>)
            // setTimeout(() => {
                
            // }, 1); // why
        }
    }

    const setPlaylists = async () => {
        var message = await getPlaylists();
        
        if (message) {
            var playlists = message.playlists
            var elements = [];
            Object.entries(playlists).forEach(([k, v]) => {
                elements.push(new PlaylistCacheData(v.playlist_id, v.display_name, v.tracks))
            });
            setPlaylistEntries(v => elements);
        }
    }

    const onPlaylistNameSubmit = async (text) => {
        setPlaylistNameEntry([])

        var resp = await createPlaylist(text);
        if (resp.success) {
            await setPlaylists();
        }
    }

    const searchCallback = (text) => {
        getTracks(text).then((data) => {
            if (data) {
                setCurrentDisplay(<TrackSearchDisplay key={text} searchInfo={data} searchText={text}/>);
            }
        });

        
    }

    const playTrackCallback = (id) => {
        setCurrentPlayer(<TrackPlayer trackId={id}/>)
    }

    const handleContextMenuCreationCallback = (data, position) => {
        setContextMenu(<ContextMenu key={position.x * position.y * position.y} data={data} menuPosition={position}/>);
    }

    refreshPlaylists = () => {
        setPlaylists();
    }

    createContextMenu = (data, position) => {
        setContextMenu(<ContextMenu key={position.x * position.y * position.y} data={data} menuPosition={position}/>);
    }

    getCachedPlaylists = () => {
        return playlistEntries;
    }

    setPlayTrackCallback(playTrackCallback);
    // setHandleContextMenuCreation(handleContextMenuCreationCallback);

    return (
        <div className={styles.appcontainer}>
            {contextMenu}
            {playlistNameEntries.map((elem) => <PlaylistNameEntry onSubmitted={onPlaylistNameSubmit}/>)}
            <Header searchBar={true} onSearchBarSubmit={searchCallback}/>
            <div className={styles.app}>
                <div className={styles.playlistSection}>
                    <div className={styles.playlistHeader}>
                        <h1>Your Library</h1>
                        <button id={styles.addButton} onClick={createPlaylistClicked}>+</button>
                    </div>
                    <ul id={styles.playlistList} onClick={playlistEntryClicked}>
                        {playlistEntries.map((elem) => <PlaylistEntry title={elem.playlistName} numItems={elem.playlistTracks.length} playlistEntryId={elem.playlistId} />)}
                    </ul>
                </div>
                <div className={styles.displaySection}>
                    {currentDisplay}
                </div>
                <div className={styles.audioPlayer}>
                    {currentPlayer}
                </div>
            </div>
        </div>
    )
}