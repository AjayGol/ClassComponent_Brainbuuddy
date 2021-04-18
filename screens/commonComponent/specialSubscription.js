import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Text,
    TouchableOpacity,
    Modal
} from 'react-native';
import Constant from '../../helper/constant';
import BtnSubscribe from './btnSubscribe';
import TermsAndCondition from '../account/welcome/getStarted/termsAndConditions/termsAndConditions';
import Spinner from './initialScreen';

export default class SpecialSubscription extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modelTerms: false,
        };
    }

    onCloseBtnPress = () => {
        this.setState({
            modelTerms: false
        })
    }

    onShowTerm = () => {
        this.setState({
            modelTerms: true
        })
    }

    ////"Don't need a year of Brainbuddy? Go monthly instead! " - for yearly
    render() {
        const {container} = styles;
        return (
            <View style={[container, {paddingTop: Constant.isIOS &&
                this.props.safeAreaInsetsData.top }]}>

                <View style={{flexDirection: 'row',paddingTop: 20}}>
                    <View style={{paddingLeft: 15,paddingRight: 20,paddingTop: 6,paddingBottom: 5,}}>
                        <TouchableHighlight onPress={this.props.onClosePress}
                                            underlayColor={Constant.transparent}>
                            <Image resizeMode="contain"
                                   style={{height: 16,width: 16,marginVertical:10}}
                                   source={{uri:'close_x_white'}}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:15, fontFamily:Constant.font700, color:'#fff'}}>Special offer</Text>
                    </View>
                    <View style={{paddingLeft: 15,paddingRight: 20,paddingTop: 6,paddingBottom: 5,}}>
                        <Image resizeMode="contain"
                               style={{height: 16,width: 16,marginVertical:10,opacity:0,tintColor:'transparent'}}
                               source={{uri:'close_x_white'}}/>
                    </View>
                </View>


                <View style={{width:Constant.screenWidth*0.8, alignSelf:'center',justifyContent:"center",
                    alignItems:'center',height:Constant.screenHeight,
                    bottom:Constant.screenHeight*0.265,position:'absolute'}}>
                    <Text style={{fontSize:24, fontFamily:Constant.font700, color:'#fff',
                        lineHeight:36,textAlign:'center'}}>
                        {"The time for action is now. Become who you want to be."}
                    </Text>
                </View>

                <View style={{width:Constant.screenWidth*0.8, alignSelf:'center',justifyContent:"center",
                    alignItems:'center', height:Constant.screenHeight,top:Constant.screenHeight*0.06,
                    position:'absolute'}}>

                    <Image source={{uri:'subscribe_stars'}}
                           style={{width:110, height:18}} resizeMode={"contain"}/>

                    <Text style={{marginTop:15,fontSize:15, fontFamily: Constant.font700, color:'#e2ecf7',
                        lineHeight:21,textAlign:'center'}}>
                        {"\"100 days today! My confidence is through the roof, " +
                        "I just started a new job and life is great. This is who I'm meant to be.\""}
                    </Text>

                    <Image source={{uri:'subscribe_stars'}}
                           style={{width:110, height:18, marginTop:Constant.screenHeight*0.042}} resizeMode={"contain"}/>

                    <Text style={{marginTop:15,fontSize:15, fontFamily: Constant.font700, color:'#e2ecf7',
                        lineHeight:21,textAlign:'center'}}>
                        {"\"I've wasted years to porn and tried to quit countless times." +
                        " This app is the only thing that has actually worked. Thank you.\""}
                    </Text>

                </View>

                <View style={[styles.bottomVWBack,{height: Constant.isIOS && 124+this.props.safeAreaInsetsData.bottom || 124}]}>
                    <BtnSubscribe onShowTerm={this.onShowTerm}
                                  priceText={this.props.priceText}
                                  onStartPress={this.props.onStartPress}
                                  productKey={"beefup_monthly"}
                                  isFreeTrial={this.props.isFreeTrial}
                                  backColor={'rgb(254,199,8)'}/>
                </View>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modelTerms}>
                    <TermsAndCondition onClosePress={this.onCloseBtnPress}
                                       safeAreaInsetsData={this.props.safeAreaInsetsData}/>
                </Modal>


                {
                    (!this.props.isBtnClikable) &&
                    <Spinner visible={true}
                             backColor="rgba(0,0,0,0.4)"/> || null
                }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.lightBlueColor,
    },
    bottomVWBack: {
        bottom:0,
        left: 0,
        right: 0,
        position: 'absolute',
        paddingTop:10
    },
});
