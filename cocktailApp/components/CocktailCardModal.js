import React from 'react';
import { Modal, View, ImageBackground } from 'react-native';
import CocktailCard from './CocktailCard';

export default class CocktailCardModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal
				visible={this.props.visible}
				onRequestClose={this.props.onRequestClose}
				transparent={false}
				animationType={'fade'}
			>
				<View>
					<ImageBackground
						source={require('../assets/images/tropicalBackground.jpg')}
						style={{ width: '100%', height: '100%' }}
					>
						<CocktailCard cocktailToShow={this.props.cocktailToShow} />
					</ImageBackground>
				</View>
			</Modal>
		);
	}
}
