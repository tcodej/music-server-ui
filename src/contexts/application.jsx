import { useState, createContext, useContext, useRef } from 'react';

const ApplicationContext = createContext(null);

const ApplicationProvider = ({ children }) => {
    const defaultState = {
        menuOpen: true,
        playerState: null // open|min|null
    };

    const [ appState, setAppState ] = useState(defaultState);

    const appAction = {};

    // bool true/open, false/closed. optional.
    appAction.toggleMenu = (bool) => {
        let newState = !appState.menuOpen;

        if (bool === true || bool === false) {
            newState = bool;
        }

        updateAppState({ menuOpen: newState });
    }

    const reset = () => {
        setAppState(defaultState);
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
