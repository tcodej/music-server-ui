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
			{ appState.playerState !== 'min' &&
				<img src={data.image} alt={data.title} className="cover" />
			}

			{ data.title &&
				<div>{data.title}</div>
			}
			{ data.artist &&
				<div>{data.artist}</div>
			}

			{ data.mp3 && 
				<audio src={data.mp3} controls autoPlay />
			}
		</div>
	);
}
