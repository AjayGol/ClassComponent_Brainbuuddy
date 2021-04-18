import React, {Component} from 'react';
import {
    ActivityIndicator,
    View, Image, StatusBar, StyleSheet, NativeModules, Text, Platform, SafeAreaView
} from 'react-native';
import Constant from '../../helper/constant';
import AppStatusBar from './statusBar';

const {StatusBarManager} = NativeModules;
import DeviceInfo from "react-native-device-info";

export default class InitialScreen extends React.Component {

    render() {

        let topNavigation = 20;
        let value = parseFloat(DeviceInfo.getSystemVersion())
        if (5.1 >= value) {
            topNavigation = -10;
        }

        return (
            <SafeAreaView style={styles.container}>
                <AppStatusBar backColor={Constant.backProgressBarColor}
                              hidden={false}/>
                {
                    !!(Constant.isIOS) &&
                    <Image source={{uri: 'splash_icon'}}
                           resizeMode={Constant.isIOS && 'contain' || 'contain'}
                           style={[styles.icon, {marginTop: Constant.isANDROID && topNavigation || -Constant.screenHeight * 0.6}]}/>
                }
                {
                    !!(Constant.isANDROID) &&
                    <Image source={{uri: 'splash_icon'}}
                           resizeMode={Constant.isIOS && 'contain' || 'contain'}
                           style={[styles.icon, {marginTop: topNavigation}]}/>
                }
                {
                    !!(Constant.isIOS) &&
                    <View style={{
                        position: 'absolute',
                        left: 0, right: 0,
                    }}>
                        <Text style={{color: '#FFF',
                            fontSize: 30,
                            marginTop: Constant.screenHeight * 0.8,
                            fontFamily: Platform.OS === 'ios' && 'System' || Constant.font500,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {"BeefUp"}
                        </Text>
                    </View>
                }
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        height: Constant.isIOS && 100 || 150,
        width: Constant.isIOS && 100 || 150,
    },
    indicator: {
        backgroundColor: 'transparent', position: 'absolute',
        top: Constant.screenHeight * 0.92
    }
});

/*
<View style={styles.container}>
                <AppStatusBar backColor={Constant.backProgressBarColor}
                              hidden={false}/>
                <View style={{
                    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <View style={{flexDirection: 'row', marginTop: -50}}>
                        <Image resizeMode="contain" style={{width: 50, height: 50}}
                               source={{uri: 'splash_icon'}}/>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Constant.font700,
                            color: "white",
                            marginTop: 10
                        }}>
                            {"Beefup"}
                        </Text>
                    </View>

                    <Text style={{
                        fontSize: 40,
                        fontFamily: Constant.font700,
                        color: "white",
                        marginTop: 50,
                        textAlign: 'center'
                    }}>
                        {"Are you\naddicted to"}
                        <Text style={{
                            fontFamily: Constant.font700,
                            color: "#FFFF00",
                        }}>
                            {"\nPorn?"}
                        </Text>
                    </Text>
                </View>
            </View>
 */
