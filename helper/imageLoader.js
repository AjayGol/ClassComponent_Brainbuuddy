
import React, { Component } from 'react';
import { ActivityIndicator,Text,
    View, Image }
    from 'react-native';
import Constant from "./constant";

export default class ImgLoader extends React.PureComponent{

    render(){
        return( (this.props.visible) ?
                <View style={{ position:'absolute', backgroundColor: '#FFF',
                    alignItems:'center', justifyContent:'center', flex:1, top:0, left: 0, right: 0, bottom: 0}}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                        color={Constant.newTabSelected}
                    />
                </View>
                : null
        );
    }
}

