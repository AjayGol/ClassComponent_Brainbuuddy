import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import Constant from '../../helper/constant';
import {strLocale} from "locale";

export default CleanDays = (props) => {
    return(
        <View style={[styles.btnLogin,{backgroundColor: Constant.lightGreen}]}>
            <View>
                <Text style={[styles.btnFont, {color: 'white'}]}
                      numberOfLines={1}>
                    {
                        (props.total_p_clean_days ===1) &&
                        strLocale("today.day DAY CLEAN",{day:props.total_p_clean_days})
                        ||
                        strLocale("today.days DAYS CLEAN",{day:props.total_p_clean_days})
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnLogin:{
        alignSelf: 'center',
        height:32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingRight:20,
        paddingLeft:20,
        minWidth:120
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font700,
    },
});