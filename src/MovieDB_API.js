/* const movies = fetch('https://api.themoviedb.org/3/search/movie?api_key=c16d261278a8e5c8f3c4067195f5530d&query=return')
		.then(response => response.json())
		.then(json => json.results); */
/* Для добавления картинок используется ссылка: https://image.tmdb.org/t/p/w500
	В конец URL добавляется 'poster_path', полученный из API */
export default class MovieDB_API {
	static #api = 'https://api.themoviedb.org/3';
	static #api_key = 'c16d261278a8e5c8f3c4067195f5530d';

	static async getMovies(count, query = 'return', page = 1) { // : Array
		if (!query) return [];
		const data = await fetch(`${this.#api}/search/movie?api_key=${this.#api_key}&query=${query}&page=${page}`);
		if (!data.ok) throw new Error(`Couldn’t fetch "${data.url}" (status ${data.status})`);
		const json = await data.json();
		//console.warn(json);
		return [json.results.slice(0, count), json.total_pages * 10];
	}

	static async getGenres() { // : Array
		const data = await fetch(`${this.#api}/genre/movie/list?api_key=${this.#api_key}`);
		if (!data.ok) throw new Error(`Couldn’t fetch "${data.url}" (status ${data.status})`);
		const json = await data.json();
		//console.warn(json.genres);
		return json.genres;
	}

	static async findByIds(ids, page) { // : Array
		const movies = [], idsTotal = ids.length;
		if (idsTotal > (page * 8 - idsTotal)) {
			const pageStart = (page - 1) * 8;
			ids = ids.slice(pageStart, pageStart + 8);
		}

		for (const id of ids) {
			const extId = await fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${this.#api_key}`);
			if (!extId.ok) throw new Error(`Couldn’t fetch "${extId.url}" (status ${extId.status})`);
			let json = await extId.json();

			const data = await fetch(`https://api.themoviedb.org/3/find/${json.imdb_id}?api_key=${this.#api_key}&language=en-US&external_source=imdb_id`);
			if (!data.ok) throw new Error(`Couldn’t fetch "${data.url}" (status ${data.status})`);
			json = await data.json();

			movies.push(json.movie_results[0]);
		}
		//console.warn(movies, movies.length, Math.ceil(movies.length / 6) * 10);
		return [movies, Math.ceil(idsTotal / 8) * 10];
	}
}