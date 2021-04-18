import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Keyboard,
    BackHandler,
    AsyncStorage,
    Linking, StatusBar, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Constant from '../../../../helper/constant';
import {UserEvent} from "../../../../helper/fabricHelper/Answers";
import {connect} from 'react-redux';
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";
import {capitalizeFistLatter} from "../../../../helper/appHelper";

class AboutMe extends Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);

        this.state = {
            gender: props.userDetails.gender,
            email: props.userDetails.email && props.userDetails.email || props.userEmail,
            firstName: props.userDetails.name,
            region: props.userDetails.region,
            teamID: props.userDetails.teamID,
            isLoading: false
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(props) {
        if (this.props.userDetails !== props.userDetails) {
            this.setState({
                gender: props.userDetails.gender,
                email: props.userDetails.email && props.userDetails.email || props.userEmail,
                firstName: props.userDetails.name,
                region: props.userDetails.region,
                teamID: props.userDetails.teamID,
            })
        }
    }

    UNSAFE_componentWillMount() {
        UserEvent.userTrackScreen("settingprofile start", "")
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        Keyboard.dismiss();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        UserEvent.userTrackScreen("settingprofile end", "")

    }


    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onTeamDetail = () => {
        if(this.state.isLoading === false){
            this.setState({
                isLoading: true
            });
            setTimeout(() => {
                this.setState({
                    isLoading: false
                });
            },2000)
            this.props.onTeamDetail();
        }
    }

    render() {
        let appColor = Constant[this.context];

        return (
            <View style={{flex: 1, backgroundColor: appColor.appBackground}}>
                {/*<NavigationBar onBackButtonPress={ this.onBackButtonPress }*/}
                {/*               top={this.props.safeAreaInsetsData.top}*/}
                {/*               title={strLocale("settingProfile.Profile settings")}/>*/}
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 50}}>
                    <View>
                        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>
                            <Image resizeMode="contain"
                                   source={{uri: 'icon_name'}}
                                   style={{height: 28, width: 28, marginRight: 10}}/>

                            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>
                                {strLocale("login.Name")}
                            </Text>
                            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>
                                {this.state.firstName}
                            </Text>
                            <View style={{
                                position: 'absolute', marginHorizontal: 20,
                                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine
                            }}/>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>
                            <Image resizeMode="contain"
                                   source={{uri: 'icon_email_new'}}
                                   style={{height: 28, width: 28, marginRight: 10}}/>

                            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>
                                {strLocale("login.Email ")}
                            </Text>
                            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>
                                {"Private"}
                            </Text>
                            <View style={{
                                position: 'absolute', marginHorizontal: 20,
                                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine
                            }}/>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>
                            <Image resizeMode="contain"
                                   source={{uri: 'icon_gender'}}
                                   style={{height: 28, width: 28, marginRight: 10}}/>

                            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>
                                {strLocale("login.Gender")}
                            </Text>
                            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>
                                {this.state.gender}
                            </Text>
                            <View style={{
                                position: 'absolute', marginHorizontal: 20,
                                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine
                            }}/>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>
                            <Image resizeMode="contain"
                                   source={{uri: 'icon_region'}}
                                   style={{height: 28, width: 28, marginRight: 10}}/>

                            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>
                                {strLocale("login.Region")}
                            </Text>
                            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>
                                {this.state.region}
                            </Text>
                            <View style={{
                                position: 'absolute', marginHorizontal: 20,
                                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine
                            }}/>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.mainView, {height: 60, borderBottomColor: appColor.settingGrayColor}]}>
                            <Image resizeMode="contain"
                                   source={{uri: 'icon_termofuse'}}
                                   style={{height: 28, width: 28, marginRight: 10}}/>

                            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>
                                {strLocale("login.Team")}
                            </Text>
                            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>
                                {this.state.teamID}
                            </Text>
                            {
                                !!(this.props.teamID !== this.state.teamID && this.state.teamID !== '') &&
                                <View>
                                    <TouchableOpacity style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        backgroundColor: Constant.newTabSelected,
                                        borderRadius: 10,
                                        marginLeft: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: 55,
                                        minHeight: 50
                                    }} onPress={() => this.onTeamDetail()}>
                                        {
                                            this.state.isLoading === false &&
                                            <Text
                                                style={[styles.name, {color: 'white', textAlign: 'center'}]}>
                                                {"Join\nteam"}
                                            </Text>
                                            ||
                                            <ActivityIndicator
                                                style={{color: 'white'}}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                !!this.state.teamID === '' &&
                                <Text
                                    style={[styles.name, {color: 'white', textAlign: 'center'}]}>
                                    {"-"}
                                </Text>
                            }

                            <View style={{
                                position: 'absolute', marginHorizontal: 20,
                                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine
                            }}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textView: {
        marginTop: 10,
        padding: 10,
        fontSize: 15,
        color: '#000',
        minHeight: 100,
        fontFamily: Constant.font300,
    },
    mainView: {
        alignItems: 'center',
        height: 45,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    rowTitle: {
        fontSize: 15,
        fontFamily: Constant.font500,
        flex: 0.3
    },
    textInput: {
        color: Constant.settingBlueColor,
        fontSize: 14,
        paddingBottom: 0,
        fontFamily: Constant.font500,
        flex: 0.7,
        marginLeft: 20,
        textAlign: 'right'
    },
    textBox: {
        fontSize: 16,
        color: '#4e4e4e',
        height: 45,
        fontFamily: Constant.font500,
        marginLeft: 10,
        textAlign: 'right',
        // textAlign:'right'
    },
});

const mapStateToProps = state => {
    return {
        userEmail: state.user.email,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        teamID: state.user.userDetails && state.user.userDetails.teamID || '',
    };
};

export default connect(mapStateToProps, {})(AboutMe);
