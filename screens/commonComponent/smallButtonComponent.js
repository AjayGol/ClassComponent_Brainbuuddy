import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../helper/constant';

export default class smallButtonComponent extends React.PureComponent {

    render() {

        return (
            <TouchableOpacity onPress={this.props.onPress}
                                style={[styles.btnLogin,{backgroundColor: this.props.backColor},
                                 (this.props.otherStyle) ? this.props.otherStyle: {},
                                    (this.props.shadow) ? this.props.shadow: {},]}>
                <View>
                    <Text style={[styles.btnFont, {color: this.props.color}]}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin:{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,

    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font500,
        paddingHorizontal: 8
    }
});
