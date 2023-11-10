import { Fragment, useState, useEffect } from 'react';
import Cover from './cover';

export default function Album({ item, onClick }) {

	return (
		<div className="album" onClick={onClick}>
			<Cover meta={item} />
			<div className="title">{item.album}<br />{item.artist}<br />{item.year}</div>
		</div>
	)
}
