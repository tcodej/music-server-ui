export const apiURL = import.meta.env.VITE_API_URL;

const getResult = async (endpoint, postData) => {
	let data = {
		method: 'GET'
	};

	if (postData) {
		let formData = new FormData();
		data.method = 'POST';

		for (const [key, value] of Object.entries(postData)) {
			formData.append(key, value);
		}

		data.body = formData;
	}

	try {
		const response = await fetch(`${apiURL}${endpoint}`, data);
		const result = await response.json();
		result.ok = response.ok;
		return result;

	} catch(err) {
		console.log(err);
		return {
			ok: false,
			error: 'Server exception'
		}
	}
}

export const browse = async (path, opts) => {
	if (!path) {
		path = '';
	}

	path = encodeURIComponent(path);

	// todo: opts not yet supported
	if (opts) {
		if (opts.cover) {
			path += '?cover=true'
		}
	}

	return getResult(`/api/browse/${path}`);
};

export const getMeta = async (path) => {
	if (!path) {
		return {};
	}

	path = encodeURIComponent(path);
	return getResult(`/api/meta/${path}`);
}

// return meta for first mp3 in an album folder
export const getFolderMeta = async (path) => {
	if (!path) {
		return {};
	}

	path = encodeURIComponent(path);
	return getResult(`/api/meta/folder/${path}`);
}
