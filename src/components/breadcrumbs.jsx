export default function Breadcrumbs({ path }) {
	const parts = path.split('/');

	return (parts.length > 1) &&
		<h3>{parts.join(' / ')}</h3>
}
