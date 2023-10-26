import { Fragment, useState, useEffect } from 'react';
import { getFolderMeta } from '../utils/api';

export default function AlbumFolder({ item, parent, onClick }) {

	const [meta, setMeta] = useState();

	// check for folder format YYYY - Album Title
	const [full, first, second] = item.split(/([12]\d{3}) - /);

	useEffect(() => {
		if (!meta) {
			getFolderMeta(parent +'/'+ item).then((response) => {
				setMeta(response);
			});
		}
	}, [meta, item, parent]);

	const getImage = () => {
		if (meta && meta.image) {
			return <img src={meta.image} alt="" />
		}

		return <img src="/img/folder.svg" alt="" />
	};

	return (
		<div className="album" onClick={onClick}>
			{ full &&
				<Fragment>
					{ getImage() }
					<div>{full}</div>
				</Fragment>
			}

			{ (first && second) &&
				<Fragment>
					{ getImage() }
					<div>{second}<br />{first}</div>
				</Fragment>
			}
		</div>
	)
}
