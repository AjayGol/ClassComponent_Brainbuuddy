import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../helper/constant';
import {strLocale} from "locale";

export default class NotificationBox extends React.PureComponent {

    render() {
        return (
            <View style={{flex:1, width:"100%"}}>
                <Text style={{color:'#fff', fontSize: 15, fontFamily: Constant.font500, textAlign:'center'}}>
                    {strLocale(this.props.title)}
                </Text>
                <View style={{flexDirection: 'row', alignItems:'center', marginTop:12, flex:1}}>
                    <Image source={{uri:'complete_large_tick_icon'}}
                           style={{height:26, width:26, marginRight: 14}}
                           resizeMode={"contain"}/>

                    <View style={{flex:1}}>
                        <View style={{flexDirection:'row',height:26, backgroundColor:'rgb(51,101,117)', alignItems:'center',
                            borderTopLeftRadius:10, borderTopRightRadius:10}}>
                            <Image source={{uri:'notification_icon'}}
                                   style={{height:15, width:15, marginLeft:10}}
                                   resizeMode={"contain"}/>
                            <Text style={{color:'#a1b2b9', fontSize: 12, fontFamily: Constant.font300, marginLeft:10, flex:1}}>
                                {strLocale("BeefUp")}
                            </Text>
                            <Text style={{color:'#a1b2b9', fontSize: 12, fontFamily: Constant.font300, marginRight:12}}>
                                {strLocale("Now")}
                            </Text>
                        </View>
                        <View style={{justifyContent:'center', backgroundColor:'rgb(26,82,101)',
                             borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingTop:12,paddingLeft:16,paddingBottom:12,
                              paddingRight: 16}}>
                            <Text style={{color:'#dfe3e6', fontSize: 13, fontFamily: Constant.font500,lineHeight:21,
                                backgroundColor:'transparent'}}>
                                {this.props.description}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}