import style from "./playlistNameEntry.module.css"
export default function PlaylistNameEntry(props) {
    var onSubmit = (ev) => {
        ev.preventDefault();
        console.log("HERE");
        // var inputText = document.getElementById("playlistInput");

        var form = ev.target;
        var formData = new FormData(form);

        if (props.onSubmitted) {
            props.onSubmitted(Object.fromEntries(formData)["playlistName"]);
        }
    }
    return (
        <>
            <div className={style.background}>
                <form onSubmit={onSubmit}>
                    <input type="text" id="playlistInput" name="playlistName"></input>
                    <input type="submit" className={style.bruh} />

                </form>
            </div>
        </>
    )
}