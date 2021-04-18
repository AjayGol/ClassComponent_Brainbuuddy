import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Animated, AsyncStorage, Image
} from 'react-native';
import Constant from '../../helper/constant';
import {EventRegister} from "react-native-event-listeners";
import {strLocale} from "locale";

const CustomAlert = (props) => {
    const {container,commonText,btnContainer,btnText} = styles;
    const {objData,onAlertClick, left, right, isSinglebtn, rightBtnStyle} = props;
    return(
        <View style={[container,Constant.isiPAD && {maxWidth:600,width:'100%'}]}>
            {
                objData.map((item,i)=>{
                    return(
                        <View key={i}>
                            <Text style={[commonText,{fontFamily: Constant.font700, fontSize: 16,marginTop: 18}]}>
                                {item.title}
                            </Text>

                            <Text style={[commonText,{fontFamily: Constant.font500,fontSize: 14, marginTop: 10}]}>
                                {item.description}
                            </Text>
                        </View>
                    )
                })
            }
            {
                isSinglebtn &&
                <View style={{margin:12,flexDirection:'row'}}>
                    <View style={{flex:1}}/>
                    <TouchableOpacity style={[btnContainer,{flex:1.5}]}
                                      onPress={()=>onAlertClick(left)}>
                        <Text style={btnText}>
                            {strLocale(left)}
                        </Text>
                    </TouchableOpacity>
                    <View style={{flex:1}}/>
                </View>
                ||
                <View style={{flexDirection:'row', margin:12}}>
                    <TouchableOpacity style={[btnContainer,{marginRight:5}]}
                                      onPress={()=>onAlertClick(left)}>
                        <Text style={btnText}>
                            {strLocale(left)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[btnContainer,{marginLeft:5},rightBtnStyle && rightBtnStyle]}
                                      onPress={()=>onAlertClick(right)}>
                        <Text style={btnText}>
                            {strLocale(right)}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default class ShowCustomAlert extends Component{

    constructor(props){
        super(props);
        this.state={
            //fadeAnim: new Animated.Value(0),
        };
        this.fadeAnim = new Animated.Value(0);
    }

    UNSAFE_componentWillMount () {
        Animated.timing(
            this.fadeAnim,
            {
                toValue: 1,
                duration: 200,
                delay:5
            }
        ).start();
    }

    onAlertClick = (title) => {
        this.hideAlert(title);
    }

    hideAlert = (title) => {
        Animated.timing(
            this.fadeAnim,
            {
                toValue: 0,
                duration: 100,
                delay:50
            }
        ).start(()=>{
            this.props.onAlertClick(title);
        })
    }

    render(){
        return(
            <Animated.View style={[styles.alertOuter,{opacity: this.fadeAnim},
                !!Constant.isiPAD && {alignItems:'center'}]}>
                <CustomAlert
                    rightBtnStyle={this.props.rightBtnStyle || null}
                    objData={this.props.objData}
                    left={this.props.left}
                    right={this.props.right}
                    onAlertClick={this.onAlertClick}
                    isSinglebtn={this.props.isSinglebtn}
                />
            </Animated.View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        marginLeft:20,
        marginRight:20,
        borderRadius:13,
        backgroundColor:Constant.violetColor
    },
    commonText:{
        width: "80%",alignSelf: 'center',textAlign: 'center',
        color:'#fff'
    },
    btnContainer:{
        height:35, borderRadius: 17.5, flex:1,alignItems:'center', justifyContent:'center',
        backgroundColor:Constant.darkVioletColor
    },
    btnText:{
        color:'#fff', fontFamily: Constant.font700,fontSize: 15
    },
    alertOuter:{
        top:0,bottom:0, left:0, right:0, position:'absolute',
        paddingHorizontal:20,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center',
        zIndex: 111111
    }
});