import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../helper/constant';

export default class NoData extends React.PureComponent {

    render() {
        const { outerView, textMessage} = styles;
        return (
            <View style={outerView}>
                <Text style={textMessage}>
                    {this.props.placeHolderText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
    },
    textMessage:{
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#a9b6be',
        alignSelf:'center',
        textAlign: 'center',
        lineHeight: 20
    }
});