import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated, Easing, ActivityIndicator, AsyncStorage, Image
} from 'react-native';
import Constant from '../../helper/constant';
import LinearGradient from "react-native-linear-gradient";
import {cloneDeep} from "lodash";

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: null,
            isDisable: props.isDisable,
        }
        this.animatedValue = new Animated.Value(0);
        this.animationStart = props.isActivityIndicator || false;

        this.position = new Animated.Value(0);
        this.colorChange = new Animated.Value(0);

        if (props.startIndicatorDirect){
            setTimeout(() => {
                this.animateBackgroundColor()
            }, 100)
        }
        // this.scaleWidth = new Animated.Value(0);
        // this.scaleHeight = new Animated.Value(0);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActivityIndicator === true) {
            this.animationStart = true;
            this.animateBackgroundColor()
        } else {
            this.animationStart = false;
        }

        if (nextProps.isDisable === false) {
            this.onPressButton()
        }
    }

    onPressButton = (obj, keyValue) => {
        try {
            Animated.spring(
                this.position,
                {
                    toValue: Constant.screenWidth - Constant.screenWidth * 0.35 - 4
                }
            ).start(() => {

            });

            Animated.spring(
                this.colorChange,
                {
                    toValue: 1
                }
            ).start();
        }catch (e) {

        }
    }


    // onPressIn = () => {
    //     if (this.state.event) {
    //         let width = this.state.event.width - (this.state.event.width * 0.1);
    //         let height = this.state.event.height - (this.state.event.height * 0.1);
    //         Animated.parallel([
    //             Animated.timing(
    //                 this.scaleWidth,
    //                 {
    //                     toValue: 270,
    //                     duration: 80,
    //                     easing: Easing.easeOut
    //                 }
    //             ),
    //             Animated.timing(
    //                 this.scaleHeight,
    //                 {
    //                     toValue: 54,
    //                     duration: 80,
    //                     easing: Easing.easeOut
    //                 })]).start()
    //     }
    // }
    //
    // onPressOut = () => {
    //     if (this.state.event) {
    //         Animated.parallel([
    //             Animated.timing(
    //                 this.scaleWidth,
    //                 {
    //                     toValue: this.state.event.width,
    //                     duration: 80,
    //                     easing: Easing.easeOut
    //                 }
    //             ),
    //             Animated.timing(
    //                 this.scaleHeight,
    //                 {
    //                     toValue: this.state.event.height,
    //                     duration: 80,
    //                     easing: Easing.easeOut
    //                 })]).start(() => {
    //             this.props.onPress();
    //         })
    //     } else {
    //         this.props.onPress();
    //     }
    // }
    //
    // getLayout = (event) => {
    //     if (this.scaleWidth._value == 0) {
    //         this.setState({
    //             event: event
    //         });
    //         Animated.parallel([
    //             Animated.timing(
    //                 this.scaleWidth,
    //                 {
    //                     toValue: event.width,
    //                     duration: 0,
    //                      easing: Easing.easeOut
    //                 }
    //             ),
    //             Animated.timing(
    //                 this.scaleHeight,
    //                 {
    //                     toValue: event.height,
    //                     duration: 0,
    //                     easing: Easing.easeOut
    //                 })]).start()
    //     }
    // }

    animateBackgroundColor = () => {
        this.animatedValue.setValue(0);
        if (this.animationStart === true) {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 4000
                }
            ).start(() => {
                this.animateBackgroundColor()
            });
        }
    }

    render() {
        const boxInterpolation = this.colorChange.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.color, "white"]
        })

        if ((this.props.isShadow && this.props.isShadow === true)) {
            return (
                <TouchableOpacity onPress={this.props.onPress}
                                  disabled={this.props.isDisable || false}
                                  style={[styles.btnLogin, {overflow: 'hidden'},
                                      (this.props.otherStyle) ? this.props.otherStyle : {}]}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    colors={['#4568dc', '#b06ab3']}
                                    locations={[0, 1]} style={{
                        width: '100%',
                        borderRadius: 10,
                        flex: 1,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {
                            (this.props.isActivityIndicator) &&
                            <ActivityIndicator color={"#FFF"}/>
                            ||
                            <View>
                                <Text style={[styles.btnFont, {color: this.props.color},
                                    (this.props.otherTextStyle) ? this.props.otherTextStyle : {}]}>
                                    {this.props.title}
                                </Text>
                            </View>
                        }
                    </LinearGradient>
                </TouchableOpacity>
            )
        }

        const backgroundColorVar = this.animatedValue.interpolate(
            {
                inputRange: [0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                outputRange: ['#1D977C', '#34CA69', '#3999DE', '#3999DE', '#9A5CB8', '#34495F',
                    '#F0C200', '#E67E11', '#E74D3B', '#92A2A2', '#03C8A8', '#1D977C']
            });


        return (
            <TouchableOpacity onPress={this.props.onPress}
                              disabled={this.props.isDisable || false}
                              style={[styles.btnLogin, {backgroundColor: this.props.backColor},
                                  (this.props.otherStyle) ? this.props.otherStyle : {}]}>
                <View style={[{
                    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
                    height: 45, alignItems: 'center'
                }]}>
                    <Animated.View style={{height: 45, width: this.position}}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            // colors={['#647DEE', '#7F53AC']}
                                        colors={['#667eea', '#764ba2']}
                            // colors={['#6a3093', '#8637DB']}
                                        locations={[0, 1]} style={{
                            height: 45,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                        }}>

                        </LinearGradient>
                    </Animated.View>
                </View>

                {
                    <View style={{
                        flex: 1, width: '100%',
                        justifyContent: 'center'
                    }}>
                        {
                            !!this.props.gradient &&
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={[this.props.gradient[0], this.props.gradient[1]]}
                                            locations={[0, 1]} style={{
                                width: '100%',
                                flexDirection: 'row',
                                height: '100%',
                                justifyContent: 'center',
                                paddingTop: 14
                            }}>
                                <Text style={[styles.btnFont, {textAlign: 'center', width: '100%', color: 'white'},
                                    (this.props.otherTextStyle) ? this.props.otherTextStyle : {}]}>
                                    {this.props.title}
                                </Text>
                            </LinearGradient>
                            ||
                            <View style={{justifyContent: 'center'}}>
                                {
                                    this.props.isActivityIndicator &&
                                    <Animated.View style={[{
                                        position: 'absolute',
                                        right: 0, bottom: -15, left: 0, height: 2,
                                        backgroundColor: backgroundColorVar,
                                        borderRadius: 10,
                                    }, (this.props.animationStyle) ? this.props.animationStyle : {}]}>
                                    </Animated.View>
                                }

                                {
                                    (this.props.isActivityIndicatorNew) &&
                                    <ActivityIndicator color={"#FFF"}/>
                                    ||
                                    <Animated.Text style={[styles.btnFont, {
                                        color: boxInterpolation,
                                        textAlign: 'center',
                                        paddingBottom: 0,
                                    },
                                        (this.props.otherTextStyle) ? this.props.otherTextStyle : {}]}>
                                        {this.props.title}
                                    </Animated.Text>
                                }


                                {/*<ActivityIndicator style={{position: 'absolute', top: 0, right: 10, bottom: 0}} color={'#6BA6EB'}/>*/}
                            </View>
                        }
                    </View>
                }

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin: {
        height: 50,
        marginTop: 30,
        borderColor: '#393A3E',
        borderWidth: 2,
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        width: Constant.screenWidth - Constant.screenWidth * 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        maxWidth: Constant.isiPAD && 400 || 350,
    },
    btnFont: {
        fontSize: 15,
        fontFamily: Constant.font500,
    }
});

// this.props.isAnimation &&
// <TouchableOpacity onPressIn={() => this.onPressIn()} onPressOut={() => {
//     this.onPressOut()}}>
//     <Animated.View onLayout={(event) => { this.props.isAnimation && this.getLayout(event.nativeEvent.layout) || {}}}
//                    style={[styles.btnLogin, {backgroundColor: this.props.backColor},
//                        (this.props.otherStyle) ? this.props.otherStyle : {}, this.state.event && {
//                            height: this.scaleHeight,
//                            width: this.scaleWidth
//                        }]}>
//         <Text style={[styles.btnFont, {color: this.props.color},
//             (this.props.otherTextStyle) ? this.props.otherTextStyle : {}]}>
//             {this.props.title}
//         </Text>
//     </Animated.View>
// </TouchableOpacity>
// ||
