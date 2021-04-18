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
    Linking, StatusBar, Image, FlatList, RefreshControl, Animated, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Constant from '../../../../helper/constant';
import {UserEvent} from "../../../../helper/fabricHelper/Answers";
import {connect} from 'react-redux';
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";
import {
    getNotification,
    editNotificationFeed,
    updateUserProfile,
    setNewUser,
    removeSafeArea
} from "../../../../actions/userActions";
import moment from "moment";
import NoDataFound from "../../team/chat/components/noData";
import {capitalizeFistLatter} from "../../../../helper/appHelper";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class AboutMe extends Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);

        this.state = {
            gender: props.userDetails.gender,
            email: props.userDetails.email && props.userDetails.email || props.userEmail,
            firstName: props.userDetails.name,
            region: props.userDetails.region,
            notificationList: props.notificationList ? (props.notificationList.length !== 0 ? props.notificationList : []) : [],
            page: 1,
            isLoading: false,
            loadMore: true,
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        this.apiCalling(this.state.page)
    }

    componentWillReceiveProps(props) {
        if (this.props.userDetails !== props.userDetails) {
            this.setState({
                gender: props.userDetails.gender,
                email: props.userDetails.email && props.userDetails.email || props.userEmail,
                firstName: props.userDetails.name,
                region: props.userDetails.region,
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

    getUpdateLastMessage = (idNew) => {
        if (idNew !== this.props.lastNotificationMessage) {
            let dictValue = {};
            dictValue["lastNotificationMessage"] = idNew;

            this.props.updateUserProfile(this.props.userId, dictValue).then(res => {
                let dict = this.props.userDetails;
                dict["lastNotificationMessage"] = dictValue["lastNotificationMessage"];
                this.props.setNewUser(dict);
            }).catch(err => {
            });
        }
    }

    apiCalling = (index, value = '') => {
        const {chatId} = this.state
        const {userDetails, userId} = this.props

        this.props.getNotification(index, value, userDetails, userId).then((res) => {

            this.setState({isLoading: false})

            let teamChatDisplayList = this.state.notificationList;
            if (res.listPage == 1) {
                teamChatDisplayList = [];
            }

            if (res) {
                if (res.listPage == 1) {
                    if (res.payload && res.payload.length > 0) {
                        this.getUpdateLastMessage(res.payload[0].date)
                    }
                }

                // if (res.listPage == 1) {
                //     if (res.payload && res.payload.length > 0) {
                //         this.getUpdateLastMessage(res.payload[0].id)
                //     }
                // }

                res.payload.forEach((x, index) => {
                    teamChatDisplayList.push(x)
                });

                this.setState({
                    notificationList: teamChatDisplayList
                })

            }
            this.props.editNotificationFeed(teamChatDisplayList)

            if (res.getFeedStatus === 'fail') {
                this.setState({
                    loadMore: false
                })
            }
        })
            .catch((err) => {
                if (err === "fail") {
                    this.setState({isLoading: false})
                }
            })
    }

    onEndReachedChat = () => {

        const {isLoading, loadMore, notificationList, page} = this.state
        if (!isLoading && loadMore === true) {
            this.setState({isLoading: true})
            const value = notificationList[notificationList.length - 1].id
            this.apiCalling(page + 1, value)
        }
    };


    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    refreshData = () => {
        this.setState({
            page: 1,
            loadMore: true,
        }, () => {
            const {page} = this.state
            this.apiCalling(page)
        })
    }

    renderFooter = () => {
        const {isLoading} = this.state
        if (this.state.notificationList.length === 0 && this.props.isLoading === true) {
            return (
                <ActivityIndicator
                    style={{color: Constant.newTabSelected, marginTop: 20}}
                />
            )
        }
        if (this.state.notificationList.length === 0 && this.props.isLoading === false) {
            return (
                <Text style={{
                    width: '100%', alignSelf: 'center',
                    marginTop: 50, textAlign: 'center',
                    fontSize: 15,
                    fontFamily: Constant.font500,
                }}>
                    {strLocale("team.No messages")}
                </Text>
            )
        }

        if (!this.state.isLoading) {
            return (
                <View style={{width: '100%', height: 50}}/>
            )
        }
    };

    onPressNotification = (item) => {
        if (item.type === 'encourage' || item.type === 'congratulation' || item.type === 'team_chat') {
            this.props.navigation.navigate('teamChat',
                {
                    transition: "myCustomSlideRightTransition",
                });
        } else if (item.type === 'community_chat') {
            this.props.removeSafeArea(true);
            this.props.navigation.navigate('commentCommunity', {
                detail: {
                    user_id: item.id,
                    full_name: item.userName,
                    avatar_small: item.avatar_small,
                    time: item.community.communityTime
                },
                index: 0,
                feedId: item.community.communityId,
                type: item.community.communityType,
            })
        }
    }

    renderChatBubble = ({item, index}) => {
        const {userDetails} = this.props
        let appColor = Constant[this.context];
        let iconNew = 'icon_messagegroup';
        let msg = '';
        let msg2 = '';
        if (item.type === 'encourage') {
            iconNew = 'icon_encourage';
            msg = `${capitalizeFistLatter(item.content)} message by `;
            msg2 = capitalizeFistLatter(item.userName);
        } else if (item.type === 'congratulation') {
            iconNew = 'icon_congratulation';
            msg = `${capitalizeFistLatter(item.content)} message by `;
            msg2 = capitalizeFistLatter(item.userName);
        } else if (item.type === 'team_chat') {
            iconNew = 'icon_team';
            msg = `${capitalizeFistLatter(item.content)} message by `;
            msg2 = capitalizeFistLatter(item.userName);
        } else if (item.type === 'community_chat') {
            msg = `${capitalizeFistLatter(item.userName)} comment in your post\n`;
            msg2 = capitalizeFistLatter(capitalizeFistLatter(item.content));
        }

        if (item) {
            return (
                <TouchableOpacity onPress={() => this.onPressNotification(item)}
                                  key={index}
                                  style={[Constant.shadowCommunication, {shadowColor: Constant.postShadowColor}, styles.item,
                                      {backgroundColor: appColor.appBackground}]}
                                  activeOpacity={1}>
                    <View style={styles.user}>
                        <View>
                            <Image resizeMode="contain" style={styles.profileImage}
                                   source={{uri: iconNew}}/>
                        </View>
                        <View style={{flex: 1, marginHorizontal: 20}}>
                            <Text
                                style={[styles.name, {color: appColor.titleMain}]}>
                                {msg}
                                <Text
                                    style={[styles.name, {fontFamily: Constant.font700, color: appColor.titleMain}]}>
                                    {msg2}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    render() {
        let appColor = Constant[this.context];
        const {notificationList} = this.state;

        return (
            <View style={[styles.mainContainer, {backgroundColor: appColor.scrollableViewBack, marginHorizontal: 5}]}>
                {/*<NavigationBar onBackButtonPress={ this.onBackButtonPress }*/}
                {/*               top={this.props.safeAreaInsetsData.top}*/}
                {/*               title={strLocale("settingProfile.Profile settings")}/>*/}

                {
                    (notificationList && notificationList.length === 0) &&
                    <NoDataFound placeHolderText={strLocale("team.No messages")}/>
                    ||
                    <AnimatedFlatList
                        ref={(r) => {
                            this.flatlist = r
                        }}
                        data={notificationList}
                        renderItem={this.renderChatBubble}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        scrollEventThrottle={1}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => this.refreshData()}
                                tintColor={'#3AD29F'}
                                titleColor={'#3AD29F'}
                            />
                        }
                        // onEndReached={() => this.paginationManager()}
                        onEndReachedThreshold={0}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={notificationList}
                        initialNumToRender={10}
                        keyboardDismissMode={'on-drag'}
                    />

                    // <FlatList showsVerticalScrollIndicator={true}
                    //           removeClippedSubviews={false}
                    //           inverted={true}
                    //           ref="scrollView"
                    //           keyboardDismissMode={"on-drag"}
                    //           data={notificationList}
                    //           extraData={notificationList}
                    //           contentContainerStyle={{justifyContent: "flex-end", paddingTop: 3}}
                    //           onEndReachedThreshold={0.5}
                    //           initialNumToRender={10}
                    //           onEndReached={this.onEndReachedChat}
                    //           automaticallyAdjustContentInsets={false}
                    //           keyExtractor={(item, index) => {
                    //               return index + ""
                    //           }}
                    //           windowSize={5}
                    //           renderItem={this.renderChatBubble}/>
                }

                {/*<ScrollView showsVerticalScrollIndicator={false}*/}
                {/*            contentContainerStyle={{paddingBottom: 50}}>*/}
                {/*    <View>*/}
                {/*        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>*/}
                {/*            <Image resizeMode="contain"*/}
                {/*                   source={{uri: 'icon_name'}}*/}
                {/*                   style={{height: 28, width: 28, marginRight: 10}}/>*/}

                {/*            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>*/}
                {/*                {strLocale("login.Name")}*/}
                {/*            </Text>*/}
                {/*            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>*/}
                {/*                {this.state.firstName}*/}
                {/*            </Text>*/}
                {/*            <View style={{*/}
                {/*                position: 'absolute', marginHorizontal: 20,*/}
                {/*                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine*/}
                {/*            }}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}

                {/*    <View>*/}
                {/*        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>*/}
                {/*            <Image resizeMode="contain"*/}
                {/*                   source={{uri: 'icon_email_new'}}*/}
                {/*                   style={{height: 28, width: 28, marginRight: 10}}/>*/}

                {/*            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>*/}
                {/*                {strLocale("login.Email ")}*/}
                {/*            </Text>*/}
                {/*            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>*/}
                {/*                {this.state.email}*/}
                {/*            </Text>*/}
                {/*            <View style={{*/}
                {/*                position: 'absolute', marginHorizontal: 20,*/}
                {/*                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine*/}
                {/*            }}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}

                {/*    <View>*/}
                {/*        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>*/}
                {/*            <Image resizeMode="contain"*/}
                {/*                   source={{uri: 'icon_gender'}}*/}
                {/*                   style={{height: 28, width: 28, marginRight: 10}}/>*/}

                {/*            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>*/}
                {/*                {strLocale("login.Gender")}*/}
                {/*            </Text>*/}
                {/*            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>*/}
                {/*                {this.state.gender}*/}
                {/*            </Text>*/}
                {/*            <View style={{*/}
                {/*                position: 'absolute', marginHorizontal: 20,*/}
                {/*                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine*/}
                {/*            }}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}

                {/*    <View>*/}
                {/*        <View style={[styles.mainView, {borderBottomColor: appColor.settingGrayColor}]}>*/}
                {/*            <Image resizeMode="contain"*/}
                {/*                   source={{uri: 'icon_region'}}*/}
                {/*                   style={{height: 28, width: 28, marginRight: 10}}/>*/}

                {/*            <Text style={[styles.rowTitle, {color: appColor.lighTextColor}]}>*/}
                {/*                {strLocale("login.Region")}*/}
                {/*            </Text>*/}
                {/*            <Text style={[styles.textInput, {color: appColor.lighTextColor}]}>*/}
                {/*                {this.state.region}*/}
                {/*            </Text>*/}
                {/*            <View style={{*/}
                {/*                position: 'absolute', marginHorizontal: 20,*/}
                {/*                height: 1, left: 0, right: 0, bottom: 0, backgroundColor: Constant.newUnderLine*/}
                {/*            }}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</ScrollView>*/}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
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
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    profileImage: {
        height: 35,
        width: 35,
    },
    item: {
        borderRadius: 10,
        margin: 5,
        marginHorizontal: 15,
        paddingVertical: 10
    },
});

const mapStateToProps = state => {
    return {
        userEmail: state.user.email,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        userDetails: state.user.userDetails || {},
        notificationList: state.user.userDetails && state.user.notificationList || [],
        lastNotificationMessage: state.user.userDetails && state.user.userDetails.lastNotificationMessage || '',
    };
};

export default connect(mapStateToProps, {
    getNotification,
    editNotificationFeed,
    updateUserProfile,
    setNewUser,
    removeSafeArea,
})(AboutMe);
