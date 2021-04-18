import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import Constant from '../../../../helper/constant';
import {getAvatar,capitalizeFistLatter} from '../../../../helper/appHelper';
import CleanDaysView from '../../../commonComponent/cleanButton';
import {strLocale} from "locale";

const btnColor = {
    'In your team': '#74bfba',
    'Invite to team': '#a6afb6',
    'Mute User': '#a3b0b6',
    'Unmute User': '#a3b0b6',
    'Cancel invite': '#a3b0b6',
}

export default communityProfileTop = (props) => {
    let title = '';
    let title2 = '';
    if (props.userData.porn_free_days.total !== 0) {
        title = `${props.userData.porn_free_days.total}`
        title2 = ' ' + strLocale("team.porn free days")
    }else{
        if (props.userData.isLoading === false){
            title = `0`
            title2 = ' ' + strLocale("team.porn free days")
        }
    }

    return (
        <View style={[{
            marginTop: 5, alignItems: 'flex-start', backgroundColor: props.appColor.appBackground,
            marginHorizontal: 20, paddingVertical: 15, paddingHorizontal: 15
        }, Constant.shadow2]}>
            <View style={{flexDirection: 'row', marginRight: 65}}>
                <Image resizeMode="contain" style={{height: 70, width: 70}}
                       source={{uri: `avatar_lge_${props.userData.avatar_id}`}}/>
                <View style={{marginLeft: 15, justifyContent: 'center',}}>
                    {
                        props.userData.name === '' && title === '' &&
                        <ActivityIndicator
                            style={{color: Constant.newTabSelected, marginTop: 0}}
                        />
                        ||
                        <View>
                            <Text style={[{
                                color: '#FFF',
                                fontSize: 18,
                                marginBottom: 5,
                                fontFamily: Constant.font500
                            },
                                {color: props.appColor.titleMain}]}
                                  numberOfLines={1} minimumFontScale={0.3} adjustsFontSizeToFit={true}>
                                {props.userData.name && capitalizeFistLatter(props.userData.name.toLowerCase()) || ''}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[{
                                    color: 'white',
                                    fontSize: 15,
                                    fontFamily: Constant.font700,
                                    backgroundColor: title === '' && Constant.transparent || Constant.newTabSelected,
                                    paddingVertical: 3, paddingHorizontal: 5,
                                }]}>
                                    {title}
                                </Text>

                                <Text style={[{
                                    color: Constant.newTabSelected,
                                    fontSize: 15,
                                    fontFamily: Constant.font700,
                                    paddingVertical: 3, paddingHorizontal: 3,
                                }]}>
                                    {title2}
                                </Text>

                            </View>
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        paddingTop: 26,
        width: 312,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    innerView: {
        width: 104,
        alignItems: 'center',
    },
    titleText: {
        color: '#a3b0b6',
        fontSize: 12,
        fontFamily: Constant.font500,
        textAlign: 'center'

    },
    valText: {
        color: '#FFFFFF',
        paddingTop: 9,
        fontSize: 24,
        fontFamily: Constant.font700,
        textAlign: 'center'
    },
    btnInvite: {
        marginTop: 8,
        alignSelf: 'center',
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingRight: 20,
        paddingLeft: 20,
        minWidth: 120
    },
    btnFont: {
        fontSize: 12,
        fontFamily: Constant.font700,
    },
});

/*


            {
                !props.isCurrentUser &&
                <TouchableOpacity style={[styles.btnInvite,{backgroundColor:props.appColor.communityBtn}]}
                                  onPress={props.onInviteMember}>
                    <View>
                        <Text style={[styles.btnFont,{color:btnColor[props.buttonLabel]}]} numberOfLines={1}>
                            {strLocale("statistic."+props.buttonLabel)}
                        </Text>
                    </View>
                </TouchableOpacity>
            }

            <View style={styles.mainView}>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>
                        {strLocale("statistic.Current streak")}
                    </Text>
                    <Text style={[styles.valText,{color:props.appColor.themeFont}]}>
                        {
                            props.isCurrentUser && props.currentStreak+"" || props.userData.porn_free_days.current_streak+""
                        }
                    </Text>
                </View>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>
                        {strLocale("statistic.Best streak")}
                    </Text>
                    <Text style={[styles.valText,{color:props.appColor.themeFont}]}>
                        {props.userData.porn_free_days.longest_streak+"" || "0"}</Text>
                </View>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>
                        {strLocale("statistic.Hearts")}
                    </Text>
                    <Text style={[styles.valText,{color:props.appColor.themeFont}]}>
                        {props.userData.hearts_count || "0"}</Text>
                </View>
            </View>
 */
