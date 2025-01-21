import Cookies from "universal-cookie";

const sessionInfoProcessed = new Event("sessioninfoprocessed")

export var SERVER_IP = "http://127.0.0.1:8000";
export var session_id = -1;
export var session_username = "";
export var sessionDisplayName = "";

export var playTrack = null;
export var currentTrack = -1;
export var trackFinished = null;

export function setPlayTrackCallback(val) {
    playTrack = val;
}

export function triggerPlayTrack(id) {
    if (playTrack != null) {
        playTrack(id);
        currentTrack = id;
    }
}
export const cookies = new Cookies(null, {lastLogin: "", lastUsername: ""});

export function setSessionId(id) {
    session_id = id;
}

export function getCurrentTrackId() {
    return currentTrack;
}

export function getSessionId() {
    return session_id;
}

export function getUsername() {
    return session_username;
}

export function getDisplayName() {
    return sessionDisplayName;
}

export const ajax = async (config) => { // LOL
    const request = await fetch(config.url, {
        method: config.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config.payload)
    });
    var response = await request;
    // console.log('response', response)
    return response
}

export function process_session_info(info) {
    session_id = info["session_id"];
    // console.log("PROCESS", info);
    session_username = info["user"];
    sessionDisplayName = info["display_name"];
    cookies.set("lastLogin", info["last_login"]);
    cookies.set("lastUsername", info["user"]);
    document.dispatchEvent(sessionInfoProcessed);
}

export async function _fetch(url, body={}, type="get") {
    if (type == "get") {
        return await fetch(url, {
            mode: "cors"
        })
    }

    return await fetch(url, {
        method: type,
        body: JSON.stringify(body),
        mode: "cors",
        headers: new Headers({
            'Content-Type': "application/json"
        })
    })
}

export async function checkLogin() {
    if (session_id == -1) {
        // console.log("HERE?");
        // console.log(cookies.get("lastUsername"));
        // console.log(cookies.get("lastLogin"));
        var username = cookies.get("lastUsername") === undefined ? "null" : cookies.get("lastUsername");
        var lastKey = cookies.get("lastLogin") === undefined ? "null" : cookies.get("lastLogin");

        var resp = await _fetch(SERVER_IP + "/reuselogin", {
            "username": username,
            "last_login_key": lastKey
        }, "post");

        var data = await resp.json();

        if (data == null) {
            return false;
        } else {
            // console.log(data);
            process_session_info(data);
            return true;
        }
    } else {
        var resp = await _fetch(SERVER_IP + `/issessionactive?session_id=${session_id}`, {})
        return data = (await resp.json())["status"]
    }
}

export async function getPlaylists(username="") {
    if (username == "") {
        username = session_username;
    }

    var resp = await _fetch(`${SERVER_IP}/getplaylists?username=${username}`);

    return await resp.json();
}

export async function createPlaylist(playlistName) {
    if (session_id == -1) {
        return {};
    }


    var resp = await _fetch(`${SERVER_IP}/createplaylist`, {
        "session_id": session_id,
        "username": session_username,
        "playlist_name": playlistName
    }, "post")
    
    return await resp.json();
}

export async function getPlaylist(id) {
    if (session_id == -1){ 
        return {}
    }

    var resp = await _fetch(`${SERVER_IP}/playlist?id=${id}`)
    return await resp.json();
}

export async function getTracks(searchContent="") {
    var resp = await _fetch(`${SERVER_IP}/get_selection?name_filter=${searchContent}`)

    return await resp.json()
}

export async function getTrackInformation(trackId) {
    var resp = await _fetch(`${SERVER_IP}/audioinformation?id=${trackId}`);
    return await resp.json();
}

export async function deletePlaylist(playlistId) {
    if (session_id == -1) {
        return null;
    }
    
    // console.log({
    //     "playlist_id": playlistId,
    //     "session_id": session_id,
    //     "username": session_username
    // });
    var resp = await _fetch(`${SERVER_IP}/deleteplaylist`, {
        "playlist_id": playlistId,
        "session_id": session_id,
        "username": session_username
    }, "post")

    return await resp.json();
}

export async function addTrackToPlaylist(playlistId, trackId) {
    if (session_id == -1) {
        return null;
    }

    var resp = await _fetch(`${SERVER_IP}/addtracktoplaylist`, {
        "playlist_id": playlistId,
        "track_id": trackId,
        "username": session_username,
        "session_id": session_id
    }, "post")

    return await resp.json();
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
    if (session_id == -1) {
        return null;
    }

    var resp = await _fetch(`${SERVER_IP}/removetrackfromplaylist`, {
        "playlist_id": playlistId,
        "track_id": trackId,
        "username": session_username,
        "session_id": session_id
    }, "post");
    
    return await resp.json();
}

export async function getVoiceOptions() {
    var resp = await _fetch(`${SERVER_IP}/getvoiceoptions`)

    return await resp.json();
}