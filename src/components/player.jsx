import { Fragment, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../contexts/application';
import { useSwipeable } from 'react-swipeable';
import { getMeta } from '../utils/api';
import { formatTime } from '../utils';
import Cover from './cover';

export default function Player({ playlist }) {
	const { appState, updateAppState } = useAppContext();
	const [ listenersAdded, setListenersAdded ] = useState(false);
	const [ song, setSong ] = useState(false);
	const [ state, setState ] = useState({
		playing: false,
		duration: 0,
		currentTime: 0,
		percent: 0
	});

	const player = useRef(null);

	const updateState = (newVals) => {
		setState((prevVals) => {
			return ({
				...prevVals,
				...newVals
			})
		});
	}

	const updateIndex = (newIndex) => {
		if (newIndex < 0 || newIndex > playlist.songs.length - 1) {
			return
		}

		playlist.index = newIndex;
		playAudio(playlist.path +'/'+ playlist.songs[playlist.index]);
	}

	const swipeHandlers = useSwipeable({
		trackMouse: true,

		onSwipedDown: () => {
			updateAppState({ playerState: 'min' });
		},

		onSwipedUp: () => {
			updateAppState({ playerState: 'open' });
		}
	});

	const play = () => {
		player.current.play();
		updateState({ playing: true });
	}

	const stop = () => {
		player.current.pause();
		updateState({ playing: false });
	}

	const togglePlay = () => {
		if (state.playing) {
			stop();

		} else {
			play();
		}
	}

	const handlePlay = () => {
		// temporary
		// player.current.volume = 0.1;
	}

	const handleCanPlay = () => {
		// because autoplay is enabled
		updateState({ playing: true });
	}

	const handleDurationChange = () => {
		const playerDuration = parseInt(getDuration(), 10);

		updateState({
			duration: formatTime(playerDuration)
		});
	}

	const handleTimeUpdate = () => {
		if (!player.current) {
			return;
		}

		updateState({
			currentTime: formatTime(player.current.currentTime)
		});

		updateProgress();
	}

	const updateProgress = (value) => {
		if (Array.isArray(value)) {
			value = value[0];
		}

		if (player.current.seeking) {
			return;
		}

		let progress = player.current.currentTime;

		if (value) {
			progress = value;
			player.current.currentTime = progress;
		}

		let percent = (player.current.currentTime / player.current.duration) * 100;

		if (isNaN(percent)) {
			percent = 0;
		}

		updateState({
			percent: percent
		});
	}

	const handleEnded = () => {
		console.log('ended', playlist.index);
		nextTrack();
	}

	const nextTrack = () => {
		console.log('next track');
		updateIndex(playlist.index + 1);
	}

	const prevTrack = () => {
		console.log('prev track');
		updateIndex(playlist.index - 1);
	}

	const getDuration = () => {
		if (isNaN(player.current.duration)) {
			return 0;
		}

		return player.current.duration;
	}

	const getArtwork = (size) => {
		return {
			src: song.image,
			sizes: `${size}x${size}`,
			type: 'image/jpeg'
		}
	}

	const playAudio = (path) => {
		getMeta(path).then((response) => {
			setSong(response);
			updateAppState({ currentTrack: response.mp3 });
			console.log('song', path);
		});
	}

	const seek = () => {
		//
	}

	useEffect(() => {
		// console.log('playlist', playlist);
		if (playlist.songs[playlist.index]) {
			playAudio(playlist.path +'/'+ playlist.songs[playlist.index]);
		}
	}, [playlist]);

	useEffect(() => {
		if (song) {
			if (!song.mp3) {
				return;
			}

			if (!song.image) {
				song.image = '/img/mp3.svg';
			}

			if (!listenersAdded) {
				setListenersAdded(true);
				player.current.addEventListener('play', handlePlay);
				player.current.addEventListener('canplay', handleCanPlay);
				player.current.addEventListener('durationchange', handleDurationChange);
				player.current.addEventListener('timeupdate', handleTimeUpdate);
				player.current.addEventListener('ended', handleEnded);
			}

			if ('mediaSession' in navigator) {
				const metaData = {
					title: song.title,
					artist: song.artist,
					album: song.album,
					// artwork: [{
					//     src: song.image,
					//     sizes: '256x256',
					//     type: 'image/jpg'
					// }],
					artwork: [
						getArtwork(96),
						getArtwork(128),
						getArtwork(192),
						getArtwork(256),
						getArtwork(384),
						getArtwork(512)
					]
				};

				navigator.mediaSession.metadata = new MediaMetadata(metaData);

				navigator.mediaSession.setActionHandler('play', () => {
					play();
				});
 
				navigator.mediaSession.setActionHandler('pause', () => {
					stop();
				});
 
				navigator.mediaSession.setActionHandler('stop', () => {
					stop();
				});
 
				navigator.mediaSession.setActionHandler('previoustrack', () => {
					prevTrack();
				});

				navigator.mediaSession.setActionHandler('nexttrack', () => {
					nextTrack();
				});

				navigator.mediaSession.setActionHandler('seekto', (e) => {
					seek(e.seekTime);
				});
			}
		}
	// eslint-disable-next-line
 	}, [song]);

	return (
		<div id="player-panel" className={appState.playerState} {...swipeHandlers}>
			{ song &&
				<Fragment>
					<div className="song-info" onClick={() => updateAppState({ playerState: 'open' })}>
						<Cover meta={song} />
						{ song.title &&	<div className="title">{song.title}</div> }
						{ song.artist && <div className="artist">{song.artist}</div> }
					</div>
					<div className="time">
						<div className="progress">
							<div className="bar" style={{ width: `${state.percent}%` }}></div>
						</div>
						<div className="minutes">
							<div className="current">{state.currentTime}</div>
							<div className="duration">{state.duration}</div>
						</div>
					</div>
					<div className="controls">
						<button type="button" className="prev" onClick={prevTrack}>Prev</button>
						<button type="button" className={ 'playpause'+ (state.playing ? ' is-playing' : '') } onClick={togglePlay}>Play</button>
						<button type="button" className="next" onClick={nextTrack}>Next</button>
					</div>
				</Fragment>
			}

			<audio src={song.mp3} ref={player} autoPlay />
		</div>
	);
}
