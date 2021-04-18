import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../helper/constant'

export default class SubTitleComponent extends React.PureComponent {

    render() {
        return (
            <View style={styles.titleView}>
                <Text style={[styles.titleText,{color: this.props.color || "#FFF" }]}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleView:{
        paddingTop:10,
        paddingBottom: 10,
        justifyContent:'center',
        alignItems:'center',
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font700,
    }
});