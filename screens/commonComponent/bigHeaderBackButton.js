import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text,
    TouchableOpacity, Linking
} from 'react-native';
import Constant from '../../helper/constant';
import {ThemeContext} from 'AppTheme';

export default class BtnBackBigHeader extends React.PureComponent {
    static contextType = ThemeContext;

    render() {
        let appColor = Constant[this.context];
        if (this.props.mode){
            appColor = Constant["LIGHT"];
        }

        const {title} = this.props;
        const {mainText} = styles;
        return (
            <View style={{position: 'absolute', left: 0, top: 0}}>
                <View style={{marginTop: Constant.isIOS && (10 + this.props.safeAreaInsetsDefault.top) || 0 }}>
                </View>

                <TouchableHighlight onPress={this.props.onBackButtonPress}
                                    underlayColor={Constant.transparent}>
                    <View style={{marginLeft: 0, width: 50}}>
                        <Image source={{uri: 'icon_onlybackback'}}
                               style={{height: 70, width: 70}}/>

                        <Image source={{uri: 'icon_onlyback'}}
                               style={{height: 70, width: 70,  position: 'absolute', tintColor: '#666B80'}}/>

                    </View>
                </TouchableHighlight>
            </View>
        );
    }

}

const styles = StyleSheet.create({});
