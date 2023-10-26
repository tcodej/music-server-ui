import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './views/home';
import Error404 from './views/error404';
import './styles/main.scss';

export default function App() {
	return (
		<BrowserRouter basename="/">
			<Header />
			<div id="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/*" element={<Home />} />
					<Route path="*" element={<Error404 />} />
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
	)
}
