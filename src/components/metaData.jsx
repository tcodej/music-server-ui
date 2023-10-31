import { Fragment, useEffect, useState } from 'react';
import { useAppContext } from '../contexts/application';
import Cover from './cover';

export default function MetaData({ data }) {
	const { updateAppState } = useAppContext();
	const [ meta, setMeta ] = useState();

	useEffect(() => {
		if (data) {
			// if (!data.image) {
			// 	data.image = '/img/mp3.svg';
			// }

			if (data.artist) {
				updateAppState({ header: data.artist });
			}

			setMeta(data);
		}
	// eslint-disable-next-line
	}, [data]);

	return (
		<Fragment>
			{ meta &&
				<div id="artist-album">
					<Cover meta={meta} />

					<div className="meta">
						{ meta.artist &&
							<div>{meta.artist}</div>
						}
						{ meta.album &&
							<div>{meta.album}</div>
						}
						{ meta.year &&
							<div>{meta.year}</div>
						}
						{ meta.genre &&
							<div>{meta.genre.join('/')}</div>
						}
					</div>
				</div>
			}
		</Fragment>
	);
}
