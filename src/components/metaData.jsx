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
	// eslint-disable-next-line
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
