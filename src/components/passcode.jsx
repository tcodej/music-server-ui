import { useState } from 'react';

export default function Passcode({ onUnlock }) {
	const [entered, setEntered] = useState('');
	const [failed, setFailed] = useState(false);
	const code = import.meta.env.VITE_PASSCODE;

	const press = (num) => {
		setEntered((prev) => {
			let test = prev + num;

			// later make this an api call, for now secure enough for me!	
			if (test === code) {
				unlock();

			} else if (test.length >= code.length) {
				fail();
			}

			return test;
		});
	}

	const fail = () => {
		setFailed(true);
		setTimeout(() => {
			setEntered('');
			setFailed(false);
		}, 750);
	}

	const unlock = () => {
		console.log('unlock...');
		sessionStorage.setItem('authenticated', true);
		setTimeout(onUnlock, 500);
	}

	const dot = () => {
		return <div className="dot">&bull;</div>
	}

	return (
		<div id="passcode">
			<div className={'panel'+ (failed ? ' wiggle' : '')}>
				<div className={'dots'}>
				{ entered.split('').map((x, i) => {
					return <div key={i}>{dot()}</div>
				})}
				</div>
				<div className="buttons">
				{
					['1','2','3','4','5','6','7','8','9','0'].map((num) => {
						return <button key={num} onClick={() => press(num)} type="button">{num}</button>
					})
				}
				</div>
			</div>
		</div>
	);
}
