import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../helper/constant';

export default class TopButton extends React.PureComponent {

    render() {
        return (
            <View style={{
                backgroundColor:Constant.backColor, height: 58,}}>
                <TouchableHighlight underlayColor={Constant.transparent}
                                    style={{ flex:1 }}
                                    onPress={() => this.props.onButtonPress(0)}>
                    <View style={{ flex:1,paddingTop: 32,
                        alignItems: 'center' }}>
                        <Image source={{uri:'icon_tab_arrow'}}
                               style={{height:12,width:18,opacity:0.5}}/>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleView:{
        padding:10,
        justifyContent:'center',
        alignItems:'center'
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font700,
    }
});