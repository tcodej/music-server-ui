import { Fragment, useState, useEffect } from 'react';
import { getFolderMeta } from '../utils/api';
import Cover from './cover';

export default function AlbumFolder({ item, parent, onClick }) {

	const [meta, setMeta] = useState();

	// check for folder format YYYY - Album Title
	const [full, first, second] = item.split(/(^[12]\d{3}) - /);

	useEffect(() => {
		if (!meta) {
			getFolderMeta(parent +'/'+ item).then((response) => {
				setMeta(response);
			});
		}
	}, [meta, item, parent]);

	const getImage = () => {
		let image = (meta && meta.image) ? meta.image : '/img/folder.svg';

		return (
			<div className="cover" style={{ backgroundImage: `url(${image})` }}>
				<img src='/img/transparent-square.png' alt={item} draggable="false" />
			</div>
		)
	}

	return (
		<div className="album" onClick={onClick}>
			{ full &&
				<Fragment>
					<Cover meta={meta} />
					<div>{full}</div>
				</Fragment>
			}

			{ (first && second) &&
				<Fragment>
					<Cover meta={meta} />
					<div>{second}<br />{first}</div>
				</Fragment>
			}
		</div>
	)
}
