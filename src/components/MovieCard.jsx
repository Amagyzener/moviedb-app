import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

import MovieDB_API from '../MovieDB_API';
import { MovieDB_Consumer } from '../MovieDB_context';

import 'antd/dist/antd.css';
import './MovieCard.css';


export default class MovieCard extends Component {
	/* <!> Avoid copying props into state!
	constructor(props) {
		super(props);
		this.state = {
			poster_path: props.poster_path,
			genre_ids: props.genre_ids,
			release_date: new Date(props.release_date),
			title: props.title,
			overview: props.overview,
			vote_average: props.vote_average
		};
	} */
	state = {
		stars: +localStorage.getItem(this.props.id) ?? 0
	};

	#dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

	#limitString(text, limit, params = {}) {
		limit = parseInt(limit) || 0;
		if (limit <= 0) limit = text.length + limit;

		const options = {
			tail: '\u2026',	// что дописать после обрыва (default: ellipsis)
			trim: true,			// обрезать пробелы в начале/конце?
			strict: false		// обрезать слова?
		};

		// apply user params
		Object.assign(options, params); // <?> 'Object.assign()' does not throw on 'null' or 'undefined' sources

		// удаление пробелов в начале/конце
		if (options.trim) text = text.trim();
		if (text.length <= limit) return text; // если строка уже вписывается в ограничение по длине

		text = text.slice(0, limit); // обрезка по ограничению длины строки

		let lastSpace = text.lastIndexOf('\u0020');
		for (let char = lastSpace; char >= 0; lastSpace--)
			if (!'.,!?:;-\u0020\u2013\u2014\u2026'.includes(text[--char])) break;
		// дополнительная обрезка до границы целого слова
		if (!options.strict && lastSpace > 0) text = text.slice(0, lastSpace);
		return text + options.tail;
	}

	handleRateChange = (n, id) => {
		console.warn('Rated', n, 'on movie with id', id);
		this.setState({ stars: n });
		MovieDB_API.getExtId(id).then((extId) => {
			// запись внешнего IMDB id фильма в хранилище
			localStorage.setItem(extId.imdb_id, true);
			// запись внутреннего id (для сохранения оценок и избежания большого количества запросов в 'MovieDB_API.findByIds()')
			localStorage.setItem(id, n);
		}).catch(() => {
			alert('Failed to rate the movie. Please, try again');
		});
	}

	render() {
		const { poster_path, vote_average, title, release_date, genre_ids, overview, id } = this.props;

		return (
			<div className='movie-card'>
				<img className='movie-card__pic' src={
					poster_path
						? `https://image.tmdb.org/t/p/w500${poster_path}`
						: 'data:image/png;base64,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'
					}
				/>
				<div className='movie-card__info'>
					<div className='movie-card__cap'>
						<h2>{title}</h2>
						<div className={'movie-card__avg' + (
							(vote_average < 3 && ' red')
								|| (vote_average < 5 && ' orange')
								|| (vote_average < 7 && ' yellow')
								|| ' green'
							)
						}>
							{vote_average.toFixed(1)}
						</div>
					</div>
					<div>{release_date.length ? this.#dateFormat.format(new Date(release_date)) : 'Coming soon…'}</div>
					<div className='movie-card__tags'>
						<MovieDB_Consumer>
							{genres => genre_ids.map((id, index) => {
								for (const genre of genres)
									if (genre.id === id)
										return <span key={index + 1}>{genre.name}</span>;
							})}
						</MovieDB_Consumer>
					</div>
					<p>{this.#limitString(overview, 150)}</p>
					<Rate count={10} allowHalf value={this.state.stars} onChange={(n) => this.handleRateChange(n, id)} />
				</div>
			</div>
		);
	}
}

MovieCard.defaultProps = {
	poster_path: '',
	vote_average: 0,
	title: 'Movie Title',
	release_date: '',
	genre_ids: [],
	overview: 'Movie short overview.',
	id: 0
};

MovieCard.propTypes = {
	poster_path: PropTypes.string,
	vote_average: PropTypes.number,
	title: PropTypes.string,
	release_date: PropTypes.string,
	genre_ids: PropTypes.array,
	overview: PropTypes.string,
	id: PropTypes.number
};