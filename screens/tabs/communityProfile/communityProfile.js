import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    Text,
    FlatList,
    ActivityIndicator,
    Modal,
    Animated, Easing, AppState, TouchableOpacity, BackHandler, StatusBar
} from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import Constant from '../../../helper/constant';
import {UserEvent} from "../../../helper/fabricHelper/Answers";
import {connect} from 'react-redux';
import TopDetailProfile from './component/topProfileDetails';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import CustomTabbar from '../../commonComponent/customTabBar'
import AboutDetail from './about';
import LinearGradient from 'react-native-linear-gradient';
import {find, filter, sortBy} from 'lodash';
import {
     manageSeenEvents,
    manageActivityEventBadgeCount, manageStartEventViews,
    getCurrentTeam
} from "../../../actions/teamAction";
import {getUserSubDetail, loginUserNew, manageNotificationBadgeCount} from "../../../actions/userActions";
import {deleteFeed, getUserPost, reportInappropriate} from "../../../actions/helpPostActions";
import ManageBiography from './addBiography';
import CustomAlert from '../../commonComponent/customAlert';
import {
    resetAllAsyncStorageData,
    showCustomAlert,
    showNoInternetAlert,
    showThemeAlert
} from "../../../helper/appHelper";
import {getCommunityTitle, getCommunitySubTitle, alertData, alertType} from "./communityHelper";
import CommunityRow from './component/communityRow';
import {createNewTocken} from '../../../services/apiCall';
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";
import AboutMe from "./component/aboutMe";
import MyFeedList from "./component/myFeedList"
import MyNotification from "./component/myNotification"
import moment from "moment";

const HEADER_MIN_HEIGHT = (Constant.isIOS) && 50 || 50;
const renderTabBar = props => (
    <CustomTabbar {...props} style={{borderBottomWidth: 0, height: HEADER_MIN_HEIGHT}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{
    height: 50, borderBottomWidth: 0
}}/>);

let isApiCalling = false;
let HEADER_MAX_HEIGHT = 400; // - 40;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
let count = 0;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class CommunityProfile extends React.PureComponent {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            showTab: 0,
            isLoadingData: true,
            modalVisible: false,
            scrollY: new Animated.Value(0),
            memberDetail: props.route.params && props.route.params.memberDetail || null,
            isShowAlert: false,
            isInTeam: false,
            buttonLabel: 'Invite to team',
            isAlreadyInvited: false,
            isCurrentUser: props.route.params && props.route.params.isCurrentUser || false,
            alertData: null,
            type: '',
            invitedObj: null,
            userId: props.route.params && props.route.params.userId || props.userId,
            numberDay: 0,
            feed: [],
            name: '',
            teamID: '',
            avatar: props.route.params && props.route.params.avatar || '',
            isLoading: true,
            isLoading2: true,
            selectedTab: props.route.params && props.route.params.selectedTab || 0,
        }
        if (props.route.params && props.route.params.isCurrentUser) {
            HEADER_MAX_HEIGHT = 360;
            HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
        } else {
            HEADER_MAX_HEIGHT = 400;
            HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
        }
        isApiCalling = false;
        count = 0;
        // alert(this.state.avatar)
    }

    componentWillReceiveProps(nextProps, nextState) {
        count += 1;
        if (this.state.isLoadingData && count > 1) {
            this.setState({
                isLoadingData: false
            });
        }
        if (JSON.stringify(this.props.inviteData) !== JSON.stringify(nextProps.inviteData)) {
            console.log(nextProps.inviteData)
            this.ownTeamMember(nextProps);
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        try {
            // this.props.getInvite();
            this.ownTeamMember(this.props);
            if (this.state.isCurrentUser) {
                this.props.manageActivityEventBadgeCount(0);
                if (Constant.isIOS) {
                    PushNotificationIOS.setApplicationIconBadgeNumber(0 + this.props.appBadgeCount);
                }
            }
        } catch (e) {
            console.log(e);
        }
        AppState.addEventListener('change', this._handleAppStateChange);

        this.props.getUserSubDetail(this.state.userId).then(res => {
            try {
                let full_array = res["porn-days"] && res["porn-days"].data || [];
                let remove_futureDate_array = [];
                full_array.map(obj => {
                    if (moment(obj.occurred_at, 'YYYY-MM-DD').toDate() <= new Date()) {
                        remove_futureDate_array.push(obj)
                    }
                })
                let arr_FreeDay = filter(remove_futureDate_array, {is_relapse: false, is_resolved: false});

                this.setState({
                    numberDay: arr_FreeDay.length,
                    name: res.name,
                    avatar: res.avatar_id,
                    gender: res.gender,
                    email: res.email,
                    region: res.region,
                    isLoading2: false,
                    teamID: res.teamID || '',
                })
            } catch (e) {

            }
        }).catch(res => {
        })


        this.props.getUserPost(1, this.state.userId, 'help').then(res => {
            // this.setState({
            //     feed: res
            // })

            this.props.getUserPost(1, this.state.userId, 'questionanswer').then(res2 => {
                // this.setState({
                //     feed: this.state.feed.concat(res2)
                // })

                this.props.getUserPost(1, this.state.userId, 'youradvice').then(res3 => {
                    // let arr = sortBy(this.state.feed.concat(res3), function (o) {
                    //     return new moment(o.occurred_at);
                    // });

                    // let arr = this.state.feed.concat(res3).sort((a, b) => {
                    //     return b.created_at - a.created_at
                    // })

                    let newvalue = res.concat(res2)
                    this.setState({
                        feed: newvalue.concat(res3),
                        isLoading: false
                    })

                }).catch(res => {
                })
            }).catch(res => {
            })
        }).catch(res => {
        })

        this.props.navigation.addListener('focus', () => {
            if (this.props.appTheme === 'DARK'){
                StatusBar.setBarStyle('light-content', false);
                StatusBar.setBackgroundColor('#212224', false);
            }else{
                StatusBar.setBarStyle('dark-content', false);
                StatusBar.setBackgroundColor('white', false);
            }
        });

    }

    UNSAFE_componentWillMount() {
        UserEvent.userTrackScreen("communityprofile", "")
        this.props.manageNotificationBadgeCount(0)
    }

    componentWillUnmount() {
        try {
            AppState.removeEventListener('change', this._handleAppStateChange);
            if (this.state.isCurrentUser) {
                this.props.manageActivityEventBadgeCount(0);
            }
        } catch (e) {
            console.log(e);
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            createNewTocken();
            // this.props.getInvite();
        }
    }

    onBackButtonPress = () => {
        //Assume all activity seen by user
        //startEventViews = top of item
        // let isCurrentUser = this.props.route.params.isCurrentUser || false;
        // if (isCurrentUser) {
        //     let listData = this.props.userEventList;
        //     if(listData.length > 0 && this.props.startEventViews !== listData[0].id){
        //         this.props.manageStartEventViews(listData[0].id);
        //     }
        // }
        this.props.navigation.goBack();
    };

    //Check member of own team or invited
    ownTeamMember = (props) => {
        try {
            const {memberArray, teamDetail} = props;
            let data = find(memberArray, {id: this.state.memberDetail.id});
            if (data) {
                if (teamDetail.current_user_is_admin || this.state.isCurrentUser || teamDetail.is_public) {
                    this.setState({isInTeam: true, buttonLabel: 'In your team'})
                } else {
                    this.setMuteUnmuteBtn(props);
                }
            } else {
                this.setInviteOrCancelBtn(props);
            }
        } catch (e) {
            console.log(e);
        }
    }

    setMuteUnmuteBtn = (props) => {
        try {
            const {memberArray} = props;
            const {memberDetail} = this.state;
            let data = find(memberArray, {id: memberDetail.id});
            if (data && data.current_user_has_muted) {
                this.setState({isInTeam: true, buttonLabel: 'Unmute User'})
            } else {
                this.setState({isInTeam: true, buttonLabel: 'Mute User'})
            }
        } catch (e) {
            console.log(e);
        }
    }

    setInviteOrCancelBtn = (props) => {
        try {
            //Is Already Invited then Cancel Invite
            const {inviteData} = props;
            const {memberDetail} = this.state;
            let invitedObj = find(inviteData, x => x.recipient.id === memberDetail.id);
            if (invitedObj) {
                this.setState({
                    isInTeam: false,
                    buttonLabel: 'Cancel invite',
                    invitedObj: invitedObj
                });
            } else {
                this.setState({
                    isInTeam: false,
                    buttonLabel: 'Invite to team',
                    invitedObj: null
                });
            }

        } catch (e) {
            console.log(e);
        }

    }

    onTabChange = (tab) => {
        this.setState({
            showTab: tab.i
        })
    };

    getTitle = (item) => {
        return getCommunityTitle(this.state.isCurrentUser, item);
    }

    getSubTitle = (item) => {
        return getCommunitySubTitle(item);
    }

    onTeamActivityPress = (item) => {
        try {
            if (item && item.type === 'sent') {
                let alertData = {
                    objData: [{
                        title: strLocale("alert.Cancel invite?"),
                        description: strLocale("alert.Cancel invite message", {name: item.recipient.name})
                    }],
                    left: 'Cancel',
                    right: 'Cancel invite',
                    isSinglebtn: false,
                    objItem: item
                }
                this.setState({
                    alertData,
                    isShowAlert: true,
                    type: alertType.cancelInvite
                });
            } else if (item && item.type === 'received') {
                let alertData = {
                    objData: [{
                        title: strLocale("alert.Join the team?", {name: item.team.name}),
                        description: strLocale("alert.Join the team message", {name: item.team.name})
                    }],
                    left: 'Cancel',
                    right: 'Join team',
                    isSinglebtn: false,
                    objItem: item
                }
                this.setState({
                    alertData,
                    isShowAlert: true,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    onEndReachedEnd = () => {
        try {
            if (this.props.isConnected && this.state.showTab == 0) {
                let isCurrentUser = this.state.isCurrentUser;
                let pagination = this.props.teamMemberEventPagination;
                if (isCurrentUser) {
                    pagination = this.props.userEventPagination;
                }
                if (!isApiCalling) {
                    if (pagination && pagination.next_page_url) {
                        isApiCalling = true;
                        // this.props.getEventsDetails("", pagination.next_page_url, isCurrentUser).then(res => {
                        //     isApiCalling = false;
                        // }).catch(err => {
                        //     isApiCalling = false;
                        // });
                    }
                }
            }
        } catch (e) {
            isApiCalling = false;
            console.log("Team chat", e);
        }
    };

    renderRow = ({item, index}) => {
        try {
            if (item.type === 'received_team_invite') {
                return null;
            }
            let appColor = Constant[this.context];
            if (this.state.showTab == 0) {
                let isCurrentUser = this.state.isCurrentUser;
                let isDot = (isCurrentUser && this.props.startEventViews &&
                    item.id > this.props.startEventViews && this.props.seenUserEvents.indexOf(item.id) < 0) || false;
                if (isCurrentUser && item.type.includes('posted_')) {
                    isDot = false;
                }
                let minusWidth = 40 + 19 + 14;
                let isHeart = item.type.includes('_heart');
                let inviteIcon = item.type == 'sent' && 'invite_arrow_icon' || 'invite_envelope_icon';
                return (
                    <CommunityRow key={index}
                                  index={index}
                                  appColor={appColor}
                                  isDot={isDot}
                                  isHeart={isHeart}
                                  minusWidth={minusWidth}
                                  inviteIcon={inviteIcon}
                                  item={item}
                                  getSubTitle={this.getSubTitle}
                                  getTitle={this.getTitle}
                                  onTeamActivityPress={this.onTeamActivityPress}
                                  onInviteAcceptDecline={this.onInviteAcceptDecline}
                                  onActivityPress={this.onActivityPress}
                                  HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT + this.props.safeAreaInsetsDefault.top}
                    />
                )
            }
            return <AboutDetail appColor={appColor}
                                isCurrentUser={this.state.isCurrentUser}
                                userId={this.props.userId}
                                memberDetail={this.props.memberDetail}
                                onUpdateBiography={this.onUpdateBiography}/>
        } catch (e) {
            return null;
        }
    }

    onUpdateBiography = () => {
        this.setState({
            modalVisible: true
        });
    }

    onCloseBtnPress = (updatedData) => {
        // this.props.updateUserDetails(updatedData);
        this.setState({
            modalVisible: false,
        });
    };

    onDeleteFeed = (action) => {
        const {feed} = this.state;
        let objIndex = feed.indexOf(action);

        this.props.deleteFeed(action.feedId, action.typeCategory.toLowerCase())
            .then((res) => {
                if (res === true) {
                    feed.splice(objIndex, 1);
                    this.setState({
                        feed: []
                    })

                    setTimeout(() => {
                        this.setState({
                            feed: feed
                        })
                    }, 500)

                    // const {actionIndex} = this.state;
                    // feed.splice(actionIndex, 1);
                    // this.setState({
                    //     feed: feed
                    // })
                    // this.props.editFeed(feed)
                    // this.forceUpdate()
                }
            })
            .catch((err) => {

            })
    }

    onInApproriate = (action) => {
        const {feed} = this.state;
        let objIndex = feed.indexOf(action);

        debugger
        this.props.reportInappropriate(action.feedId, action.typeCategory.toLowerCase(), action)
            .then((res) => {
                feed[objIndex].approprite = res

                this.setState({
                    feed: feed
                })

            })
            .catch((err) => {

            })
    }

    perfomMuteUnMute = (btn) => {
        try {
            if (this.props.isConnected) {
                const {buttonLabel, memberDetail} = this.state;
                if (memberDetail.current_user_has_muted) {
                    // this.props.unMuteTeamMember(memberDetail.id).then(res => {
                    //     this.setMuteUnmuteBtn(this.props);
                    // }).catch(err => {
                    // });
                } else {
                    //Mute
                    // this.props.muteTeamMember(memberDetail.id).then(res => {
                    //     this.setMuteUnmuteBtn(this.props);
                    // }).catch(err => {
                    // });
                }
            } else {
                showNoInternetAlert();
            }
        } catch (e) {
            console.log(e);
        }
    }

    //Invitation or mute
    onManageMember = () => {
        try {
            const {teamDetail} = this.props;
            const {isInTeam, memberDetail} = this.state;
            if (teamDetail.is_public) {
                if (!isInTeam) {
                    this.setState({
                        isShowAlert: true,
                        alertData: alertData(strLocale).createPrivateTeam,
                        type: alertType.createNewTeam
                    });
                }
            } else {
                if (isInTeam) {
                    //In your team and admin
                    if (teamDetail.current_user_is_admin) {
                        this.setState({
                            isShowAlert: true,
                            alertData: alertData(strLocale).inYourTeam,
                            type: alertType.removeUser
                        });
                    } else {
                        //Here perfom Mute and Unmute
                        this.perfomMuteUnMute();
                    }
                } else {
                    //Invite if not invitedf
                    this.performCreateTeamInvite();
                }
            }
        } catch (e) {
            if (__DEV__) {
                alert(e);
            }
            console.log(e);
        }
    }

    //Create team invite
    performCreateTeamInvite = () => {
        try {
            const {teamDetail, inviteData} = this.props;
            const {memberDetail} = this.state;
            let invitedObj = find(inviteData, x => x.recipient.id === memberDetail.id);
            if (invitedObj) {
                //cancel invite
                this.performCancelInvite(invitedObj.id);
            } else {
                //Invite if not invitedf
                // this.props.createTeamInvite(memberDetail.id).then(res => {
                //     let data = {
                //         objData: [{
                //             title: strLocale("alert.Invite sent"),
                //             description: strLocale("alert.Invite sent message", {name: memberDetail.name})
                //         }],
                //         left: 'Dismiss',
                //         isSinglebtn: true
                //     }
                //     this.setState({
                //         isShowAlert: true,
                //         alertData: data
                //     });
                // }).catch(e => {
                //     if (e && typeof e === 'number') {
                //         if (e == 429) {
                //             this.setState({
                //                 isShowAlert: true,
                //                 alertData: alertData(strLocale).toomanyInvites,
                //                 type: alertType.toomany
                //             });
                //         } else if (e == 400) {
                //             this.setState({
                //                 isShowAlert: true,
                //                 alertData: alertData(strLocale).fullTeamInvite,
                //                 type: alertType.fullTeamInvite
                //             });
                //         }
                //     }
                // });
            }
        } catch (e) {
            console.log(e);
        }
    }

    //Invitation accept-decline
    onInviteAcceptDecline = (item, type) => {
        try {
            if (type === 'accept') {
                // this.props.acceptTeamInvitation(item.id).then(res => {
                //     const alertData = {
                //         objData: [{
                //             title: strLocale("alert.Team joined"),
                //             description: strLocale("alert.Team joined message", {name: item.team.name})
                //         }],
                //         left: 'Okay',
                //         isSinglebtn: true
                //     }
                //     this.setState({
                //         alertData,
                //         isShowAlert: true,
                //     });
                // }).catch(e => {
                //     if (e && typeof e === 'number') {
                //         if (e == 429) {
                //             this.setState({
                //                 isShowAlert: true,
                //                 alertData: alertData(strLocale).toomanyInvites,
                //                 type: alertType.toomany
                //             });
                //         } else if (e == 400) {
                //             this.setState({
                //                 isShowAlert: true,
                //                 alertData: alertData(strLocale).fullTeamAccept,
                //                 type: alertType.fullTeamAccept
                //             });
                //         }
                //     }
                // });
            } else {
                // this.props.cancelInvite(item.id).then(res => {
                // }).catch(err => {
                // });
            }
        } catch (e) {
            console.log(e);
        }
    }

    hideAlert = (title) => {
        try {
            const {type, isInTeam, memberDetail, alertData} = this.state;
            switch (type) {
                case alertType.createNewTeam:
                    if (title == 'Okay') {
                        this.props.navigation.navigate('createPrivateTeam', {transition: "myCustomSlideRightTransition"})
                    }
                    break;
                case alertType.removeUser:
                    if (title == 'Remove') {
                        if (isInTeam) {
                            // this.props.deleteTeamMember(memberDetail.id).then(res => {
                            //     //alert('Remove member done');
                            // }).catch(err => {
                            // });
                        }
                    }
                    break;
                case alertType.cancelInvite:
                    if (alertData.objItem && title === 'Cancel invite') {
                        this.performCancelInvite(alertData.objItem.id);
                    }
                    break;
                default:
                    break
            }
            this.setState({
                isShowAlert: false
            });
        } catch (e) {
            console.log(e);
        }
    }

    performCancelInvite = (id) => {
        // this.props.cancelInvite(id).then(res => {
        // }).catch(err => {
        // });
    }

    onTeamDetail = () => {
        if (this.state.teamID && this.state.teamID !== ''){
            this.props.getCurrentTeam(this.state.teamID).then(res => {
                this.props.navigation.navigate('teamDetail', {
                    transition: "myCustomSlideRightTransition",
                    teamData: res
                })
            }).catch((error) => {
            });
        }
    }

    renderCustomAlert = () => {
        try {
            const {alertData} = this.state;
            if (alertData) {
                return (
                    <CustomAlert
                        objData={alertData.objData}
                        left={alertData.left}
                        right={alertData.right}
                        isSinglebtn={alertData.isSinglebtn}
                        onAlertClick={this.hideAlert}
                    />
                )
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    //End Invite
    renderHeader = () => {
        try {
            let appColor = Constant[this.context];
            // let userData = (this.props.memberDetail == null) &&
            //     this.props.route.params.memberDetail || this.props.memberDetail;
            // let isCurrentUser = this.state.isCurrentUser;
            return (
                <View style={{flex: 1}}>
                    {
                        <TopDetailProfile appColor={appColor}
                                          userData={{
                                              name: this.state.name,
                                              avatar_id: this.state.avatar,
                                              porn_free_days: {
                                                  total: this.state.numberDay
                                              },
                                              isLoading: this.state.isLoading2
                                          }
                                          }
                                          isCurrentUser={true}
                                          onInviteMember={this.onManageMember}
                                          currentStreak={'200'}
                                          buttonLabel={'dfdfdf'}/>
                    }
                    <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                       style={{backgroundColor: appColor.scrollableViewBack, marginTop: 10}}
                                       tabBarUnderlineStyle={{backgroundColor: Constant.lightBlueColor}}
                                       renderTabBar={this.renderTabBar}
                                       tabBarActiveTextColor={appColor.scrollableActiveFont}
                                       tabBarTextStyle={{
                                           fontFamily: Constant.font500, fontSize: 14, alignSelf: 'center',
                                           paddingTop: (Constant.isIOS) ? 30 : 15
                                       }}
                                       tabBarInactiveTextColor={'gray'}
                                       initialPage={this.state.selectedTab}
                                       prerenderingSiblingsNumber={Infinity}
                                       onChangeTab={(tab) => this.onTabChange(tab)}>
                        {/*<View tabLabel="Activity"/>*/}
                        <MyFeedList tabLabel={this.state.isCurrentUser === true && strLocale("team.My Feed") ||  strLocale("team.Feed")}
                                    navigation={this.props.navigation}
                                    feedList={this.state.feed}
                                    onDeleteFeed={this.onDeleteFeed}
                                    onInApproriate={this.onInApproriate}
                                    isLoading={this.state.isLoading}
                                    userName={this.state.isCurrentUser === true && "You have" || this.state.name}
                        />
                        <AboutMe tabLabel={strLocale("team.About")}
                                 userDetails={{
                                     gender: this.state.gender,
                                     email: this.state.email,
                                     name: this.state.name,
                                     region: this.state.region,
                                     teamID: this.state.teamID
                                 }}
                                 onTeamDetail={this.onTeamDetail}/>
                        {
                            this.state.isCurrentUser === true &&
                            <MyNotification tabLabel={strLocale("team.Notifications")}
                                            navigation={this.props.navigation}
                                            userDetails={{
                                                gender: this.state.gender,
                                                email: this.state.email,
                                                name: this.state.name,
                                                region: this.state.region,
                                            }}/>
                        }

                        {/*<View tabLabel={isCurrentUser && "About Me" || "About"}/>*/}
                    </ScrollableTabView>
                </View>
            )
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    renderFooter = () => {
        try {
            let appColor = Constant[this.context];
            if (this.state.isLoadingData) {
                return (
                    <ActivityIndicator
                        animating={true}
                        style={{marginTop: 20, paddingTop: HEADER_MAX_HEIGHT + this.props.safeAreaInsetsDefault.top}}
                        size="small"
                        color={appColor.activityIndicator}/>
                )
            }
            let listData = (this.state.isCurrentUser) && this.props.userEventList || this.props.teamMemberEventList;
            let combineArray = this.state.isCurrentUser && [...this.props.inviteData, ...listData] || listData;
            combineArray = filter(combineArray, x => x.type !== 'received_team_invite');
            if (combineArray.length == 0 && this.state.showTab == 0) {
                return (
                    <Text style={[styles.placeHolderText, {
                        color: appColor.profileColor
                    }]}>
                        {strLocale("statistic.There's nothing here")}
                    </Text>
                );
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    onActivityPress = (item) => {
        try {
            let postId = 0;
            let type = item.type;
            let commentObj = null;
            if (type == "posted_advice_comment" || type == "posted_help_comment" || type == "received_advice_comment_heart" ||
                type == "received_advice_reply" || type == "received_help_reply" || type == "received_help_comment_heart"
                || type == "received_advice_post_reply" || type == "received_help_post_reply") {
                commentObj = {
                    postId: item.entity.id
                };
            }
            if (type.includes("advice")) {
                if (type == "posted_advice" || type == "received_advice_heart") {
                    postId = item.entity.id; //Entity ID
                } else {
                    postId = item.entity.post.id;
                }
                this.props.navigation.navigate('adviceComment', {
                    rowData: null,
                    transition: "myCustomSlideRightTransition",
                    onPressCommunityProfileIcon: this.onPressCommunityProfileIcon,
                    postId: postId,
                    commentObj: commentObj
                });
                // this.props.getCommentByAdviceId(postId);
                this.manageEventViewByUser(item.id);
            } else {
                if (type == "posted_help" || type == "received_help_heart") {
                    postId = item.entity.id; //Entity ID
                } else {
                    postId = item.entity.post.id;
                }
                this.props.navigation.navigate('postComment', {
                    rowData: null, transition: "myCustomSlideRightTransition",
                    onPressCommunityProfileIcon: this.onPressCommunityProfileIcon,
                    postId: postId,
                    commentObj: commentObj
                });
                // this.props.getCommentByPostId(postId);
                this.manageEventViewByUser(item.id);
            }
        } catch (e) {
            if (__DEV__) {
                alert(e)
            }
        }
    }

    manageEventViewByUser = (itemId) => {
        try {
            if (this.state.isCurrentUser && this.props.startEventViews &&
                itemId > this.props.startEventViews && this.props.seenUserEvents.indexOf(itemId) < 0) {
                this.props.manageSeenEvents(itemId);
            }
        } catch (e) {
            console.log(e);
        }
    }

    onPressCommunityProfileIcon = (memberDetail) => {
        try {
            if (memberDetail) {
                let instance = memberDetail;
                instance.porn_free_days = {
                    total: memberDetail.stats.porn_free_days,
                    longest_streak: 0,
                    current_streak: 0,
                }
                instance.hearts_count = 0;
                instance.biography = "";
                if (memberDetail.is_current_user && this.props.userCommunity) {
                    instance = this.props.userCommunity;
                }
                this.props.navigation.push("communityProfile" + "", {
                    transition: "myCustomSlideRightTransition",
                    isCurrentUser: memberDetail.is_current_user,
                    memberDetail: instance
                })
                // this.props.getMemberDetail(memberDetail.id, memberDetail.is_current_user).then(res => {
                //     // this.props.getEventsDetails(memberDetail.id, null, memberDetail.is_current_user);
                // });
            }
        } catch (e) {
            console.log(e)
        }
    }

    renderTabBar = () => {
        if (this.context === Constant.darkTheme) {
            return <CustomTabbar {...this.props} style={{borderBottomWidth: 0, height: HEADER_MIN_HEIGHT}}
                                 currentUser={this.state.isCurrentUser}/>
        }
        return <CustomTabbar {...this.props} style={{
            height: 50, borderBottomWidth: 0
        }}
                             currentUser={this.state.isCurrentUser}/>
    }

    render() {
        const {
            safeAreaInsetsDefault, navigation,
            userEventList, teamMemberEventList, inviteData
        } = this.props;
        const isCurrentUser = this.state.isCurrentUser;
        let appColor = Constant[this.context];
        let listData = (isCurrentUser) && this.props.userEventList || this.props.teamMemberEventList;
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp'
        });
        let memberDetail = (this.props.memberDetail == null) &&
            this.props.route.params.memberDetail || this.props.memberDetail;
        let combineArray = isCurrentUser && [...inviteData, ...listData] || listData;
        return (
            // memberDetail == null &&
            // <View style={[styles.container, {
            //     backgroundColor: appColor.textInputBackColor, justifyContent: 'center',
            //     alignItems: 'center'}]}>
            //     <ActivityIndicator
            //         animating={true}
            //         size="small"
            //         color={appColor.activityIndicator}/>
            // </View> ||
            <View style={[styles.container, {backgroundColor: appColor.scrollableViewBack}]}>

                <View style={{
                    top: -10, right: 0,
                    position: 'absolute', alignItems: 'center'
                }}>
                    <Image source={{uri: 'new_icon_accountsetting_topright'}}
                           style={{height: Constant.screenWidth * 0.40, width: Constant.screenWidth * 0.40}}/>
                </View>

                <View style={{width: '100%', flexDirection: 'row', paddingTop: 30}}>
                    <TouchableOpacity onPress={this.onBackButtonPress}
                                      style={{
                                          alignItems: 'flex-end',
                                          marginLeft: 0
                                      }}>
                        <Image source={{uri: 'icon_onlybackback'}}
                               style={{height: 70, width: 70}}/>

                        <Image source={{uri: 'icon_onlyback'}}
                               style={{height: 70, width: 70, position: 'absolute', tintColor: '#587A9E'}}/>
                    </TouchableOpacity>
                </View>

                <Text style={{
                    color: '#9551FF',
                    fontSize: 30,
                    fontFamily: Constant.font500,
                    paddingLeft: 20,
                    paddingTop: 0
                }}>
                    {strLocale("setting.Profile")}
                </Text>

                {this.renderHeader()}

                {/*<AnimatedFlatList showsVerticalScrollIndicator={false}*/}
                {/*                  onScroll={Animated.event(*/}
                {/*                      [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],*/}
                {/*                      {useNativeDriver: true}*/}
                {/*                  )}*/}
                {/*                  style={styles.container}*/}
                {/*                  scrollEventThrottle={16}*/}
                {/*                  data={this.state.showTab == 0 && combineArray || [1]}*/}
                {/*                  automaticallyAdjustContentInsets={false}*/}
                {/*                  contentInset={{bottom: safeAreaInsetsDefault.bottom}}*/}
                {/*                  onEndReachedThreshold={0.5}*/}
                {/*                  onEndReached={this.onEndReachedEnd}*/}
                {/*                  renderItem={this.renderRow}*/}
                {/*                  keyExtractor={(item, index) => {*/}
                {/*                      return index + "";*/}
                {/*                  }}*/}
                {/*                  ListHeaderComponent={<View style={{height:HEADER_MAX_HEIGHT+safeAreaInsetsDefault.top,width:'100%'}}/>}*/}
                {/*                  // ListFooterComponent={this.renderFooter}*/}
                {/*/>*/}
                {/*<Animated.View style={[styles.header, {*/}
                {/*    height: HEADER_MAX_HEIGHT, transform: [{translateY: imageTranslate}],*/}
                {/*    top: safeAreaInsetsDefault.top}]}>*/}
                {/*    <Animated.View style={[styles.outerView]}>*/}
                {/*        {this.renderHeader()}*/}
                {/*    </Animated.View>*/}
                {/*</Animated.View>*/}

                {/*<Modal animationType="slide"*/}
                {/*       transparent={false}*/}
                {/*       visible={this.state.modalVisible}*/}
                {/*       onRequestClose={this.onCloseBtnPress}>*/}
                {/*    <ManageBiography onCloseBtnPress={this.onCloseBtnPress}*/}
                {/*                     rowData={{data: (memberDetail && memberDetail.biography) && memberDetail.biography || ""}}*/}
                {/*                     safeAreaInsetsDefault={this.props.safeAreaInsetsDefault}/>*/}
                {/*</Modal>*/}
                {/*<TouchableHighlight onPress={this.onBackButtonPress}*/}
                {/*                    style={[styles.backView, {paddingTop: 15 + this.props.safeAreaInsetsDefault.top}]}*/}
                {/*                    underlayColor={Constant.transparent}>*/}
                {/*    <Image resizeMode="contain"*/}
                {/*           style={{height: 20,width: 20, tintColor:appColor.themeFont}}*/}
                {/*           source={{uri:'back_button_rounded'}}/>*/}
                {/*</TouchableHighlight>*/}
                {/*{*/}
                {/*    this.state.isShowAlert && this.renderCustomAlert()*/}
                {/*}*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#03A9F4',
        overflow: 'hidden',
    },
    outerView: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
    },
    placeHolderText: {
        marginTop: 45,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: Constant.font500,
        maxWidth: 280,
        lineHeight: 21,
        alignSelf: 'center'
    },
    backView: {
        height: 60,
        width: 60,
        position: 'absolute',
        left: 10,
        top: Constant.isIOS && 20 || 0,
        paddingLeft: 5,
        backgroundColor: Constant.transparent,
        zIndex: 111
    },
});

const mapStateToProps = state => {
    return {
        memberArray: state.team.memberArray,
        teamDetail: state.team.teamDetail,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        teamMemberEventList: state.team.teamMemberEventList || [],
        teamMemberEventPagination: state.team.teamMemberEventPagination || null,
        isConnected: state.user.isConnected,
        memberDetail: state.team.memberDetail || null,
        userEventList: state.team.userEventList || [],
        userEventPagination: state.team.userEventPagination || null,
        seenUserEvents: state.team.seenUserEvents || [],
        startEventViews: state.team.startEventViews || null,
        appBadgeCount: state.user.appBadgeCount,
        userCommunity: state.user.userCommunity || null,
        current_p_clean_days: state.statistic.pornDetail.current_p_clean_days,
        inviteData: state.team.inviteData || [],
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        appTheme: state.user.appTheme,
    };
};

export default connect(mapStateToProps, {
    manageSeenEvents,
    manageActivityEventBadgeCount,
    manageStartEventViews,
    getUserSubDetail,
    getUserPost,
    deleteFeed,
    reportInappropriate,
    manageNotificationBadgeCount,
    getCurrentTeam,
})(CommunityProfile);
