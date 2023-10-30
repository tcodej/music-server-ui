import { Fragment, useEffect, useState } from 'react';
import { useAppContext } from '../contexts/application';
import Cover from './cover';

export default function MetaData({ data }) {
	const { updateAppState } = useAppContext();
	const [ meta, setMeta ] = useState();

	useEffect(() => {
		if (data) {
			console.log(data);
			if (!data.image) {
				data.image = '/img/mp3.svg';
			}

			if (data.artist) {
				updateAppState({ header: data.artist });
			}

			setMeta(data);
		}
	}, [data]);


	return (
		<Fragment>
			{ meta &&
				<div className="flex">
					<div className="third">
						<Cover meta={meta} />
					</div>
					<div className="two-thirds">

					{ meta.artist &&
						<div>Artist: {meta.artist}</div>
					}
					{ meta.album &&
						<div>Album: {meta.album}</div>
					}
					{ meta.year &&
						<div>Released: {meta.year}</div>
					}
					{ meta.track &&
						<div>Track No.: {meta.track.no}</div>
					}
					{ meta.genre &&
						<div>Genre: {meta.genre[0]}</div>
					}
					</div>
				</div>
			}
		</Fragment>
	);
}
