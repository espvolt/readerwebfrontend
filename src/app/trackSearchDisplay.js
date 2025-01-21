import {TrackEntry, TrackEntryHeader} from "./trackEntry";
import style from "./trackSearchDisplay.module.css"
import { useEffect, useState } from "react"

export default function TrackSearchDisplay(props) {
    const [trackEntries, setTrackEntries] = useState([]);
    useEffect(() => {
        var searchText = document.getElementById(style.searchText);

        if (props.searchText != null) searchText.textContent = "Search Results for: " + props.searchText;
        var res = [];

        Object.entries(props.searchInfo).forEach(([k, v]) => {
            res.push(<TrackEntry key={k} displayName={v.display_name} length={v.length} tags={v.tags} trackId={k}/>)
        });

        setTrackEntries(v => [<TrackEntryHeader />, ...res]);
    }, []);

    return (
        <>
            <div className={style.trackDisplayBackground}>
                <h2 id={style.searchText}></h2>
                <ul id={style.entries}></ul>
                    {trackEntries.map((elem) => elem)}
            </div>
        </>
    )
}