import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../helper/constant';
import TochableView from '../../../commonComponent/touchableView';
import {strLocale} from "locale";

export default CommunityRow = (props) => {
    const {
        appColor,isDot,isHeart,minusWidth, inviteIcon,
        index,item,HEADER_MAX_HEIGHT,
        getSubTitle,getTitle,
        onInviteAcceptDecline,
        onTeamActivityPress,onActivityPress} = props;
    const {rowView,viewOuter,detailsText,titleText} = styles;
    return(
        <View style={[rowView,{
            backgroundColor: isDot && appColor.teamDetailsRow || appColor.scrollableViewBack}]}>
            {
                (item.type == 'received') &&
                <View style={[viewOuter,{backgroundColor: isDot && appColor.teamDetailsRow || appColor.scrollableViewBack}]}>
                    <Image source={{uri: inviteIcon}}
                           style={{width: 18, height: 14,marginBottom:52}}/>
                    <View style={{paddingRight: 20, marginLeft: 14,}}>
                        <Text style={[titleText, {color: appColor.defaultFont}]}>
                            {getTitle(item)}
                        </Text>
                        <Text style={[detailsText, {
                            color: appColor.profileColor,
                            width: Constant.screenWidth - minusWidth,
                            maxWidth: 600}]}
                              numberOfLines={2}
                              ellipsizeMode={'tail'}>
                            {getSubTitle(item)}
                        </Text>
                        {
                            (item.type == 'received') &&
                            <View style={{flexDirection:'row',marginBottom:2}}>
                                <TouchableOpacity style={[styles.btnInvite,{backgroundColor:'rgb(90,194,188)'}]}
                                                  onPress={()=>onInviteAcceptDecline(item,'accept')}>
                                    <Text style={styles.btnFont} numberOfLines={1}>
                                        {strLocale('Accept')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnInvite,{backgroundColor:'rgb(242,103,71)',marginLeft:6}]}
                                                  onPress={()=>onInviteAcceptDecline(item,'decline')}>
                                    <Text style={styles.btnFont} numberOfLines={1}>
                                        {strLocale('Decline')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
                ||
                (item.type == 'sent' || item.type === 'received_team_invite') &&
                <TochableView onPress={() => onTeamActivityPress(item)}
                              pressInColor={appColor.pressInMoreRow}
                              backColor={appColor.moreRow}>
                    <View style={[viewOuter,{backgroundColor: isDot && appColor.teamDetailsRow || appColor.scrollableViewBack}]}>
                        <Image source={{uri: inviteIcon}}
                               style={{width: 18, height: 14}}/>
                        <View style={{paddingRight: 20, marginLeft: 14,}}>
                            <Text style={[titleText, {color: appColor.defaultFont}]}>
                                {getTitle(item)}
                            </Text>
                            <Text style={[detailsText, {
                                color: appColor.profileColor,
                                width: Constant.screenWidth - minusWidth,
                                maxWidth: 600}]}
                                  numberOfLines={2}
                                  ellipsizeMode={'tail'}>
                                {getSubTitle(item)}
                            </Text>
                        </View>
                    </View>
                </TochableView>
                ||
                <TochableView onPress={() => onActivityPress(item)}
                              pressInColor={appColor.pressInMoreRow}
                              backColor={appColor.moreRow}>
                    <View style={[viewOuter,{backgroundColor: isDot && appColor.teamDetailsRow || appColor.scrollableViewBack}]}>
                        <Image style={{height:19, width:19}}
                               resizeMode={'contain'}
                               source={{uri:(isHeart) && Constant.heart_full || Constant.comment_full}}/>

                        <View style={{paddingRight: 20, marginLeft: 14,}}>
                            <Text style={[titleText, {color: appColor.defaultFont}]}>
                                {getTitle(item)}
                            </Text>
                            <Text style={[detailsText, {
                                color: appColor.profileColor,
                                width: Constant.screenWidth - minusWidth,
                                maxWidth: 600}]}
                                  numberOfLines={2}
                                  ellipsizeMode={'tail'}>
                                {getSubTitle(item)}
                            </Text>
                        </View>
                    </View>
                </TochableView>
            }
            <View style={{
                backgroundColor: appColor.communitySeperator,
                height: 1,
                marginLeft: 20,
                marginRight: 20
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    rowView:{
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    viewOuter:{
        paddingLeft: 20, paddingRight: 20, paddingTop: 18, paddingBottom: 18,
        flexDirection: 'row', width: '100%', alignItems: 'center',
    },
    titleText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Constant.font700,
    },
    detailsText: {
        paddingTop: 8,
        fontSize: 12,
        fontFamily: Constant.font500,
        lineHeight: 18,
    },
    btnInvite:{
        marginTop:8,
        alignSelf: 'center',
        height:32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingRight:20,
        paddingLeft:20,
    },
    btnFont:{
        fontSize: 14,
        fontFamily: Constant.font700,
        color: '#fff'
    },
});