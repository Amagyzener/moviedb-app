import React, { Component } from 'react';
const { Provider, Consumer } = React.createContext();

import MovieDB_API from './MovieDB_API';


class MovieDB_Provider extends Component {
	state = {
		genres: []
	}

	render() {
		return (
			<Provider value={this.state.genres}>
				{this.props.children}
			</Provider>
		);
	}

	componentDidMount() {
		MovieDB_API.getGenres().then(
			genres => this.setState({ genres })
		);
	}
}

export { MovieDB_Provider, Consumer as MovieDB_Consumer };