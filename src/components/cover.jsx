import { Fragment, useState, useEffect } from 'react';
import square from '../assets/img/transparent-square.png';

export default function Cover({ meta }) {

	const [data, setData] = useState({
		image: '/img/folder.svg',
		alt: 'Loading...'
	});

	useEffect(() => {
		if (meta) {
			const image = meta.image ? meta.image : '/img/folder.svg';
			const alt = meta.album ? meta.album : 'Album Cover';

			setData({
				image: image,
				alt: alt
			});
		}
	}, [meta]);

	return (
		<div className="cover" style={{ backgroundImage: `url(${data.image})` }}>
			<img src={square} alt={data.alt} draggable="false" />
		</div>
	)
}
