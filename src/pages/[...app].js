import styles from "./index.module.css"
import Header from "@/app/header.js"
import { getSessionId, _fetch, createPlaylist, getPlaylists, 
    getTracks, setPlayTrackCallback, setHandleContextMenuCreation, getMultiSearch, getBookmarks } from "@/app/global"
import { useEffect, useState } from "react";
import PlaylistNameEntry from "@/app/playlistNameEntry";
import PlaylistEntry from "@/app/playlistEntry";
import PlaylistDisplay from "@/app/playlistDisplay";
import TrackSearchDisplay from "@/app/trackSearchDisplay";
import TrackPlayer from "@/app/trackPlayer";
import ContextMenu from "@/app/contextMenu";
import MultiSearchDisplay from "@/app/multiSearchDisplay";
import BookmarkEntry from "@/app/bookmarkEntry";
import BookDisplay from "@/app/bookDisplay";
import { getQueue, setQueue, } from "@/app/queue";
import { UNSAFE_createRouter } from "react-router-dom";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/router";

export function refreshPlaylistsAndBookmarks() {}
export function createContextMenu(data, position) {}
export function getCachedPlaylists() {}
export function getCachedBookmarks() {}
export function setPlaylistsAndBookmarks() {}
export function setBookDisplay(id) {}
export function setDisplay(node) {}
export function toggleQueue() {}

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

export class BookmarkCacheData {
    bookId = -1;
    bookName = ""

    constructor(id, name) {
        this.bookId = id;
        this.bookName = name;
    }
}

export default function App(props) {
    // console.log(getSessionId());
    const params = useSearchParams();
    const router = useRouter();
    const [playlistNameEntries, setPlaylistNameEntry] = useState([])
    const [playlistEntries, setPlaylistEntries] = useState([]);
    const [bookmarkEntries, setBookmarkEntries] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState();
    const [currentPlayer, setCurrentPlayer] = useState();
    const [contextMenu, setContextMenu] = useState();
    const [queueTracks, setQueueTracks] = useState([]);

    useEffect(() => {
        var playlistList = document.getElementById(styles.playlistList);
        
        // if (props.fromIndex !== undefined && props.fromIndex) {
        //     searchCallback("");
        // } else if (router.query.app !== undefined) {
        //     const appData = router.query.app;
        //     if (appData.length <= 1) {
        //         searchCallback("");

        //     } else if (appData.length >= 2) {
        //         const func = appData[0];

        //         if (func == "search") {
        //             searchCallback(appData[1]);
        //         } else if (func == "book") {
        //             setBookDisplay(appData[1]);
        //         } else if (func == "playlist") {
        //             setCurrentDisplay(<PlaylistDisplay playlistId={(appData[1])} key={"" + appData[1] + "playli"}/>)
        //         }
        //     }
        // }
        


        
        if (getSessionId() != -1) {
            setPlaylistsAndBookmarks();
        }
        
        const sessionInfoProcessedHook = () => {
            console.log(getSessionId());
            setPlaylistsAndBookmarks();
            
            if (props.fromIndex !== undefined && props.fromIndex) {
                searchCallback("");
            } else if (router.query.app !== undefined) {
                const appData = router.query.app;
                if (appData.length <= 1) {
                    searchCallback("");
    
                } else if (appData.length >= 2) {
                    const func = appData[0];
    
                    if (func == "search") {
                        searchCallback(appData[1]);
                    } else if (func == "book") {
                        setBookDisplay(appData[1]);
                    } else if (func == "playlist") {
                        console.log("HERE?");
                        setCurrentDisplay(<PlaylistDisplay playlistId={(appData[1])} key={"" + appData[1] + "playli"}/>)
                    }
                }
            }
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
    }, [router.query]);

    const createPlaylistClicked = () => {
        setPlaylistNameEntry(v => [<PlaylistNameEntry onSubmitted={onPlaylistNameSubmit}/>])
    }

    const playlistEntryClicked = (event) => {
        var node = event.target;
        if (node) {
            setCurrentDisplay(<PlaylistDisplay playlistId={node.getAttribute("playlistentryid")} key={node.getAttribute("playlistentryid") + "Playi"}/>)
        }
    }

    const setPlaylistsAndBookmarks = () => {
        getPlaylists().then((data) => {
            console.log(data)
            if (data != null && data.success) {
                var elements = [];
                
                console.log(data);
                Object.entries(data.playlists).forEach(([k, v]) => {
                    elements.push(new PlaylistCacheData(parseInt(k), v.playlist_name, v.tracks));
                });

                setPlaylistEntries(v => elements);
            }    
        });

        getBookmarks().then((data) => {
            if (data != null) {    
                var elements = [];
    
                Object.entries(data.bookmarks).forEach(([k, v]) => {
                    elements.push(new BookmarkCacheData(v.book_id, v.book_name));
                });
    
                setBookmarkEntries(v => elements);
            }
        });        
    }

    const onPlaylistNameSubmit = async (text) => {
        setPlaylistNameEntry([])

        var resp = await createPlaylist(text);
        if (resp.success) {
            await setPlaylistsAndBookmarks();
        }
    }

    const searchCallback = (text) => {
        getMultiSearch(text).then((data) => {
            window.history.replaceState(null, "New Page Title", `/search/${text}`);

            if (data) {
                setCurrentDisplay(<MultiSearchDisplay key={text} searchText={text} searchData={data}/>);
            }
        });

        
    }

    const playTrackCallback = (id, progress=0) => {
        // console.log("??");
        setCurrentPlayer(<TrackPlayer key={(id + 1) * (progress + 1) * (progress + 5)} trackId={id} progress={progress} />)
    }

    const handleContextMenuCreationCallback = (data, position) => {
        setContextMenu(<ContextMenu key={position.x * position.y * position.y} data={data} menuPosition={position}/>);
    }

    refreshPlaylistsAndBookmarks = () => {
        setPlaylistsAndBookmarks();
    }

    createContextMenu = (data, position) => {
        setContextMenu(<ContextMenu key={position.x * position.y * position.y} data={data} menuPosition={position}/>);
    }

    getCachedPlaylists = () => { return playlistEntries; };
    getCachedBookmarks = () => { return bookmarkEntries; };

    setPlayTrackCallback(playTrackCallback);
    setBookDisplay = (bookId) => {
        setCurrentDisplay(<BookDisplay key={bookId} bookId={bookId}/>)
    }

    var queueShowing = false
    
    toggleQueue = () => {
        const queueDisplay = document.getElementById(styles.queueDisplay);

        if (queueShowing) {
            queueDisplay.style.display = "none";
        } else {
            queueDisplay.style.display = "flex";

            setQueueTracks(getQueue());
        }

        queueShowing = !queueShowing; 
    }

    setDisplay = (val) => {
        setCurrentDisplay(val);
    }

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
                    <ul id={styles.playlistList}>
                        <h2>Playlists</h2>
                        {playlistEntries.map((elem) => {
                            return (<PlaylistEntry 
                                key={elem.playlistName + elem.playlistTracks.length + elem.playlistId}
                                title={elem.playlistName}
                                numItems={elem.playlistTracks.length} playlistEntryId={elem.playlistId} />)
                        })}
                        <h2>Bookmarks</h2>
                        {bookmarkEntries.map((elem) => <BookmarkEntry cacheData={elem}/>)}
                    </ul>

                </div>
                <div className={styles.displaySection}>
                    {currentDisplay}
                </div>
                <div className={styles.audioPlayer}>
                    {currentPlayer}
                </div>
                <div id={styles.queueDisplay}>
                    <h1>Queue</h1>
                    <table className={styles.queueDisplayTable}>
                        <thead>
                            <tr className={styles.queueDisplayHeader}>
                                <th>#</th>
                                <th>Track Name</th>
                                <th>From</th>
                            </tr>
                            {queueTracks.map((elem, i) => {
                                return (
                                    <tr 
                                        onDoubleClick={() => {
                                            var newQueue = []

                                            for (var j = i; j < queueTracks.length; j++) {
                                                newQueue.push(queueTracks[j]);
                                            }

                                            setQueue(newQueue);
                                            setQueueTracks(getQueue());
                                        }}>
                                        <td>{i + 1}</td>
                                        <td>{elem.trackName}</td>
                                        <td>{elem.trackSource}</td>
                                    </tr>
                                )
                            })}
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    )
}