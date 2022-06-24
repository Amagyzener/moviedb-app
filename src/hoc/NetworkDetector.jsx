import React, { Component, Fragment } from 'react';

export default function(ComposedComponent) {
	class NetworkDetector extends Component {
		state = { isDisconnected: false };

		#handleConnectionChange = () => {
			const condition = navigator.onLine ? 'online' : 'offline';
			if (condition == 'online') {
			const webPing = setInterval(
				() => {
					fetch('//google.com', { mode: 'no-cors' })
						.then(() => this.setState({ isDisconnected: false }, () => clearInterval(webPing)))
						.catch(() => this.setState({ isDisconnected: true }))
				}, 2000);
				return;
			}

			return this.setState({ isDisconnected: true });
		}

		componentDidMount() {
			this.#handleConnectionChange();
			window.addEventListener('online', this.#handleConnectionChange);
			window.addEventListener('offline', this.#handleConnectionChange);
		}

		componentWillUnmount() {
			window.removeEventListener('online', this.#handleConnectionChange);
			window.removeEventListener('offline', this.#handleConnectionChange);
		}

		render() {
			const { isDisconnected } = this.state;
			return (
				<Fragment>
					{isDisconnected && (
						<div className='internet-error'>
							<p>Internet connection lost</p>
						</div>
					)}
					<ComposedComponent {...this.props} />
				</Fragment>
			);
		}
	}

	return NetworkDetector;
}