import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Keyboard,
    Alert,
    ScrollView
} from 'react-native';
import Constant from '../../../helper/constant';
import NavigationBar from '../../commonComponent/navBar';
import {showNoInternetAlert, showCustomAlert} from '../../../helper/appHelper';
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";
import {UserEvent} from "../../../helper/fabricHelper/Answers";

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
            selection: {
                start: 70,
                end: 70
            }
        };
        textData = props.rowData.data || "";
        this.offset = 0;
        downCount = 0;
    }

    UNSAFE_componentWillMount() {
        isBackProcessDone = false;
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        UserEvent.userTrackScreen("addbiography", "")
    }

    componentDidMount() {
        if (this.props.rowData.data.length == 0) {
            if (this.refs.txtInput) {
                this.refs.txtInput.focus();
            }
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        this.keyboardDidHideListener.remove();
        Keyboard.dismiss();
        if (!isBackProcessDone) {
            this.onBackButtonPress(false)
        }
    }

    _keyboardWillShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        });
    };

    _keyboardWillHide = (e) => {
        this.setState({
            keyboardHeight: 0,
            isShowDone: false,
        });
    };

    _keyboardDidHide = (e) => {
        this.setState({
            isKeyBoard: false,
        });
    };

    onBackButtonPress = (isBackPress = true) => {
        isBackProcessDone = true;
        Keyboard.dismiss();
        if(this.props.rowData.data != textData) {
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
        this.setState({
            messageText: text,
        });
    };

    onDonePress = () => {
        // this.setState({
        //     messageText: textData,
        // });
        Keyboard.dismiss();
        this.onBackButtonPress();
    }

    handleSelectionChange = ({nativeEvent: {selection}}) => {
        if (this.state.isShowDone) {
            this.setState({selection})
        } else {
            let selection = {
                start: 50,
                end: 50
            }
            this.setState({selection})
        }
    }

    render() {
        let appColor = Constant[this.context];
        const {data} = this.props.rowData;
        return (
            <View style={[styles.container, {backgroundColor: appColor.scrollableViewBack}]}>
                <NavigationBar onBackButtonPress={this.onBackButtonPress}
                               top={this.props.safeAreaInsetsDefault.top}
                               backIcon={{name:"close_x_white", size: 18}}
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

                <ScrollView keyboardShouldPersistTaps={"always"}
                            keyboardDismissMode="on-drag"
                            showsVerticalScrollIndicator={true}
                            automaticallyAdjustContentInsets={false}>
                    {
                        (this.state.isKeyBoard)
                        &&
                        <TextInput placeholder={(data === "" || data === '@@@') ? strLocale("statistic.Write about yourself") : ""}
                                   placeholderTextColor={appColor.profileColor}
                                   multiline={true}
                                   onChangeText={(text) => this.onTextChange(text)}
                                   autoFocus={true}
                                   ref="txtInput"
                                   value={this.state.messageText}
                                   blurOnSubmit={false}
                                   style={[styles.textView,
                                       {   height: Constant.screenHeight - this.state.keyboardHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                           lineHeight: 24,color: appColor.lighTextColor
                                       }]}
                                   selectionColor={Constant.selectionColor}
                        />
                        ||
                        <TouchableHighlight
                            onPress={() => {
                                this.setState({
                                    isShowDone: true,
                                    isKeyBoard: true
                                });
                            }}
                            underlayColor={Constant.transparent}>
                            {
                                (this.state.messageText === "" || this.state.messageText === '@@@') &&
                                <Text style={[styles.textData, {
                                    color: appColor.profileColor,
                                    minHeight: Constant.screenHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                    paddingBottom: (this.props.safeAreaInsetsDefault.top > 20) && 20 || 15
                                }]}>
                                    {strLocale("statistic.Write about yourself")}
                                </Text>
                                ||
                                <Text style={[styles.textData, {
                                    minHeight: Constant.screenHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                    paddingBottom: (this.props.safeAreaInsetsDefault.top > 20) && 20 || 15,
                                    color: appColor.lighTextColor
                                }]}>
                                    {this.state.messageText}
                                </Text>
                            }
                        </TouchableHighlight>
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textView: {
        fontSize: 15,
        color: '#4e4e4e',
        minHeight: 40,
        fontFamily: Constant.font500,
        marginLeft: 18,
        paddingRight: 18,
        paddingTop: 30,
        paddingBottom: 10,
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