import React, { Component } from 'react';
import { Modal, StyleSheet, TextInput, View, Dimensions, CameraRoll, Vibration } from 'react-native';
import { Constants, Camera, FileSystem, Permissions } from 'expo';
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
	state = {
		flash: 'off',
		zoom: 0,
		autoFocus: 'on',
		type: 'back',
		whiteBalance: 'auto',
		ratio: '16:9',
		barcodeScanning: false,
		faceDetecting: false,
		newPhotos: false,
		permissionsGranted: false,
		pictureSize: undefined,
		pictureSizes: [],
		pictureSizeId: 0,
		showGallery: false,
		showMoreOptions: false,
	};

	async componentWillMount() {
		const permissions = await Promise.all([
			Permissions.askAsync(Permissions.CAMERA),
			Permissions.askAsync(Permissions.CAMERA_ROLL),
		]);
		//If any of the permissions has not been granted, do not move on
		if (permissions.some(({ status }) => status !== 'granted')) {
			this.setState({ permissionsGranted: false });
		} else {
			this.setState({ permissionsGranted: true });
		}
	}

	takePicture = async () => {
		if (this.camera) {
			//take the picture
			let photo = await this.camera.takePictureAsync();
			//save the picture
			var photoSaveDir = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
			await FileSystem.moveAsync({
				from: photo.uri,
				to: photoSaveDir,
			});
			//show the picture in the usual preview of the images
			CameraRoll.saveToCameraRoll(photoSaveDir, 'photo');
			//Vibrate to indicate that a picture has been taken
			Vibration.vibrate();

			console.log('Saved photo at dir ' + photoSaveDir);
			this.setState({ newPhoto: true, photoSaveDir: photoSaveDir });
		}
	};

	renderNoPermissions = () => {
		return (
			<View style={styles.noPermissions}>
				<Text style={{ color: 'white' }}>Camera permissions not granted - cannot open camera preview.</Text>
			</View>
		);
	};

	renderCamera = () => {
		return (
			<Camera
				ref={ref => {
					this.camera = ref;
				}}
				style={styles.preview}
				type="back"
				flashMode="off"
				autoFocus="on"
				whiteBalance={'auto'}
				ratio={'16:9'}
			>
				<Button full primary icon onPress={() => this.takePicture()} style={{ marginBottom: 0, flex: 0.1 }}>
					<Icon name="md-camera" />
				</Button>
			</Camera>
		);
	};

	render() {
		var content = this.state.permissionsGranted ? this.renderCamera() : this.renderNoPermissions();
		return (
			<Modal visible={this.props.visible} onRequestClose={this.props.onRequestClose}>
				<View style={styles.container}>
					<Container>{content}</Container>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '100%',
	},
	preview: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
	capture: {
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		margin: 40,
	},
});
