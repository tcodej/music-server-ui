import { Fragment, useEffect, useState } from 'react';
import { useAppContext } from '../contexts/application';
import Cover from './cover';

export default function MetaData({ data }) {
	const { updateAppState } = useAppContext();
	const [ meta, setMeta ] = useState();

	useEffect(() => {
		if (data) {
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
						{ meta.album &&
							<div className="album-name">{meta.album}</div>
						}
						{ meta.artist &&
							<div className="artist-name">{meta.artist}</div>
						}
						{ meta.year && meta.genre ? (
							<div className="small">{meta.genre.join('/')} - {meta.year}</div>

						) : (
							<Fragment>
								{ meta.year &&
									<div className="small">{meta.year}</div>
								}
								{ meta.genre &&
									<div className="small">{meta.genre.join('/')}</div>
								}
							</Fragment>
						)}
					</div>
				</div>
			}
		</Fragment>
	);
}
