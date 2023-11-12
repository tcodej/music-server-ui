import { Fragment, useState, useEffect } from 'react';
import Cover from './cover';

export default function Album({ item, onClick, showArtist }) {

	if (item.isFolder) {
		// check for folder format YYYY - Album Title
		const [full, first, second] = item.path.split(/(^[12]\d{3}) - /);

		if (full) {
			item.album = full;
		}

		if (first) {
			item.year = first;
		}

		if (second) {
			item.album = second;
		}
	}

	return (
		<div className="album" onClick={onClick}>
			<Cover meta={item} />
			<div className="title">{item.album}</div>
			{showArtist && 
				<div className="artist">{item.artist}</div>
			}
			{item.year &&
				<div className="year">{item.year}</div>
			}
		</div>
	)
}
