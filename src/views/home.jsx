import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { browse, getMeta } from '../utils/api';
import { alphaGroup } from '../utils';
import Item from '../components/item';
import MetaData from '../components/metaData';
import Breadcrumbs from '../components/breadcrumbs';
import AlbumFolder from '../components/albumFolder';
import Player from '../components/player';

export default function Browser() {
	const params = useParams();

	const [loaded, setLoaded] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const [artists, setArtists] = useState();
	const [artistGroups, setArtistGroups] = useState();
	const [list, setList] = useState();
	const [prevList, setPrevList] = useState();
	const [meta, setMeta] = useState();
	const [playerMeta, setPlayerMeta] = useState();
	const [filter, setFilter] = useState('');

	useEffect(() => {
		if (!loaded) {
			browse().then((response) => {
				setLoaded(true);
				setArtists(response.folders);
				setArtistGroups(alphaGroup(response.folders));
			});
		}
	}, [loaded]);

	useEffect(() => {
		const path = params['*'];

		if (path) {
			loadArtist(path);
		}
	}, [params])

	const loadArtist = (path) => {
		setMeta();
		setPlayerMeta();
		setPrevList();
		setList();

		browse(path).then((response) => {
			setList(response);
		});
	}

	const loadList = (path, skipList) => {
		if (!skipList && list) {
			setPrevList(list);
		}

		browse(path).then((response) => {
			setIsOpen(false);
			setList(response);

			if (response.meta) {
				setMeta(response.meta);
			}
		});
	}

	const sideToggle = () => {
		setIsOpen(!isOpen);
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

	return (
		<div id="page-home">
			<div id="side-panel" className={isOpen ? 'is-open' : ''}>
				<div id="side-toggle" onClick={sideToggle}>&lt;</div>

				{ artistGroups &&
					<div id="artist-list">
						<input type="text" value={filter} onChange={doFilter} placeholder="Filter artists..." />
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
				}

			</div>

			<div id="main-panel" className={isOpen ? 'is-open' : ''}>
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
		</div>
	);
}
