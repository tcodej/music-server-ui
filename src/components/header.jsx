import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/application';

export default function Header() {
	const { appState, appAction } = useAppContext();

	const toggleMenu = () => {
		appAction.toggleMenu();
	}

	return (
		<header>
			<div className={'btn-menu'+ (appState.menuOpen ? ' is-active' : '')} onClick={toggleMenu}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<h1><Link to={`/${appState.header}`}>{appState.header}</Link></h1>
		</header>
	);
}
