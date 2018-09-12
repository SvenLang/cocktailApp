import React, { Component } from 'react';
import { Modal, StyleSheet, TextInput, View, Dimensions } from 'react-native';
import { Constants, Camera, FileSystem, Permissions, BarCodeScanner } from 'expo';
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
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ permissionsGranted: status === 'granted' });
	}

	componentDidMount() {
		FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
			console.log(e, 'Directory exists');
		});
	}

	takePicture = () => {
		if (this.camera) {
			this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
		}
	};

	onPictureSaved = async photo => {
		var photoSaveDir = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
		await FileSystem.moveAsync({
			from: photo.uri,
			to: photoSaveDir,
		});
		console.log('Saved photo at dir ' + photoSaveDir);
		this.setState({ newPhotos: true, photoSaveDir: photoSaveDir });
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
