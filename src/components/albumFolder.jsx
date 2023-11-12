import { Fragment, useState, useEffect } from 'react';
import { getFolderMeta } from '../utils/api';
import Cover from './cover';

export default function AlbumFolder({ item, parent, onClick }) {

	const [meta, setMeta] = useState();

	// check for folder format YYYY - Album Title
	const [full, first, second] = item.split(/(^[12]\d{3}) - /);

	useEffect(() => {
		if (!meta) {
			getFolderMeta([parent, item].join('/')).then((response) => {
				setMeta(response);
			});
		}
	}, [meta, item, parent]);

	return (
		<div className="album" onClick={onClick}>
			{ full &&
				<Fragment>
					<Cover meta={meta} />
					<div className="title">{full}</div>
				</Fragment>
			}

			{ (first && second) &&
				<Fragment>
					<Cover meta={meta} />
					<div className="title">{second}<br />{first}</div>
				</Fragment>
			}
		</div>
	)
}
