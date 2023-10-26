import { Fragment } from 'react';

export default function Item({ item, type }) {
	return (
		<Fragment>
			{ type === 'folder' &&
				<div className="item folder">{item}</div>
			}

			{ type === 'mp3' &&
				<div className="item mp3">{item}</div>
			}
		</Fragment>
	);
}
