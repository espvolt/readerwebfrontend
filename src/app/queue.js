import { currentTrack, playTrack, triggerPlayTrack } from "./global";
export var currentQueue = [];

export function getQueue() {
    return currentQueue;
}

export function setQueue(tracks, autoPlay=true, trackProgress=0.0) {
    currentQueue = tracks

    if (autoPlay) {
        playNextTrack(trackProgress);
    }
}

export function playNextTrack(progress=0.0) {
    if (currentQueue.length > 0) {
        var queueObj = currentQueue[0];
        currentQueue.splice(0, 1);
        triggerPlayTrack(queueObj.trackId, progress);
    }
}

