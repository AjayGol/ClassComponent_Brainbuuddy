import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../helper/constant';

export default class SmallButton extends React.PureComponent {

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}
                              style={[styles.btnLogin,{backgroundColor: this.props.backColor}]}>
                <View>
                    <Text style={[styles.btnFont,{color: this.props.textColor}]}>
                        {this.props.titleText}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin:{
        alignSelf: 'center',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgb(236,147,18)',
        height: 32
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font500,
        color:'#FFF'
    }
});