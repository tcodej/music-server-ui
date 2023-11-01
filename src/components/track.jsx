import { useAppContext } from '../contexts/application';

export default function Track({ num, total, item }) {
	const { appState } = useAppContext();

	// return a zero-padded track number
	const getNum = () => {
		return num.toString().padStart(total.toString().length, '0');
	}

	// return song title based on filename i.e. 03 - The Song Name (remix).mp3
	const getTitle = () => {
		// drop the track number
		let parts = item.split(/^\d{1,4} - /);
		if (parts.length > 1) {
			parts.shift();
		}

		let base = parts.join('');
		let title = base.substring(0, base.lastIndexOf('.'));

		return title;
	}

	const isCurrent = () => {
		// could return a false positive if another track exists with the exact same number+name
		if (appState.currentTrack.indexOf(item) > -1) {
			return ' is-current';
		}

		return '';
	}

	return (
		<div className={`track${isCurrent()}`}><span className="num">{getNum()}.</span> {getTitle()}</div>
	);
}
