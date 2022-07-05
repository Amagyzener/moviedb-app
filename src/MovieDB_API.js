/* const movies = fetch('https://api.themoviedb.org/3/search/movie?api_key=c16d261278a8e5c8f3c4067195f5530d&query=return')
		.then(response => response.json())
		.then(json => json.results); */
/* Для добавления картинок используется ссылка: https://image.tmdb.org/t/p/w500
	В конец URL добавляется 'poster_path', полученный из API */
export default class MovieDB_API {
	static #api = 'https://api.themoviedb.org/3';
	static #api_key = 'c16d261278a8e5c8f3c4067195f5530d';

	static async #fetchData(request) { // : Object<JSON>
		const data = await fetch(request);
		if (!data.ok) throw new Error(`Couldn’t fetch "${data.url}" (status ${data.status})`);
		return data.json();
	}


	static async getMovies(count, query = 'return', page = 1) { // : Array
		if (!query) return [];
		const json = await this.#fetchData(`${this.#api}/search/movie?api_key=${this.#api_key}&query=${query}&page=${page}`);
		//console.warn(json);
		return [json.results.slice(0, count), json.total_pages * 10];
	}

	static async getGenres() { // : Array
		const json = await this.#fetchData(`${this.#api}/genre/movie/list?api_key=${this.#api_key}`);
		//console.warn(json.genres);
		return json.genres;
	}

	static async getExtId(id) { // : string
		return await this.#fetchData(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${this.#api_key}`);
	}

	static async findByIds(ids, page) { // : Array
		const movies = [], idsTotal = ids.length;
		if (idsTotal > (page * 8 - idsTotal)) {
			const pageStart = (page - 1) * 8;
			ids = ids.slice(pageStart, pageStart + 8);
		}

		for (const id of ids) {
			const json = await this.#fetchData(`https://api.themoviedb.org/3/find/${id}?api_key=${this.#api_key}&language=en-US&external_source=imdb_id`);
			movies.push(json.movie_results[0]);
		}
		//console.warn(movies, movies.length, Math.ceil(movies.length / 6) * 10);
		return [movies, Math.ceil(idsTotal / 8) * 10];
	}
}