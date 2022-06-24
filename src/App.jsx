import React, { Component } from 'react';
import { Tabs, Input, Row, Col, Pagination, Spin, Alert, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

import MovieDB_API from './MovieDB_API';
import { MovieDB_Provider } from './MovieDB_context';
import MovieCard from './components/MovieCard';
import NetworkDetector from './hoc/NetworkDetector';
import _debounce from './_debounce';

import 'antd/dist/antd.css';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			loading: true,
			exception: null,
			searchQuery: '',
			currentPage: 1,
			totalPages: 10,
			activeTab: '1'
		};
	}

	handleInputChange = (e) => {
		const query = e.target.value;
		if (!query.length || this.state.activeTab != '1') return;
		this.setState({ loading: true, searchQuery: query, currentPage: 1 });
		this.updateDB(1, query);
		console.log('handleInputChange: loading movies…');
	}

	handlePageChange = (page) => {
		this.setState({ loading: true, currentPage: page });
		if (this.state.activeTab == '1')
			this.updateDB(page);
		else
			this.showRated(page);
		console.log('handlePageChange: loading movies…');
	}

	handleTabChange = (activeTabKey) => {
		this.setState({ loading: true, currentPage: 1, activeTab: activeTabKey });
		if (activeTabKey == '1')
			this.updateDB();
		else
			this.showRated();
	}

	updateDB(page = 1, query) {
		MovieDB_API.getMovies(8, query || this.state.searchQuery || 'return', page)
			.then(([items, pages]) => {
				this.setState({ items, loading: false, totalPages: pages, exception: null });
			})
			.catch(e => {
				this.setState({ loading: false, exception: e });
			});
	}

	showRated(page = 1) {
		const rated = []; // number[]: movie ids
		for (let i = 0; i < localStorage.length; i++) rated.push(+localStorage.key(i));

		MovieDB_API.findByIds(rated, page)
			.then(([items, pages]) => {
				if (this.state.activeTab == '2')
					this.setState({ items, loading: false, totalPages: pages, exception: null });
			})
			.catch(e => {
				this.setState({ loading: false, exception: e });
			});
	}

	render() {
		console.log('render');

		const cards = [], items = this.state.items;
		for (let i = 0, k = 1; i < items.length; i += 2, k++) {
			cards.push(
				<Row gutter={[32, 32]} justify={'center'} align={'middle'} key={k}>
					<Col span={12}>
						<MovieDB_Provider>
							<MovieCard
								id={items[i].id}
								poster_path={items[i].poster_path}
								genre_ids={items[i].genre_ids}
								release_date={items[i].release_date ?? ''}
								title={items[i].title}
								overview={items[i].overview}
								vote_average={items[i].vote_average}
							/>
						</MovieDB_Provider>
					</Col>
					<Col span={12}>
						{items[i + 1] ?
							<MovieDB_Provider>
								<MovieCard
									id={items[i + 1].id}
									poster_path={items[i + 1].poster_path}
									genre_ids={items[i + 1].genre_ids}
									release_date={items[i + 1].release_date ?? ''}
									title={items[i + 1].title}
									overview={items[i + 1].overview}
									vote_average={items[i + 1].vote_average}
								/>
							</MovieDB_Provider>
						: null}
					</Col>
				</Row>
			);
		}

		const { loading, exception } = this.state;
		const spinner = (
			<div className='centering-container'>
				<Spin indicator={<LoadingOutlined spin />} size='large' />
			</div>
		);
		const errorMsg = (
			<Alert
				message='Error'
				description={exception?.message ?? ''}
				type='error'
				showIcon
			/>
		);
		const emptyMsg = (
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				imageStyle={{ height: 65 }}
				description={<span>No movies found :&#40;</span>}
			/>
		);

		const body = (
			<div className='moviedb__wrapper'>
				{loading && spinner || null}
				{!(loading || exception) && cards || null}
				{exception && errorMsg}
				{!items.length && !loading && emptyMsg}
			</div>
		);
		const pagination = (
			<div className='centering-container'>
				<Pagination
					size='small'
					total={this.state.totalPages}
					showSizeChanger={false}
					onChange={this.handlePageChange}
					current={this.state.currentPage}
				/>
			</div>
		);

		return (
			<section className='moviedb'>
				<Tabs defaultActiveKey='1' centered tabBarStyle={{ border: 'none', outline: 'none' }} onChange={this.handleTabChange}>
					<TabPane tab='Search' key='1'>
						<Input
							placeholder='Type to search'
							onChange={_debounce(this.handleInputChange, 2000)}
						/>
						{body}
						{pagination}
					</TabPane>
					<TabPane tab='Rated' key='2'>
						{body}
						{pagination}
					</TabPane>
				</Tabs>
			</section>
		);
	}

	componentDidMount() {
		this.updateDB();
	}
}

//App.contextType = MovieDB_context;
export default NetworkDetector(App);