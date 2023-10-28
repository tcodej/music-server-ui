import { useAppContext } from '../contexts/application';
import { useSwipeable } from 'react-swipeable';

export default function Player({ data, onClose }) {
	if (data && !data.image) {
		data.image = '/img/mp3.svg';
	}

	const { appState, updateAppState } = useAppContext();

	const swipeHandlers = useSwipeable({
		onSwipedDown: (e) => {
			updateAppState({ playerState: 'min' });
		},

		onSwipedUp: (e) => {
			updateAppState({ playerState: 'open' });
		}
	});

	return (
		<div id="player-panel" className={appState.playerState} {...swipeHandlers}>
			<button className="btn-close" onClick={onClose}>X</button>

				<div className="song-info">
					<img src={data.image} alt={data.title} className="cover" />
					{ data.title &&	<div className="title">{data.title}</div> }
					{ data.artist && <div className="artist">{data.artist}</div> }
				</div>
				<div className="controls">
					<button type="button" className="prev">RR</button>
					<button type="button" className="playpause">P</button>
					<button type="button" className="next">FF</button>
				</div>

			{ data.mp3 && 
				<audio src={data.mp3} controls autoPlay />
			}
		</div>
	);
}
