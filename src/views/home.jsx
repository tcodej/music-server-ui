import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/application';

import { browse, getMeta } from '../utils/api';
import { alphaGroup } from '../utils';
import Item from '../components/item';
import MetaData from '../components/metaData';
import Breadcrumbs from '../components/breadcrumbs';
import AlbumFolder from '../components/albumFolder';
import Player from '../components/player';
import Passcode from '../components/passcode';

export default function Browser() {
	const params = useParams();
	const { appState, appAction } = useAppContext();

	const [authenticated, setAuthenticated] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [artists, setArtists] = useState();
	const [artistGroups, setArtistGroups] = useState();
	const [list, setList] = useState();
	const [prevList, setPrevList] = useState();
	const [meta, setMeta] = useState();
	const [playerMeta, setPlayerMeta] = useState();
	const [filter, setFilter] = useState('');

	useEffect(() => {
		if (!authenticated) {
			if (sessionStorage.getItem('authenticated')) {
				setAuthenticated(true);
			}
		}
	}, [authenticated]);

	useEffect(() => {
		if (!authenticated) {
			return;
		}

		if (!loaded) {
			browse().then((response) => {
				setLoaded(true);
				setArtists(response.folders);
				setArtistGroups(alphaGroup(response.folders));
			});
		}

		const urlPath = params['*'];

		if (urlPath) {
			loadArtist(urlPath);

		} else {
			setList();
		}
	}, [authenticated, loaded, params]);

	const loadArtist = (path) => {
		setMeta();
		setPlayerMeta();
		setPrevList();
		setList();

		// below desktop, close sidebar after choosing artist
		if (window.innerWidth < 700) {
			appAction.toggleMenu(false);
		}

		browse(path).then((response) => {
			setList(response);
		});
	}

	const loadList = (path, skipList) => {
		if (!skipList && list) {
			setPrevList(list);
		}

		browse(path).then((response) => {
			appAction.toggleMenu(false);
			setList(response);

			if (response.meta) {
				setMeta(response.meta);
			}
		});
	}

	const sideToggle = () => {
		appAction.toggleMenu();
	}

	const playAudio = (path) => {
		getMeta(path).then((response) => {
			setPlayerMeta(response);
		});
	}

	const doFilter = (e) => {
		const q = e.currentTarget.value.toLowerCase();
		setFilter(q);

		let results = [];

		artists.forEach((item) => {
			if (item.toLowerCase().indexOf(q) > -1) {
				results.push(item);
			}
		});

		setArtistGroups(alphaGroup(results));
	}

	const closePlayer = () => {
		setPlayerMeta();
	}

	const unlock = () => {
		setAuthenticated(true);
	}

	return (
		<div id="page-home">

		{ !authenticated ?

			<Passcode onUnlock={unlock} />

		:

			<Fragment>
				<div id="side-panel" className={appState.menuOpen ? 'is-open' : ''}>

					{ artistGroups &&
						<Fragment>
							<div id="artist-filter">
								<input type="text" value={filter} onChange={doFilter} placeholder="Find in Artists" />
							</div>
							<div id="artist-list">
								{
									artistGroups.map((group) => {
										return (
											<div className="artist-group" key={group.letter}>
												<h4>{group.letter}</h4>
												<ul>
													{
														group.items.map((item) => {
															return <li key={item} onClick={() => { loadArtist(item) }}>{item}</li>
														})
													}
												</ul>
											</div>
										)
									})
								}
							</div>
						</Fragment>
					}

				</div>

				<div id="main-panel" className={appState.menuOpen ? 'is-open' : ''}>
				{ (list && list.path) &&
					<Breadcrumbs path={list.path} />
				}

				{ meta &&
					<MetaData data={meta} />
				}

				{ (list && list.folders) &&
					<div className="flex">
						{ list.folders.map((item) => {
							return <AlbumFolder key={item} item={item} parent={list.path} onClick={() => { loadList(list.path +'/'+ item) }} />
						})}
					</div>
				}

				{ (list && list.files) &&
					<ul>
						{ list.files.map((item) => {
							return <li key={item} onClick={() => { playAudio(list.path +'/'+ item) }}><Item item={item} type="mp3" /></li>
						})}
					</ul>
				}

				{ (prevList && prevList.folders) &&
					<div id="more-from">
						<h3>More from this artist</h3>
						<div className="flex">
							{ prevList.folders.map((item) => {
								return <AlbumFolder key={item} item={item} parent={prevList.path} onClick={() => { loadList(prevList.path +'/'+ item, true) }} />
							})}
						</div>
					</div>
				}

				{ playerMeta &&
					<Player data={playerMeta} onClose={closePlayer} />
				}
				</div>
			</Fragment>
		}
		</div>
	);
}
