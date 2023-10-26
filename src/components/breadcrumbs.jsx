export default function Breadcrumbs({ path }) {
	return (path.length > 1) &&
		<h3>{path.split('/').join(' / ')}</h3>
}
