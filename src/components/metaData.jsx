import Cover from './cover';

export default function MetaData({ data }) {
	if (data && !data.image) {
		data.image = '/img/mp3.svg';
	}

	return (
		<div className="flex">
			<div className="third">
				<Cover meta={data} />
			</div>
			<div className="two-thirds">
			{ data.title &&
				<div>Song: {data.title}</div>
			}
			{ data.artist &&
				<div>Artist: {data.artist}</div>
			}
			{ data.album &&
				<div>Album: {data.album}</div>
			}
			{ data.year &&
				<div>Released: {data.year}</div>
			}
			{ data.track &&
				<div>Track No.: {data.track.no}</div>
			}
			{ data.genre &&
				<div>Genre: {data.genre[0]}</div>
			}
			</div>
		</div>
	);
}
