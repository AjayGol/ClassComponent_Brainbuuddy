import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../helper/constant';
import {strLocale} from "locale";

export default About = (props) => {
    const { isCurrentUser,memberDetail, appColor, onUpdateBiography, userId } = props;
    const isAbletoEdit = (userId && memberDetail) ? (userId === memberDetail.id) : isCurrentUser;
    return(
        <View style={[styles.container,{backgroundColor:appColor.scrollableViewBack}]}>
            {
                (memberDetail && (memberDetail.biography == null || memberDetail.biography == "")) &&
                <Text style={[styles.placeHolderText,{color:appColor.profileColor}]}>
                    {(isAbletoEdit) && strLocale("statistic.Tell the Brainbuddy community about yourself!") ||
                    strLocale("statistic.There's nothing here")}
                </Text> ||
                <View style={{padding:20, marginTop:5}}>
                    <Text style={[styles.bioText, {color:appColor.defaultFont}]}>
                        {memberDetail && memberDetail.biography || strLocale("statistic.There's nothing here")}
                    </Text>
                </View>
            }
            {
                (isAbletoEdit && memberDetail) &&
                <TouchableOpacity style={[styles.button,{backgroundColor:appColor.postButton}]}
                                  onPress={onUpdateBiography}>
                    <Text style={styles.buttonText}>
                        {(memberDetail && (memberDetail.biography == null || memberDetail.biography == "")) &&
                        strLocale("statistic.Add story") || strLocale("statistic.Edit")}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        height: 'auto',
        backgroundColor:Constant.backProgressBarColor,
        alignItems:'center',
        paddingBottom: 50,
    },
    placeHolderText:{
        marginTop:45,
        textAlign:'center',
        fontSize: 15,
        fontFamily: Constant.font500,
        maxWidth: 280,
        lineHeight:21
    },
    button:{
        height:32,
        marginTop:15,
        borderRadius: 16,
        justifyContent:'center',
        paddingRight:20,
        paddingLeft:20,
        backgroundColor:Constant.backColor
    },
    buttonText:{
        color: '#fff',
        fontSize: 12,
        fontFamily: Constant.font500,
    },
    bioText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        lineHeight:21
    },
});