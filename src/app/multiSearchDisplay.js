import { useEffect, useState } from "react";
import style from "./multiSearchDisplay.module.css"
import BookEntryDisplay from "./bookEntryDisplay";
import { createBookmark, getBookmarks, removeBookmark } from "./global";
import { createContextMenu, getCachedBookmarks, refreshPlaylistsAndBookmarks, setBookDisplay } from "@/pages/[...app]";

export function getTimeText(length) {
    var hou = Math.floor(length / 3600) ;
    var min = Math.floor(length / 60);
    var sec = Math.trunc(length % 60);
    
    var secText = sec > 10 ?  sec + "" : "0" + sec
    if (hou >= 0) {
        console.log(min)
        return min + ":" + secText 
    }
    return hou + ":" + min + ":" + sec
}
export default function MultiSearchDisplay(props) {
    const [bookSearchResults, setBookSearchResults] = useState([]);

    useEffect(() => {
        console.log(props);

        const searchResultsBooks = document.getElementById(style.searchResultsBooks);
        const searchResultHeader = document.getElementById(style.searchResultsText);
        
        if (props.searchText == "") {
            searchResultHeader.textContent = "Entire Selection"
        } else {
            searchResultHeader.textContent = "Search Results for:" + props.searchText;
        }
        if (props.searchData != null) {
            const searchData = props.searchData;

            Object.entries(searchData.books).forEach(([k, v]) => {
                v["id"] = k;
                setBookSearchResults(e => [...e, v])                

            });
        }
    }, []);

    console.log("Multi search Loaded");

    return (
        <>
            <div className={style.multiSearchBackground}>
                <h1 id={style.searchResultsText}></h1>
                <table id={style.searchResultsBooks}>
                    <thead>
                        <tr className={style.tableHeader}>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Chapters</th>
                            <th>Tags</th>
                            <th>Time</th>
                        </tr>
                        {bookSearchResults.map(obj => {

                            var totalLength = 0.0;
                            
                            obj.chapters.forEach(chapter => {
                                totalLength += chapter.chapter_length;
                            });
                            
                            return (
                            <tr 
                            onDoubleClick={() => {
                                setBookDisplay(obj.id);
                            }}

                            onContextMenu={(ev) => {
                                ev.preventDefault();
                                var bookmarks = getCachedBookmarks();
                                console.log(bookmarks);
                                const createCallback = () => { createBookmark(obj.id).then(refreshPlaylistsAndBookmarks); };
                                const removeCallback = () => { removeBookmark(obj.id).then(refreshPlaylistsAndBookmarks); };

                                var buttonText = "Bookmark";
                                var buttonCallback = createCallback;

                                for (var i = 0; i < bookmarks.length; i++) {
                                    if (bookmarks[i].bookId == obj.id) {
                                        buttonText += " ✓";
                                        buttonCallback = removeCallback;
                                    }
                                }
                                bookmarks.forEach(elem => {
                                    if (elem.bookId == obj.id) {}
                                })
                                createContextMenu([
                                    {
                                        "type": "button",
                                        "text": buttonText,
                                        "callback": buttonCallback
                                    }
                                ], {x: ev.clientX, y: ev.clientY});
                            }}>

                                <td>{obj.id}</td>
                                <td>{obj.title}</td>
                                <td>{obj.chapters.length}</td>
                                <td>[{obj.tags}]</td>
                                <td>{getTimeText(totalLength)}</td>
                            </tr>
                            )
                        })}
                    </thead>
                    
                </table>
                <ul id={style.searchResultsTracks}></ul>

            </div>
        </>
    )
}