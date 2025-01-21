import style from "./playlistEntry.module.css"
import { deletePlaylist } from "./global";
import { createContextMenu } from "@/pages/index";
import { refreshPlaylists } from "@/pages";

export default function PlaylistEntry(props) {
    // console.log("ENTRY PORPS", props);
    const deleteCallback = () => {
        deletePlaylist(props.playlistEntryId).then(
            refreshPlaylists
        );
    }
    const onContextMenuAttempted = (ev) => {
        ev.preventDefault();
        createContextMenu([
            {
                "type": "button",
                "text": "Delete",
                "callback": deleteCallback
            }
        ], {x: ev.clientX, y: ev.clientY});
    }
    return (
        <div className={style.playlistEntryBackground} playlistentryid={props.playlistEntryId} onContextMenu={onContextMenuAttempted}>
            <div>
                <h1 className={style.playlistTitle}>{props.title}</h1>
                <p className={style.playlistCount}>{props.numItems} items</p>
            </div>
        </div>
    )
}