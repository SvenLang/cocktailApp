import React, { Component } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {
	Container,
	Content,
	Form,
	Input,
	Label,
	Item,
	CheckBox,
	Picker,
	Button,
	Icon,
	Left,
	Body,
	Right,
	Text,
	Card,
	CardItem,
	H2,
	Textarea,
	ListItem,
} from 'native-base';

export default class CameraModal extends Component {
	takePicture = async function() {
		if (this.camera) {
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			console.log(data.uri);
		}
	};

	render() {
		return (
			<Modal visible={this.props.visible} onRequestClose={this.props.onRequestClose}>
				<View style={styles.container}>
					<Container>
						<RNCamera
							ref={ref => {
								this.camera = ref;
							}}
							style={styles.preview}
							type={RNCamera.Constants.Type.back}
							flashMode={RNCamera.Constants.FlashMode.on}
							permissionDialogTitle={'Permission to use camera'}
							permissionDialogMessage={'We need your permission to use your camera phone'}
						>
							<Button onPress={this.takePicture.bind(this)}>
								<Text>Camera</Text>
							</Button>
						</RNCamera>
					</Container>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
	capture: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		margin: 40,
	},
});
