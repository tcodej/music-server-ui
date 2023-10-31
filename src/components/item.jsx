export default function Item({ num, total, item }) {
	// return a zero-padded track number
	const getNum = () => {
		return num.toString().padStart(total.toString().length, '0');
	}

	// return song title based on filename i.e. 03 - The Song Name (remix).mp3
	const getTitle = (fileName) => {
		// drop the track number
		let parts = fileName.split(/^\d{1,4} - /);
		if (parts.length > 1) {
			parts.shift();
		}

		let base = parts.join('');
		let title = base.substring(0, base.lastIndexOf('.'));

		return title;
	}

	return (
		<div className="item">{getNum()} - {getTitle(item)}</div>
	);
}
