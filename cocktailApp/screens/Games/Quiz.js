import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Quiz</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
	},
	buttongroup: {
		height: 30,
	},
});
