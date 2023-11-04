import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/application';
import { useSwipeable } from 'react-swipeable';

import { browse } from '../utils/api';
import { alphaGroup } from '../utils';
import Track from '../components/track';
import MetaData from '../components/metaData';
import Breadcrumbs from '../components/breadcrumbs';
import AlbumFolder from '../components/albumFolder';
import Player from '../components/player';
import ErrorMessage from '../components/errorMessage';

export default function Browser() {
	const params = useParams();
	const { appState, appAction, updateAppState } = useAppContext();

	const [loaded, setLoaded] = useState(false);
	const [artists, setArtists] = useState();
	const [artistGroups, setArtistGroups] = useState();
	const [list, setList] = useState();
	const [prevList, setPrevList] = useState();
	const [meta, setMeta] = useState();
	const [playlist, setPlaylist] = useState(false);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		if (!loaded) {
			browse().then((response) => {
				if (response && response.ok) {
					setLoaded(true);
					setArtists(response.folders);
					setArtistGroups(alphaGroup(response.folders));

				} else {
					updateAppState({ error: 'Sorry, there has been an error. Failed to load artists.'});
				}
			});
		}

		const urlPath = params['*'];

		if (urlPath) {
			loadArtist(urlPath);

		} else {
			reset();
			sideToggle(true);
		}
	// eslint-disable-next-line
	}, [loaded, params]);

	const reset = () => {
		setMeta();
		setPrevList();
		setList();
		updateAppState({ currentArtist: '', error: false });
	}

	const loadArtist = (path) => {
		reset();

		// below desktop breakpoint, close sidebar after choosing artist
		if (window.innerWidth < 700) {
			appAction.toggleMenu(false);
		}

		browse(path).then((response) => {
			if (response && response.ok) {
				setList(response);
				updateAppState({
					currentArtist: path
				});

			} else {
				updateAppState({ error: 'Sorry, there has been an error. Failed to load '+ path +'.'});
			}
		});
	}

	const loadList = (path, skipList) => {
		if (!skipList && list) {
			setPrevList(list);
		}

		browse(path).then((response) => {
			appAction.toggleMenu(false);

			if (response.ok) {
				setList(response);

			} else {
				setList();
			}

			const mainDiv = document.getElementById('main-panel');
			mainDiv.scrollTop = 0;

			if (response.meta) {
				setMeta(response.meta);

			} else {
				setMeta();
			}
		});
	}

	const sideToggle = (bool) => {
		appAction.toggleMenu(bool);
	}

	const loadPlaylist = (index) => {
		setPlaylist({ path: list.path, songs: list.files, index: index });
		updateAppState({ playerState: 'min' });
	}

	const doFilter = (e) => {
		const q = e.currentTarget.value.trimStart();
		setFilter(q);

		let results = [];

		artists.forEach((item) => {
			if (item.toLowerCase().indexOf(q.trim().toLowerCase()) > -1) {
				results.push(item);
			}
		});

		setArtistGroups(alphaGroup(results));
	}

	const clearFilter = () => {
		setFilter('');
		setArtistGroups(alphaGroup(artists));
		document.getElementById('field-filter').focus();
	}

	const swipeHandlers = useSwipeable({
		delta: 100,
		swipeDuration: 500,

		onSwipedLeft: () => {
			sideToggle(false);
		},

		onSwipedRight: () => {
			sideToggle(true);
		}
	});

	const isCurrent = (item) => {
		if (appState.currentArtist === item) {
			return { className: 'is-current' };
		}

		return false;
	}

	return (
		<div id="page-home">
			<div id="music-browser" {...swipeHandlers}>
				<div id="side-panel" className={appState.menuOpen ? 'is-open' : ''}>
					{ artistGroups &&
						<Fragment>
							<div id="artist-filter">
								<input type="text" id="field-filter" value={filter} maxLength="30" onChange={doFilter} placeholder="Find in Artists" />
								{ filter &&	<button type="button" className="btn-clear" onClick={clearFilter}>Clear</button> }
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
															return <li key={item} {...isCurrent(item)}><Link to={`/${item}`}>{item}</Link></li>
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

					{ (list && !list.files.length && !list.folders.length) &&
						<Fragment>
							<h4>This folder doesn't contain any valid music files.</h4>
							{ (list.unsupported.length > 0) &&
								<Fragment>
									<p>(But there are unsupported files)</p>
									<ul>
									{ list.unsupported.map((item, index) => {
										return <li key={item}>{item}</li>
									})}
									</ul>
								</Fragment>
							}
						</Fragment>


					}

					{ (list && list.folders.length > 0) &&
						<div className="album-list">
							{ list.folders.map((item) => {
								return <AlbumFolder key={item} item={item} parent={list.path} onClick={() => { loadList(list.path +'/'+ item) }} />
							})}
						</div>
					}

					{ (list && list.files.length > 0) &&
						<ul className="track-list">
							{ list.files.map((item, index) => {
								return <li key={item} onClick={() => { loadPlaylist(index) }}><Track num={index+1} total={list.files.length} item={item} /></li>
							})}
						</ul>
					}

					{ (prevList && prevList.folders.length > 0) &&
						<div id="more-from">
							<h3>More from this artist</h3>
							<div className="album-list">
								{ prevList.folders.map((item) => {
									return <AlbumFolder key={item} item={item} parent={prevList.path} onClick={() => { loadList(prevList.path +'/'+ item, true) }} />
								})}
							</div>
						</div>
					}
				</div>

				{ playlist &&
					<Player playlist={playlist} />
				}
			</div>
			<ErrorMessage />
		</div>
	);
}
