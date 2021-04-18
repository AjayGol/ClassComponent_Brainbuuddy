import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated, Easing, ActivityIndicator
} from 'react-native';
import Constant from "../../helper/constant";

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: null
        }
        // this.scaleWidth = new Animated.Value(0);
        // this.scaleHeight = new Animated.Value(0);
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

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}
                              disabled={this.props.isDisable || false}
                              style={[styles.btnLogin, {backgroundColor: this.props.backColor},
                                  (this.props.otherStyle) ? this.props.otherStyle : {}]}
                              onLayout={(event) => {
                                  if (this.props.isCheckWidth){
                                      this.props.onEventChange(event.nativeEvent.layout && event.nativeEvent.layout.width);
                                  }
                              }}>

                <Text style={[styles.btnFont, {color: this.props.color},
                    (this.props.otherTextStyle) ? this.props.otherTextStyle : {}]}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
    },
    btnFont: {
        fontSize: 15,
        fontFamily: Constant.isIOS && Constant.font500 || Constant.font500,
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
