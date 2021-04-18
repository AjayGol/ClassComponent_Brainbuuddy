import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Keyboard,
    Alert,
    ScrollView, BackHandler
} from 'react-native';
import Constant from '../../../helper/constant';
import {UserEvent} from "../../../helper/fabricHelper/Answers"
import NavigationBar from '../../commonComponent/navBar';
import {showNoInternetAlert, showCustomAlert} from '../../../helper/appHelper';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";

let textData = "";
let isBackProcessDone = false;
let downCount = 0;

export default class ManageBiography extends Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        let messageTemp = (props.rowData.data && props.rowData.data !== '@@@') &&
            props.rowData.data || ""
        this.state = {
            keyboardHeight: 0,
            messageText: messageTemp,
            isShowDone: props.rowData.data.length === 0,
            isKeyBoard: props.rowData.data.length === 0,
            height: 0,
        };
        textData = props.rowData.data || "";
        this.offset = 0;
        downCount = 0;
    }

    UNSAFE_componentWillMount() {
        isBackProcessDone = false;
        this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide);
        UserEvent.userTrackScreen("addbiography", "")
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        if (this.props.rowData.data.length == 0) {
            if (this.refs.txtInput) {
                this.refs.txtInput.focus();
            } else {
                Keyboard.dismiss()
            }
        }
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        Keyboard.dismiss();
        if (!isBackProcessDone) {
            this.onBackButtonPress(false)
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    _keyboardWillShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height + 60,
            isShowDone: true
        });
    };

    _keyboardWillHide = (e) => {
        this.setState({
            keyboardHeight: 0,
            isShowDone: false
        });
    };

    onSwipeDown(gestureState) {
        Keyboard.dismiss()
    }

    onBackButtonPress = (isBackPress = true) => {
        isBackProcessDone = true;
        Keyboard.dismiss();
        if (this.props.rowData.data != textData) {
            // if(!textData.trim().length){
            //     textData = '@@@';
            // }
            //Add textData

        }
        this.props.onCloseBtnPress(textData);
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        textData = message;
    };

    onDonePress = () => {
        // this.setState({
        //     messageText: textData,
        // });
        Keyboard.dismiss();
        this.onBackButtonPress();
    }

    render() {
        let appColor = Constant[this.context];
        const {data} = this.props.rowData;
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };
        return (
            <View style={[styles.container, {backgroundColor: appColor.scrollableViewBack}]}>
                <GestureRecognizer
                    onSwipeDown={(state) => this.onSwipeDown(state)}
                    config={config}
                    style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <NavigationBar onBackButtonPress={this.onBackButtonPress}
                                       top={this.props.safeAreaInsetsDefault.top}
                                       backIcon={{name: "close_x_white", size: 18}}
                                       title={strLocale("topbar.About")}/>
                        {
                            (this.state.isShowDone) &&
                            <TouchableHighlight style={styles.doneView}
                                                onPress={this.onDonePress}
                                                underlayColor={Constant.transparent}>
                                <Text style={[styles.doneText, {
                                    paddingTop: 10 + this.props.safeAreaInsetsDefault.top,
                                    color: appColor.navDoneBtn
                                }]}>
                                    {strLocale("ex.DONE")}
                                </Text>
                            </TouchableHighlight>
                            || null
                        }

                        <TextInput
                            placeholder={(data === "" || data === '@@@') ? strLocale("statistic.Write about yourself") : ""}
                            placeholderTextColor={appColor.profileColor}
                            multiline={true}
                            numberOfLines={100}
                            autoCorrect={true}
                            onChangeText={(text) => this.onTextChange(text)}
                            autoFocus={false}
                            keyboardDismissMode={"on-drag"}
                            blurOnSubmit={false}
                            enablesReturnKeyAutomatically={false}
                            ref="txtInput"
                            autoCapitalize={"sentences"}
                            style={[styles.textView,
                                {
                                    maxHeight: Constant.screenHeight - this.state.keyboardHeight,
                                    color: appColor.lighTextColor
                                }]}>
                            <Text style={{lineHeight: 24}}>
                                {textData}
                            </Text>
                        </TextInput>
                    </View>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50
    },
    textView: {
        textAlignVertical: 'top',
        fontSize: 15,
        minHeight: 40,
        fontFamily: Constant.font500,
        marginLeft: 18,
        paddingRight: 18,
        paddingTop: 30,
        paddingBottom: 12,
        lineHeight: 24
    },
    doneView: {
        top: Constant.isIOS && 30 || 10,
        right: 10,
        position: 'absolute',
        width: 50,

        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    doneText: {
        fontSize: 14,
        color: '#a7b0b6',
        fontFamily: Constant.font700,
    },
    textData: {
        fontSize: 15,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        marginLeft: 18,
        paddingRight: 18,
        paddingTop: 30,
        paddingBottom: 10,
        lineHeight: 24,
        flex: 1,
    }
});