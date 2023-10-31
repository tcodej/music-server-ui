import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/application';
import { useSwipeable } from 'react-swipeable';

import { browse } from '../utils/api';
import { alphaGroup } from '../utils';
import Item from '../components/item';
import MetaData from '../components/metaData';
import Breadcrumbs from '../components/breadcrumbs';
import AlbumFolder from '../components/albumFolder';
import Player from '../components/player';

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
	// eslint-disable-next-line
	}, [loaded, params]);

	const loadArtist = (path) => {
		setMeta();
		updateAppState({
			header: path,
			playerState: 'min'
		});
		setPrevList();
		setList();

		// below desktop breakpoint, close sidebar after choosing artist
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

			const mainDiv = document.getElementById('main-panel');
			mainDiv.scrollTop = 0;

			if (response.meta) {
				setMeta(response.meta);
			}
		});
	}

	const sideToggle = (bool) => {
		appAction.toggleMenu(bool);
	}

	const loadPlaylist = (index) => {
		setPlaylist({ path: list.path, songs: list.files, index: index });
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

	return (
		<div id="page-home">

				<div id="music-browser" {...swipeHandlers}>
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

						{ (list && list.folders.length > 0) &&
							<div className="flex">
								{ list.folders.map((item) => {
									return <AlbumFolder key={item} item={item} parent={list.path} onClick={() => { loadList(list.path +'/'+ item) }} />
								})}
							</div>
						}

						{ (list && list.files.length > 0) &&
							<ul className="track-list">
								{ list.files.map((item, index) => {
									return <li key={item} onClick={() => { loadPlaylist(index) }}><Item num={index+1} total={list.files.length} item={item} /></li>
								})}
							</ul>
						}

						{ (prevList && prevList.folders.length > 0) &&
							<div id="more-from">
								<h3>More from this artist</h3>
								<div className="flex">
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


		</div>
	);
}
