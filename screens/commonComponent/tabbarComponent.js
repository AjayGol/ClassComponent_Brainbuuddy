import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableHighlight
} from 'react-native';

import Constant from '../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default class Tabbar extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            selectedTab: this.props.selectedTab,
        }
    }

    changeTabbar = (tabFlag) => {
        this.props.changeTab(tabFlag);
        if(tabFlag == 0){
            this.refs.view1.fadeInRight(300);
        }else{
            this.refs.view2.fadeInLeft(300);
        }
    };

    render() {
        return (
            <View style={ styles.mainTabView }>
                <Animatable.View ref="view1" style={ styles.amimatedView }>
                    <View style={[{ backgroundColor: (this.props.selectedTab == 0) ? Constant.lightBlueColor :  Constant.transparent},
                        styles.tabView ]}>
                        <TouchableHighlight onPress={ ()=> this.changeTabbar(0) }
                                            underlayColor={Constant.transparent}>
                            <Text style={styles.tabbarText}>
                                { this.props.titleTab1 }
                            </Text>
                        </TouchableHighlight>
                    </View>
                </Animatable.View>

                <Animatable.View ref="view2" style={ styles.amimatedView }>
                    <View style={[{ backgroundColor: (this.props.selectedTab == 1) ? Constant.lightBlueColor :  Constant.transparent},
                        styles.tabView ]}>
                        <TouchableHighlight onPress={() => this.changeTabbar(1) }
                                            underlayColor={Constant.transparent}>
                            <Text style={styles.tabbarText}>
                                { this.props.titleTab2 }
                            </Text>
                        </TouchableHighlight>
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainTabView: {
        backgroundColor:'rgba(28,102,126, 0.8)',
        borderRadius: 50,
        marginBottom: 0,
        flexDirection: 'row',
        height:40,
        width:'86%',
        padding: 5,
        alignSelf:'center'
    },
    tabView:{
        paddingTop: 7,
        paddingBottom:7,
        justifyContent: 'center',
        borderRadius: 50
    },
    tabbarText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: Constant.font500,
    },
    amimatedView:{
        flex:1,
        width:'43%',
        height:30
    }
});
