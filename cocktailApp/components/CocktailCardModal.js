import React from 'react';
import { Modal, View } from 'react-native';
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
					<CocktailCard cocktailToShow={this.props.cocktailToShow} />
				</View>
			</Modal>
		);
	}
}
