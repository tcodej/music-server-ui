import { Fragment } from 'react';
import { getTitle } from '../utils';

export default function Item({ item, type }) {
	return (
		<Fragment>
			{ type === 'folder' &&
				<div className="item folder">{item}</div>
			}

			{ type === 'mp3' &&
				<div className="item mp3">{getTitle(item)}</div>
			}
		</Fragment>
	);
}
