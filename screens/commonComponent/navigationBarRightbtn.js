import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../helper/constant';
import {ThemeContext} from 'AppTheme';

export default  class NavigationBar extends React.PureComponent {
    static contextType = ThemeContext;
    render() {
        let appColor = Constant[this.context];
        return (
            <View style={[styles.mainView,{height: (Constant.isIOS) && 70+this.props.top || 54,
             paddingTop:(Constant.isIOS) && 18+this.props.top || 0,
                backgroundColor: appColor.navDefaultColor, borderBottomWidth:1, borderBottomColor: appColor.navBorderColor}]}>
                <Text style={[styles.textTitle, {color: Constant.transparent}]}>
                    {this.props.rightButton}
                </Text>
                <Text style={[styles.titleText, {color:appColor.navTextColor}]}>{this.props.title}</Text>
                <TouchableHighlight onPress={this.props.onRightButtonPress}
                                    underlayColor={Constant.transparent}>
                    <Text style={[styles.textTitle,{color:appColor.navDoneBtn}]}>
                        {this.props.rightButton}
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        flexDirection:'row',
        alignItems: 'center',
        height: 70,
        paddingTop: 18,
        backgroundColor: Constant.backColor
    },
    titleText:{
        alignSelf: 'center',
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        flex:1,
        fontFamily: Constant.font700,
    },
    textTitle:{
        marginLeft:10,
        marginRight:8,
        padding:10,
        color: '#a7b0b6',
        textAlign:'right',
        fontSize: 14,
        fontFamily: Constant.font700,
    }
});