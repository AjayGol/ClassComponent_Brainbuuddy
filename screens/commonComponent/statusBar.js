import React, { Component } from 'react';
import {
    StatusBar,
} from 'react-native';
import Constant from '../../helper/constant';

export default class AppStatusBar extends Component {

    render() {
        if(Constant.isIOS)
            return null;
        return (
            <StatusBar hidden={(this.props.isHidden) && this.props.isHidden || false}
                       barStyle={this.props.barStyle || "light-content"}
                       backgroundColor={this.props.backColor||Constant.backColor}/>
        );
    }
}
