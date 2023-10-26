export default function Player({ data, onClose }) {
	if (data && !data.image) {
		data.image = '/img/mp3.svg';
	}

	return (
		<div id="player">
			<button className="btn-close" onClick={onClose}>X</button>
			<img src={data.image} alt={data.title} className="cover" />
			{ data.title &&
				<div>{data.title}</div>
			}
			{ data.artist &&
				<div>{data.artist}</div>
			}

			{ data.mp3 && 
				<audio src={data.mp3} controls />
			}
		</div>
	);
}
