import { useState, createContext, useContext, useRef } from 'react';

const ApplicationContext = createContext(null);

const ApplicationProvider = ({ children }) => {
    const defaultState = {
        menuOpen: true,
        song: null,
        playing: false,
        progress: 0,
        arrayBuffer: null,
        seekTo: 0
    };

    const defaultPlayList = {
        songs: [],
        index: 0
    }

    const [ appState, setAppState ] = useState(defaultState);
    const playList = useRef(defaultPlayList);

    const appAction = {};

    // bool true/open, false/closed. optional.
    appAction.toggleMenu = (bool) => {
        let newState = !appState.menuOpen;

        if (bool === true || bool === false) {
            newState = bool;
        }

        updateAppState({ menuOpen: newState });
    }

    appAction.play = (song) => {
        if (appAction.isCurrentSong(song.id)) {
            appAction.togglePlay();

        } else {
            reset();
            updateAppState({ song: song });
        }
    }

    appAction.progress = (progress) => {
        updateAppState({ progress: progress });
    }

    appAction.togglePlay = () => {
        console.log('togglePlay');
        updateAppState({
            playing: !appState.playing
        });
    }

    appAction.isCurrentSong = (id) => {
        if (appState.song && appState.song.id === id) {
            return true;
        }

        return false;
    }

    appAction.setBuffer = (arrayBuffer) => {
        updateAppState({
            arrayBuffer: arrayBuffer
        });
    }

    appAction.setPlayList = (data) => {
        console.log('setting playList', data);
        updateAppState({
            song: data.songs[data.index]
        });

        playList.current = {
            songs: data.songs,
            index: data.index
        };
    }

    appAction.playListNext = (dir) => {
        console.log('playListNext', playList.current);
        if (!playList.current) {
            return;
        }

        if (!dir) {
            dir = 1;
        }

        playList.current.index += dir;

        if (playList.current.index < playList.current.songs.length && playList.current.index > -1) {
            updateAppState({
                song: playList.current.songs[playList.current.index]
            });

        } else {
            reset();
        }
    }

    appAction.getPlayList = () => {
        return playList.current;
    }

    const reset = () => {
        setAppState(defaultState);
        playList.current = defaultPlayList;
    }

    const updateAppState = (newVals) => {
        setAppState(prevVals => {
            return {
                ...prevVals,
                ...newVals
            };
        });
    }

    return (
        <ApplicationContext.Provider value={{appState, appAction, updateAppState}}>
            {children}
        </ApplicationContext.Provider>
    );
};

const useAppContext = () => useContext(ApplicationContext);

export { ApplicationContext, ApplicationProvider, useAppContext };
