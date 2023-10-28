export default function Breadcrumbs({ path }) {
	const parts = path.split('/');

	return <h3>{parts.join(' / ')}</h3>
}
