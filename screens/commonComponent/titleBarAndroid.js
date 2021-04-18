import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../helper/constant';
import { connect } from 'react-redux';
import AppStatusBar from '../commonComponent/statusBar';

class NavigationTitleBar extends Component {

    render() {
        const {mainView, titleText} = styles;
        return (
            <View style={[mainView, {backgroundColor: this.props.backColor}]}>
                <AppStatusBar backColor={this.props.backColor}/>
                <Text style={[titleText, {color: this.props.textColor || '#FFF'}]}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        width:'100%',
        backgroundColor:Constant.backColor,
        justifyContent:'center',
        alignItems:'center',
        height:54
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        marginTop: 0
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {

})(NavigationTitleBar);