import { useState, useEffect } from 'react';
import square from '../assets/img/transparent-square.png';
import folderIcon from '../assets/img/icon-folder.svg';
import mp3Icon from '../assets/img/icon-mp3.svg';
import Loading from './loading';

export default function Cover({ meta }) {
	const [data, setData] = useState({
		image: '',
		alt: 'Loading...',
		className: ' small'
	});

	useEffect(() => {
		let image = '';
		let className = '';

		if (meta) {
			if (meta.image) {
				image = meta.image;

			} else {
				className = ' small';

				if (meta.mp3) {
					image = mp3Icon;

				} else {
					image = folderIcon;
				}
			}

			const alt = meta.album ? meta.album : 'Album Cover';

			setData({
				image: image,
				alt: alt,
				className: className
			});
		}
	}, [meta]);

	return (
		<div className={`cover${data.className}`} style={{ backgroundImage: `url(${data.image})` }}>
			<img src={square} alt={data.alt} draggable="false" />

			{ !data.image &&
				<Loading />
			}
		</div>
	)
}
