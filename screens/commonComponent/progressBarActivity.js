import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import Animated from "react-native-reanimated";

export default  class ProgressBar extends React.PureComponent {

    render() {
        return (
            <View style={[styles.mainView, this.props.mainStyle || {}]}>
                <View style={[{backgroundColor: this.props.otherColor }, styles.otherBar]}/>
                <Animated.View style={[{ width: this.props.progressBarAnimation, backgroundColor: this.props.fillBarColor},
                    styles.fillBar, this.props.progressStyle || {}]}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        flexDirection: 'row',
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 0,
        width: '100%',
        overflow:'hidden',
        height: 20
    },
    fillBar:{
        borderRadius: 10,
        padding:5
    },
    otherBar:{
        borderRadius: 10,
        flex: 1,
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        opacity: 1.0
    }
});
