import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Alert } from 'react-native'
import Constant from "../../../helper/constant";
import LottieView from "lottie-react-native";
import {ThemeContext} from 'AppTheme';

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
	static popupInstance
	static contextType = ThemeContext;

	static show({ ...config }) {
		this.popupInstance.start(config)
	}

	static hide() {
		this.popupInstance.hidePopup()
	}

	state = {
		positionView: new Animated.Value(HEIGHT),
		opacity: new Animated.Value(0),
		positionPopup: new Animated.Value(HEIGHT),
		popupHeight: 0,
		isShow: false
	}

	start({ ...config }) {
		this.setState({
			title: config.title,
			type: config.type,
			icon: config.icon !== undefined ? config.icon : false,
			textBody: config.textBody,
			button: config.button !== undefined ? config.button : false,
			buttonGlobal: config.buttonGlobal !== undefined ? config.buttonGlobal : false,
			buttonText: config.buttonText || 'Ok',
			callback: config.callback !== undefined ? config.callback : this.defaultCallback(),
			background: config.background || 'rgba(0, 0, 0, 0.5)',
			timing: config.timing,
			autoClose: config.autoClose !== undefined ? config.autoClose : false,
			typeImage: config.typeImage || 'success'
		})

		Animated.sequence([
			Animated.timing(this.state.positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.spring(this.state.positionPopup, {
				toValue: (HEIGHT / 2) - (this.state.popupHeight / 2),
				bounciness: 15,
				useNativeDriver: true
			})
		]).start()

		if (config.autoClose && config.timing !== 0) {
			const duration = config.timing > 0 ? config.timing : 5000
			setTimeout(() => {
				this.hidePopup()
			}, duration)
		}

		setTimeout(() => {
			this.setState({
				isShow: true
			})
		},800)
	}

	hidePopup() {

		Animated.sequence([
			Animated.timing(this.state.positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: true
			}),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.timing(this.state.positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: false
			})
		]).start(() => {
			this.setState({
				isShow: false
			})
		})
	}

	defaultCallback() {
		return Alert.alert(
			'Callback!',
			'Callback complete!',
			[
				{ text: 'Ok', onPress: () => this.hidePopup() }
			]
		)
	}

	render() {
		const { title, type, textBody, button, buttonText, callback, background, typeImage } = this.state
		let aninationName = Constant.isIOS && "tick_animation_blue" || "tick_animation_blue" + '.json';
		if(typeImage === 'fail'){
			aninationName = Constant.isIOS && "tick_animation_fail" || "tick_animation_fail" + '.json';
		}

		let appColor = Constant[this.context];

		let el = null;
		if (this.state.button) {
			el = <TouchableOpacity style={[styles.Button, styles[type]]} onPress={callback}>
				<Text style={styles.TextButton}>{buttonText}</Text>
			</TouchableOpacity>
		}
		else {
			el = <Text></Text>
		}
		return (
			<Animated.View
				ref={c => this._root = c}
				style={[styles.Container, {
					backgroundColor: background || 'transparent',
					opacity: this.state.opacity,
					transform: [
						{ translateY: this.state.positionView }
					]
				}]}>
				<Animated.View
					onLayout={event => {
						this.setState({ popupHeight: event.nativeEvent.layout.height })
					}}
					style={[styles.Message, {
						transform: [
							{ translateY: this.state.positionPopup }
						]
					},{backgroundColor: appColor.cardBack}]}

				>
					<View style={[styles.Header, {backgroundColor: appColor.progressBG}]} />
					{
						!!(this.state.isShow === true && this.state.typeImage !== 'fail') &&
							<LottieView ref={animation => {
								this.animation = animation;
							}}
										source={aninationName}
										style={{width: 150, height: 150, position: 'absolute', marginTop: -7}}
										autoPlay={true}
										loop={false}
							/>
					}
					{
						!!(this.state.isShow === true && this.state.typeImage === 'fail') &&
						<LottieView ref={animation => {
							this.animation = animation;
						}}
									source={aninationName}
									style={{width: 90, height: 90, position: 'absolute', marginTop: 3}}
									autoPlay={true}
									loop={false}
						/>
					}
					<View style={[styles.Content]}>
						<Text style={[styles.Title, {color: appColor.defaultFont}]}>{title}</Text>
						{
							!!(textBody && textBody !== '') &&
							<Text style={[styles.Desc, {color: appColor.defaultFont}]}>{textBody}</Text>
						}
						{el}
					</View>
				</Animated.View>
				{
					!!(this.state.buttonGlobal) &&
					<TouchableOpacity style={{flex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}} onPress={callback}>
					</TouchableOpacity>
				}
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	Container: {
		position: 'absolute',
		zIndex: 99999,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		top: 0,
		left: 0
	},
	Message: {
		maxWidth: 300,
		width: 230,
		minHeight: 0,
		backgroundColor: '#fff',
		borderRadius: 30,
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
	},
	Content: {
		padding: 20,
		alignItems: 'center'
	},
	Header: {
		height: 230,
		width: 230,
		backgroundColor: '#FBFBFB',
		borderRadius: 100,
		marginTop: -120
	},
	Image: {
		width: 150,
		height: 80,
		position: 'absolute',
		top: 20
	},
	Title: {
		fontSize: 18,
		fontFamily: Constant.font700,
		color: '#333',
		textAlign: 'center'
	},
	Desc: {
		textAlign: 'center',
		color: '#666',
		marginTop: 10,
		fontFamily: Constant.font500,
		fontSize: 15
	},
	Button: {
		borderRadius: 50,
		height: 40,
		width: 130,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30
	},
	TextButton: {
		color: '#fff',
		fontFamily: Constant.font700
	},
	Success: {
		backgroundColor: '#AAF577',
		shadowColor: "#AAF577",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	Danger: {
		backgroundColor: '#F29091',
		shadowColor: "#F29091",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	Warning: {
		backgroundColor: '#fbd10d',
		shadowColor: "#fbd10d",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	}
})

export default Popup
