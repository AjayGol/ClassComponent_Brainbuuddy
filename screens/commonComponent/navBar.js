import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    StatusBar
} from 'react-native';
import Constant from '../../helper/constant';
import CountDown from 'react-native-countdown-component';
import AppStatusBar from './statusBar';
import {connect} from 'react-redux';
import {managePopupQueue, removeSafeArea} from "../../actions/userActions";
import {addNewCheckupQuestion} from "../../actions/metadataActions";
import LinearGradient from "react-native-linear-gradient";
import {ThemeContext} from 'AppTheme';
import {strLocale} from "../../helper/locale";
import de from "../../helper/locale/de";

class NavigationBar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            remainingTime: props.remainingTime && props.remainingTime || undefined,
            timerType: 'm'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.remainingTime !== nextProps.remainingTime) {
            this.setState({
                remainingTime: nextProps.remainingTime>59 && (nextProps.remainingTime + 59) || nextProps.remainingTime,
                timerType: nextProps.remainingTime && nextProps.remainingTime > 60 && 'm' || 's'
            })
        }
    }

    onTimerChange = (time) =>  {
        if (time == 121){
            this.setState({
                remainingTime:60,
                timerType: 's'
            })
        }
    }

    static contextType = ThemeContext;

    render() {
        const {textRemaining} = styles
        const {timerType, remainingTime} = this.state

        let height = (this.props.height) ? this.props.height + this.props.top : (60 + this.props.top);
        let appColor = Constant[this.context];

        if (this.props.chatNav){
            return (
                <View style={[styles.mainView2, {
                    backgroundColor:
                        (this.props.backColor) ? this.props.backColor : appColor.navDefaultColor,
                    height: (Constant.isIOS) && (this.props.detailText && height + 20 || height) || (this.props.detailText && 54 + 20 || 54),
                    paddingTop: (Constant.isIOS) && ( this.props.top) || 0,
                    borderBottomWidth: 1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor
                }]}>
                    {/*<AppStatusBar barStyle={appColor.statusBarStyle}*/}
                    {/*              backColor={this.props.backColor || appColor.navDefaultColor}/>*/}
                    {/*<StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>*/}

                    <TouchableHighlight onPress={this.props.onBackButtonPress}
                                        underlayColor={Constant.transparent}>
                        <View style={[styles.backIcon, {paddingTop: 25}]}>
                            {
                                this.props.backText &&
                                <Text style={[styles.textTitle, {
                                    color: appColor.navDoneBtn,
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }]}>
                                    {this.props.backText}
                                </Text>
                                ||
                                <Image resizeMode="contain"
                                       style={{
                                           height: this.props.backIcon && this.props.backIcon.size || 20,
                                           width: this.props.backIcon && this.props.backIcon.size || 20,
                                           marginVertical: 10, tintColor: appColor.navBackArrow
                                       }}
                                       source={{uri: this.props.backIcon && this.props.backIcon.name || 'back_button_rounded'}}/>
                            }
                        </View>
                    </TouchableHighlight>

                    <View style={{
                        flex: 1,
                        paddingTop: 36,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={[styles.titleTextProfession, {
                                color: appColor.navTextColor,
                                height: 18,
                            }]}>
                            {this.props.title}
                        </Text>
                        {
                            !!remainingTime && (remainingTime !== -1) &&
                            <View style={{flexDirection: 'row',top: -3}}>
                                {!!(remainingTime !== -1) &&
                                <CountDown
                                    size={30}
                                    style={{height: 20}}
                                    until={remainingTime}
                                    onFinish={() => this.props.onEndSession()}
                                    onChange={(time) => this.onTimerChange(time)}
                                    digitStyle={{
                                        backgroundColor: Constant.transparent,
                                        borderWidth: 0,
                                        borderColor: Constant.transparent,
                                        borderRadius: 5,
                                        marginHorizontal: -27,
                                        marginVertical: -28,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    digitTxtStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700,
                                        fontWeight: 'normal'
                                    }}
                                    separatorStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700
                                    }}
                                    timeToShow={timerType == 's' && ['M', 'S'] || ['M']}
                                    timeLabels={{m: null, s: null}}
                                    showSeparator
                                />
                                }
                                <Text
                                    style={[textRemaining, {color: appColor.navDetailTextColor}]}>{timerType == 's' ? strLocale("professionalSupport.remaining") : strLocale("professionalSupport.minutesremaining")}</Text>
                            </View>
                        }
                        {
                            !!remainingTime && (remainingTime === -1) &&
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[textRemaining, {
                                    color: appColor.navDetailTextColor,
                                    height: 20
                                }]}>{strLocale("professionalSupport.Preparing to chat")}</Text>
                            </View>
                        }
                    </View>


                    {
                        (this.props.rightButton) &&
                        <Text style={[styles.textTitle, {color: appColor.navDoneBtn}]}
                              onPress={this.props.onRightBtnClick}>
                            {this.props.rightButton}
                        </Text>
                        ||
                        <Text style={[styles.textTitle, {color: Constant.transparent}]}>{"Save"}</Text>
                    }
                </View>
            );
        }

        if (this.props.gradient){
            return (
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#667eea', '#764ba2']}
                                locations={[0, 1]}
                                style={[styles.mainView, {
                    backgroundColor:
                        (this.props.backColor) ? this.props.backColor : appColor.navDefaultColor,
                    height: (Constant.isIOS) && (this.props.detailText && height + 20 || height) || (this.props.detailText && 54 + 20 || 54),
                    paddingTop: (Constant.isIOS) && (18 + this.props.top) || 0,
                    borderBottomWidth: 1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor
                }]}>
                    {/*<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#667eea', '#764ba2']}*/}
                    {/*                locations={[0, 1]} style={{flex:1}}>*/}

                    {/*<AppStatusBar barStyle={appColor.statusBarStyle}*/}
                    {/*              backColor={this.props.backColor || appColor.navDefaultColor}/>*/}
                    {/*<StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>*/}

                    <TouchableHighlight onPress={this.props.onBackButtonPress}
                                        underlayColor={Constant.transparent}>
                        <View style={[styles.backIcon, {marginTop: this.props.detailText && -20 || 0, marginLeft: 5}]}>
                            {
                                this.props.backText &&
                                <Text style={[styles.textTitle, {
                                    color: appColor.navDoneBtn,
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }]}>
                                    {this.props.backText}
                                </Text>
                                ||
                                <Image resizeMode="contain"
                                       style={{
                                           height: this.props.backIcon && this.props.backIcon.size || 20,
                                           width: this.props.backIcon && this.props.backIcon.size || 20,
                                           marginVertical: 10, tintColor: appColor.navBackArrow
                                       }}
                                       source={{uri: this.props.backIcon && this.props.backIcon.name || 'back_button_rounded'}}/>
                            }
                        </View>
                    </TouchableHighlight>

                    <View style={{
                        flex: 1, justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: -5
                    }}>
                        <Text
                            style={[styles.titleTextProfession, {
                                color: appColor.navTextColor,
                                paddingTop: 5
                            }]}>
                            {this.props.title}
                        </Text>
                        {
                            !!remainingTime && (remainingTime !== -1) &&
                            <View style={{flexDirection: 'row'}}>
                                {!!(remainingTime !== -1) &&
                                <CountDown
                                    size={30}
                                    style={{height: 20}}
                                    until={remainingTime}
                                    onFinish={() => this.props.onEndSession()}
                                    onChange={(time) => this.onTimerChange(time)}
                                    digitStyle={{
                                        backgroundColor: Constant.transparent,
                                        borderWidth: 0,
                                        borderColor: Constant.transparent,
                                        borderRadius: 5,
                                        marginHorizontal: -27,
                                        marginVertical: -28,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    digitTxtStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700,
                                        fontWeight: 'normal'
                                    }}
                                    separatorStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700
                                    }}
                                    timeToShow={timerType == 's' && ['M', 'S'] || ['M']}
                                    timeLabels={{m: null, s: null}}
                                    showSeparator
                                />
                                }
                                <Text
                                    style={[textRemaining, {color: appColor.navDetailTextColor}]}>{timerType == 's' ? strLocale("professionalSupport.remaining") : strLocale("professionalSupport.minutesremaining")}</Text>
                            </View>
                        }
                        {
                            !!remainingTime && (remainingTime === -1) &&
                            <View style={{flexDirection: 'row', top: 3}}>
                                <Text style={[textRemaining, {
                                    color: appColor.navDetailTextColor,
                                    height: 20
                                }]}>{strLocale("professionalSupport.Preparing to chat")}</Text>
                            </View>
                        }
                    </View>

                    {
                        (this.props.rightButton) &&
                        <Text style={[styles.textTitle, {color: appColor.navDoneBtn}]}
                              onPress={this.props.onRightBtnClick}>
                            {this.props.rightButton}
                        </Text>
                        ||
                        <Text style={[styles.textTitle, {color: Constant.transparent}]}>{"Save"}</Text>
                    }

                    {/*</LinearGradient>*/}
                </LinearGradient>
            )
        }

        return (
            (this.props.type2) ?
                <View style={[styles.mainView, {
                    backgroundColor: (this.props.backColor)
                        ? this.props.backColor : appColor.navDefaultColor,
                    height: (Constant.isIOS) && height || 54,
                    paddingTop: (Constant.isIOS) && (18 + this.props.top) || 0,
                    borderBottomWidth: 1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor
                }]}>

                    {/*<AppStatusBar barStyle={appColor.statusBarStyle}*/}
                    {/*              backColor={this.props.backColor || appColor.navDefaultColor}/>*/}

                    <Text style={[styles.titleText, {color: appColor.navTextColor}]}>{this.props.title}</Text>

                    <TouchableHighlight style={{position: 'absolute', top: (Constant.isIOS) && 30 || 10, right: 20}}
                                        onPress={this.props.onBackButtonPress}
                                        underlayColor={Constant.transparent}>
                        <Text
                            style={[styles.backText, {paddingTop: 10 + this.props.top, color: appColor.navTextColor}]}>
                            {this.props.type2}</Text>
                    </TouchableHighlight>
                </View>
                :
                <View style={[styles.mainView, {
                    backgroundColor:
                        (this.props.backColor) ? this.props.backColor : appColor.navDefaultColor,
                    height: (Constant.isIOS) && (this.props.detailText && height + 20 || height) || (this.props.detailText && 54 + 20 || 54),
                    paddingTop: (Constant.isIOS) && (18 + this.props.top) || 0,
                    borderBottomWidth: 1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor
                }]}>
                    {/*<AppStatusBar barStyle={appColor.statusBarStyle}*/}
                    {/*              backColor={this.props.backColor || appColor.navDefaultColor}/>*/}
                    {/*<StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>*/}

                    <TouchableHighlight onPress={this.props.onBackButtonPress}
                                        underlayColor={Constant.transparent}>
                        <View style={[styles.backIcon, {marginTop: this.props.detailText && -20 || 0}]}>
                            {
                                this.props.backText &&
                                <Text style={[styles.textTitle, {
                                    color: appColor.navDoneBtn,
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }]}>
                                    {this.props.backText}
                                </Text>
                                ||
                                <Image resizeMode="contain"
                                       style={{
                                           height: this.props.backIcon && this.props.backIcon.size || 20,
                                           width: this.props.backIcon && this.props.backIcon.size || 20,
                                           marginLeft: 15, tintColor: appColor.navBackArrow
                                       }}
                                       source={{uri: this.props.backIcon && this.props.backIcon.name || 'back_button_rounded'}}/>
                            }
                        </View>
                    </TouchableHighlight>

                    <View style={{
                        flex: 1, justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text
                            style={[styles.titleTextProfession, {
                                color: appColor.navTextColor,
                                paddingTop: 10
                            }]}>
                            {this.props.title}
                        </Text>
                        {
                            !!remainingTime && (remainingTime !== -1) &&
                            <View style={{flexDirection: 'row'}}>
                                {!!(remainingTime !== -1) &&
                                <CountDown
                                    size={30}
                                    style={{height: 20}}
                                    until={remainingTime}
                                    onFinish={() => this.props.onEndSession()}
                                    onChange={(time) => this.onTimerChange(time)}
                                    digitStyle={{
                                        backgroundColor: Constant.transparent,
                                        borderWidth: 0,
                                        borderColor: Constant.transparent,
                                        borderRadius: 5,
                                        marginHorizontal: -27,
                                        marginVertical: -28,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    digitTxtStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700,
                                        fontWeight: 'normal'
                                    }}
                                    separatorStyle={{
                                        color: appColor.navDetailTextColor, fontSize: 12,
                                        alignSelf: 'center',
                                        fontFamily: Constant.font700
                                    }}
                                    timeToShow={timerType == 's' && ['M', 'S'] || ['M']}
                                    timeLabels={{m: null, s: null}}
                                    showSeparator
                                />
                                }
                                <Text
                                    style={[textRemaining, {color: appColor.navDetailTextColor}]}>{timerType == 's' ? strLocale("professionalSupport.remaining") : strLocale("professionalSupport.minutesremaining")}</Text>
                            </View>
                        }
                        {
                            !!remainingTime && (remainingTime === -1) &&
                            <View style={{flexDirection: 'row', top: 3}}>
                                <Text style={[textRemaining, {
                                    color: appColor.navDetailTextColor,
                                    height: 20
                                }]}>{strLocale("professionalSupport.Preparing to chat")}</Text>
                            </View>
                        }
                    </View>

                    {
                        (this.props.rightButton) &&
                        <Text style={[styles.textTitle, {color: appColor.navDoneBtn}]}
                              onPress={this.props.onRightBtnClick}>
                            {this.props.rightButton}
                        </Text>
                        ||
                        <Text style={[styles.textTitle, {color: Constant.transparent}]}>{"Save"}</Text>
                    }
                </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainView2: {
        flexDirection: 'row',
    },
    backIcon: {
        paddingLeft: 8,
        paddingRight: 40,
        paddingTop: 6,
        paddingBottom: 5,
    },
    titleText: {
        alignSelf: 'center',
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        flex: 1,
        fontFamily: Constant.font700,
    },
    backText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: Constant.font500,
    },
    textTitle: {
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'right',
        fontSize: 14,
        fontFamily: Constant.font700,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    textRemaining: {
        paddingLeft: 2,
        fontSize: 12,
        alignSelf: 'center',
        fontFamily: Constant.font700,
        fontWeight: 'normal',
    },
    titleTextProfession: {
        alignSelf: 'center',
        fontSize: 14,
        color: '#FFF',
        fontFamily: Constant.font700,
        marginBottom: 6,
        paddingTop: 0,
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {})(NavigationBar);
