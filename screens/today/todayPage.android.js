import React, {Component, useContext} from 'react';
import {
    Alert,
    AppState,
    AsyncStorage, Image,
    Linking,
    NativeModules,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import TotalProgress from './component/totalProgress'
import Constant from '../../helper/constant';
import {UserEvent} from "../../helper/fabricHelper/Answers"
import Routine from './component/routineComponent';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {
    onCompletedMorningRoutine,
    setCompletedMorningRoutine,
    setMorningRoutine,
} from '../../actions/metadataActions';
import {getCurrentClean, goalCalculation} from '../../actions/statisticAction';
import {
    activeAppManagedTab,
    loadDataOnAppOpen,
    manageAchievedPopup,
    manageCheckupPopup,
    managedLetterAPI,
    manageMonthlyChallengeAchieved,
    manageMonthlyChallengePopup,
    managePopupQueue,
    manageRewiredProgressPopup,
    manageRewiringPopup,
    manageStreakAchievedPopup,
    manageTodayInstances,
    removeSafeArea,
    resetStoreData,
    sendTagOneSignal,
    setAskedForCheckupPopup,
    setCompletedExercises,
    setDateforTodayOpen,
    setDoneAPICallForToday,
    setIsNetworkAvailable,
    setSubscriptionInProcess,
    setUpLocalNotificationAlerts,
    tabChanged,
    sendNotification,
    manageTutorialPopUp,
    manageNotificationToday,
    manageNotificationRewring,
    manageNotificationStrek,
    manageNotificationLevel, manageNotificationAward, sendNotificationRemote, themeUpdate, updaterevenuecatID
} from '../../actions/userActions';
import {addMessageTeamChat} from "../../actions/teamAction";
import CheckupTime from './component/checkupTime';
import LifeTree from './component/lifeTree';
import WriteAboutYourDay from './component/writeAboutYourDay';
import * as Animatable from 'react-native-animatable';
import {cloneDeep, find, isEqual} from 'lodash';
import moment from 'moment';
import {checkForValidation, loadAllProducts, restoreAllData} from '../../helper/inAppPurchase';
import * as StoreReview from 'react-native-store-review';
import {EventRegister} from 'react-native-event-listeners';
import {
    generateRandomNumber,
    getCurrentMonth,
    getValidMetadata,
    resetAllAsyncStorageData,
    showThemeAlert
} from "../../helper/appHelper";
import {
    allOptionalExercies,
    allMorningRoutine,
    iconImage, notificationList,
} from "../../helper/todayHelper";
import {ThemeContext} from 'AppTheme';
import {strLocale} from "locale";
import {types} from "./checkup/checkupData";
import AppStatusBar from "../commonComponent/statusBar";
import RoutineSingleLine from "./component/routineSingleLineComponent";
import InAppBilling from "react-native-billing";
import RoutineSOSComponent from "./component/routineSOSComponent";
import OneSignal from "react-native-onesignal";
import Animated from "react-native-reanimated";
import TotalProgress2 from "./component/totalProgressIcon";
import Purchases from "react-native-purchases";

let isActivityPushed = false;
let NativeInternetFilter = NativeModules.InternetFilter;
let NativeCallback = NativeModules.checkBundle;
let isPopupInProcess = false;
let isRedirectToLogin = false;
let isCalculationDone = false;

class TodayPage extends React.Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            checkUpFlag: 1,
            checkUpTime: '6pm',
            todayTitle: "Today Activity",
            morningRoutine: [],
            optionalExercies: [],
            todoActivityArray: [
                allOptionalExercies.healthyActivity,
                allOptionalExercies.breathingActivity,
                allOptionalExercies.didYouKnow,
                allOptionalExercies.lettersToYourSelf
            ],
            notificationArray: [],
            blockerArray: [
                // allOptionalExercies.internetFilterActivity,
            ],
            sleepArray: [
                allOptionalExercies.slipeMeditation,
            ],
            dailyDiscussionObject: allOptionalExercies.dailyDiscussion,
            checkupTimeMessage: "",
            checkupTimeMessageDis: "",
            visibleTab: props.visibleTab || "today",
            totalMorningRoutineTimes: "",
            gender: props.gender,
            isAllMorningRoutineDone: false,
            isAudioActivity: false,
            viewCompleted: false,
            appState: AppState.currentState,
            queue: cloneDeep(props.popupQueue),
            isTodayTab: true,
            streakData: null,
            monthlyChallenge: allOptionalExercies.monthlyChallenge || {},
            isShowMonthlyChallenge: false,
            isAskForUpdateCalendar: false,
            isAskTodayCheckup: false,
            isAskYesterdayCheckup: false,
            isReachedList: false,
            viewHideOption: false,
            viewHideOptionMain: true,
            positive: Math.floor(Math.random() * Constant.positiveImage.length) + 0,
            nagative: Math.floor(Math.random() * Constant.sadImage.length) + 0,
            celebration: Math.floor(Math.random() * Constant.celebrationImage.length) + 0,
            relapseCheckup: false,
        };
        global.firstTime = true;
        isPopupInProcess = false;

        // setTimeout(() => {
        //     throw new Error("My first Sentry error!");
        // },3000)
        // debugger
        // OneSignal.setExternalUserId('123ABC123ABC');
        // OneSignal.addEventListener('ids', this.updatePushId.bind(this));
        // OneSignal.configure()
    };

    async updatePushId(device) {
        // alert(JSON.stringify(device))
        // JSON.stringify(device)
        // postJSON(UPDATE_PUSHID_URL,
        //     {
        //         user_id: this.props.user.id,
        //         push_id: device.userId
        //     },
        //     { 'Authorization': this.props.authentication_token }
        // );
    };

    UNSAFE_componentWillMount() {
        if (this.props.route.params) {
            if (this.props.route.params.goToTeamChat) {
                this.props.tabChanged("more");
                this.props.navigation.navigate('More', {selectedTab: 1});
            } else if (this.props.route.params.goToCommunity) {
                this.props.tabChanged("team");
                this.props.navigation.navigate('Team', {goToCommunity: true});
            }
        }
        isRedirectToLogin = false;
        this.setMorningRoutine();
        this.props.setSubscriptionInProcess(false);
        this.props.removeSafeArea(true);
        AppState.removeEventListener('change', this._handleAppStateChange);
        isPopupInProcess = false;
        isActivityPushed = false;
        this.manageMonthlyChalange();
        this.manageMonthlyChalange();
        UserEvent.userTrackScreen("todayPage", "")
    }

    componentDidMount() {
        AsyncStorage.setItem('isCheckupClicked', "false");
        AsyncStorage.setItem('isSubscribe', "false");

        AppState.addEventListener('change', this._handleAppStateChange);

        AsyncStorage.getItem('isNewOpen').then((isNewOpen) => {
            if (isNewOpen) {
                if (isNewOpen === "true") {
                    // if (!__DEV__) {
                    try {
                        // let formatedDate = moment(this.props.userDetails.register_date, 'YYYY-MM-DD');
                        // let day = moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'days')

                        if (Constant.isRelease) {
                            setTimeout(() => {
                                this.checkForSubscriptionNew();  // While release
                            }, 1500)
                        } else {
                            // setTimeout(() => {
                            //     this.checkForSubscriptionNew();  // While release
                            // }, 1500)
                        }

                    } catch (e) {

                    }
                    // }
                }
                AsyncStorage.setItem('isNewOpen', "false");
            }
        });
        this.setWhenComponentMount(false, null, null, false);
        this.props.getCurrentClean().then(res => {
            isCalculationDone = true;
            this.managePopup(true, null, null, res, this.props);
        });
        EventRegister.removeEventListener(this.listener);
        this.listener = EventRegister.addEventListener('isTodayEventListener', (data) => {
            this.setState({
                isTodayTab: data
            }, () => {
                if (data) {
                    this.managePopup(true, 'today', true, null, this.props);
                }
            });
        });
        EventRegister.removeEventListener(this.redirectToLogin);
        this.redirectToLogin = EventRegister.addEventListener('RedirectToLogin', (data) => {
            this.onRedirectToLogin(data);
        });
        this.props.sendTagOneSignal();
        // setTimeout(() => {
        //     this.props.sendNotification();
        // }, 5000)
        this.resetAppBadgeCount();
        this.hideAlltodaysPopup();

        this.props.navigation.addListener('focus', () => {
            // alert('d232323fdf')
            // setTimeout(() => {
            //
            //     if (this.props.appTheme === 'DARK'){
            //         StatusBar.setBarStyle('light-content', false);
            //         StatusBar.setBackgroundColor('#212224', false);
            //     }else{
            //         StatusBar.setBarStyle('dark-content', false);
            //         StatusBar.setBackgroundColor('white', false);
            //     }
            // },3000)
            setTimeout(() => {
                if (this.props.appTheme === 'DARK') {
                    StatusBar.setBarStyle('light-content', false);
                    StatusBar.setBackgroundColor('#212224', false);
                } else {
                    StatusBar.setBarStyle('dark-content', false);
                    StatusBar.setBackgroundColor('white', false);
                }
            }, 500)
            this.checkTutorial();
        });

        if (this.props.tutorialTab1 !== undefined && this.props.tutorialTab1 === false) {
            setTimeout(() => {
                this.props.manageTutorialPopUp({
                        isShow: true,
                        type: "todayPage",
                    }
                )
            }, 800)
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.visibleTab !== nextProps.visibleTab) {
            this.setState({
                visibleTab: nextProps.visibleTab
            });
        }
        AsyncStorage.getItem('isTodayActivityChanged').then((isChanged) => {
            if (isChanged) {
                if (isChanged === "true") {
                    this.setOptionalActivities();
                    this.setToDOActivity();
                    this.setMorningRoutine();
                }
                AsyncStorage.setItem('isTodayActivityChanged', "false");
            }
        });
        this.setCheckupView();
        this.setDayTitle();
        if (this.state.gender !== nextProps.gender) {
            this.setState({
                gender: nextProps.gender,
            });
        }
        this.setMorningRoutineLabel();
        let insideIf = false;
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            if (this.props.last_checkup_at !== nextProps.last_checkup_at ||
                JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue) ||
                JSON.stringify(this.props.p_array) !== JSON.stringify(nextProps.p_array) ||
                JSON.stringify(this.props.showStreakGoalPopUp) !== JSON.stringify(nextProps.showStreakGoalPopUp) ||
                JSON.stringify(this.props.showRewindProgressPopUp) !== JSON.stringify(nextProps.showRewindProgressPopUp) ||
                JSON.stringify(this.props.currentGoal) !== JSON.stringify(nextProps.currentGoal) ||
                JSON.stringify(this.props.levelNumber) !== JSON.stringify(nextProps.levelNumber) ||
                JSON.stringify(this.props.awardToday) !== JSON.stringify(nextProps.awardToday) ||
                JSON.stringify(this.props.notificationPreset) !== JSON.stringify(nextProps.notificationPreset) ||
                this.props.rewiredProgress !== nextProps.rewiredProgress ||
                this.props.streckProgress !== nextProps.streckProgress ||
                this.props.levelProgress !== nextProps.levelProgress ||
                this.props.awardProgress !== nextProps.awardProgress ||
                (this.state.visibleTab !== "today" && nextProps.visibleTab === "today")) {
                insideIf = true;
                // setTimeout(() => {
                this.managePopup(false, nextProps.visibleTab, null,
                    {cleanDays: nextProps.current_p_clean_days, goal: nextProps.currentGoal.goalDays}, nextProps);
                // }, 100);
                this.manageMonthlyChalange();
            }
        }
        if (JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue)) {
            this.setState({
                queue: cloneDeep(nextProps.popupQueue)
            });
            if (!insideIf) {
                if (nextProps.popupQueue.streakGoal == null && nextProps.popupQueue.checkup == null &&
                    nextProps.popupQueue.monthlyChallenge == null && nextProps.popupQueue.rewired == null) {
                    this.managePopup(false, nextProps.visibleTab, null,
                        {cleanDays: nextProps.current_p_clean_days, goal: nextProps.currentGoal.goalDays}, nextProps);
                }
            }
        }
        //Ask for rate popup
        AsyncStorage.getItem('isTodayCheckUpDone').then((isDone) => {
            if (isDone && isDone === "true") {
                this.askForRatePopup();
                AsyncStorage.setItem('isTodayCheckUpDone', "false");
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        try {
            if (isEqual(this.props, nextProps) && isEqual(this.state, nextState)) {
                return false;
            }
            return true;
        } catch (e) {
            console.log("shouldComponentUpdate -- err", e);
        }
        return true;
    }

    componentWillUnmount() {
        this.removeAppListener();
    }

    checkTutorial = () => {
        if (this.props.selectSingleTime === false) {
            setTimeout(() => {
                this.props.themeUpdate(1);
            }, 800)
        } else {
            // alert(this.props.tutorialTab1)
            if (this.props.tutorialTab1 !== undefined && this.props.tutorialTab1 === false) {
                setTimeout(() => {
                    this.props.manageTutorialPopUp({
                            isShow: true,
                            type: "todayPage",
                        }
                    )
                }, 800)
            }
        }
    }

    removeAppListener = () => {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.redirectToLogin);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    resetAppBadgeCount = () => {
        try {
            if (this.props.appBadgeCount == 0 && this.props.eventBadgeCount == 0) {
                PushNotificationIOS.setApplicationIconBadgeNumber(0);
            }
        } catch (e) {
        }
    }

    onSelectNotificatication = (page, isMornigRoutine = '') => {
        try {
            switch (page) {
                case 'calendar':
                    // this.props.tabChanged("milestone");
                    // this.props.navigation.navigate('Milestone');
                    // this.onCompleteExercises(page)
                    this.props.navigation.navigate("checkUp", {
                        isYesterday: true,
                        isFromToday: true,
                        scrollToTopToday: this.scrollToTopToday,
                        transition: "myCustomSlideUpTransition"
                    });
                    break;
                case 'missedcalendar':
                    this.props.navigation.navigate("missedCheckUp", {
                        isYesterday: false,
                        isFromToday: true,
                        scrollToTopToday: this.scrollToTopToday,
                        transition: "myCustomSlideUpTransition"
                    });
                    break;
                case 'updatecalendar':
                    this.props.tabChanged("milestone");
                    this.props.navigation.navigate('Milestone');
                    break
                case 'days':
                    this.props.addMessageTeamChat('', '', this.props.userDetails, this.props.teamID,
                        "streak", this.props.current_p_clean_days).then((res) => {
                    })
                        .catch((err) => {
                        })

                    if (isMornigRoutine.title !== "Cancel") {
                        this.props.navigation.navigate("analysis", {
                            initPage: 1
                        });
                    }
                    this.props.manageNotificationStrek(moment().format("YYYY-MM-DD"))
                    // this.onCompleteExercises(page)
                    break
                case 'rewiring':
                    if (isMornigRoutine.title !== "Cancel") {
                        this.props.navigation.navigate("analysis");
                    }
                    this.props.manageNotificationRewring(moment().format("YYYY-MM-DD"))
                    // this.onCompleteExercises(page)
                    break;
                case 'level':
                    if (isMornigRoutine.title !== "Cancel") {
                        this.props.navigation.navigate("analysis", {
                            initPage: 3
                        });
                    }
                    this.props.manageNotificationLevel(moment().format("YYYY-MM-DD"))
                // this.onCompleteExercises(page)
                case 'award':
                    if (isMornigRoutine.title !== "Cancel") {
                        this.props.navigation.navigate("analysis", {
                            initPage: 2
                        });
                    }
                    this.props.manageNotificationAward(moment().format("YYYY-MM-DD"))
                    // this.onCompleteExercises(page)
                    break
                case 'checkin':
                    if (isMornigRoutine.title === "CheckUp") {
                        this.props.navigation.navigate("checkUp", {
                            isYesterday: false,
                            isFromToday: true,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition",
                            type: 0,
                        });
                    }

                    if (isMornigRoutine.title === "Reschedule checkup time") {
                        EventRegister.emit('setSeduleTime', "true");
                        this.props.tabChanged("milestone");
                        this.props.navigation.navigate('Milestone');
                    }

                    break

            }

        } catch (e) {

        }
    };

    onRedirectToLogin = (data) => {
        if (!isRedirectToLogin) {
            this.removeAppListener();
            if (data !== 'welcome') {
                isRedirectToLogin = true;
                this.props.resetStoreData();
                resetAllAsyncStorageData();
                this.props.navigation.navigate('login');
            }
        }
    }

    _handleAppStateChange = (nextAppState) => {
        // isPopupInProcess = false;
        if (this.state.appState.match(/background/) && nextAppState === 'active') {
            this.props.getCurrentClean().then(res => {
                AsyncStorage.getItem('CheckupInProgress').then(result => {
                    if (result && result == 'false') {
                        // this.checkIsNeedToShowPopup(res.cleanDays, res.goal);
                    }
                    EventRegister.emit('reloadBackgroundToFrontGround', "true");
                    isPopupInProcess = false;
                });
            }).catch(err => {
                this.setWhenComponentMount(true);
            });
            this.props.activeAppManagedTab();
            this.props.managedLetterAPI();
            this.manageMonthlyChalange();
            this.setState({
                isAskForUpdateCalendar: false,
                isAskTodayCheckup: false,
                isAskYesterdayCheckup: false
            });
        } else {
            if (nextAppState === "background" && this.state.appState === "inactive") {
                //app is in background
                isPopupInProcess = true;
                this.setState({
                    streakData: this.props.showStreakGoalPopUp
                });
                this.props.setAskedForCheckupPopup(false);
                this.hideAlltodaysPopup();
            }
        }
        if (nextAppState === 'active') {
            this.props.goalCalculation(true);
            AsyncStorage.setItem('isCheckupClicked', "false");
        }
        this.setState({appState: nextAppState});
    };

    //Hide all open popup while app will enter in background or go to getStarted
    hideAlltodaysPopup = () => {
        this.props.setDateforTodayOpen(false, true, true);
        let objStreak = {
            isShow: false,
            achivedGoal: this.props.showStreakGoalPopUp.achivedGoal,
            displayDate: this.props.showStreakGoalPopUp.displayDate,
            whileGoal: this.props.showStreakGoalPopUp.whileGoal,
            inProcess: false
        }
        this.props.manageStreakAchievedPopup(objStreak);
        this.props.manageRewiredProgressPopup(false, true);
        this.props.managePopupQueue({checkup: null, streakGoal: null, rewired: null, monthlyChallenge: null});
        this.props.manageCheckupPopup({
            isShow: false,
            checkUpDetail: {}
        });
        // isPopupInProcess = false;
    };

    //Rate popup -> call is says today is porn free day
    askForRatePopup = () => {
        if (this.props.current_p_clean_days > 30) {
            AsyncStorage.getItem("AppInstallationDate").then(res => {
                if (res) {
                    let iDate = moment(res, 'YYYY-MM-DD').toDate();
                    let diff = moment().diff(iDate, 'days');
                    if (diff >= 2) {
                        AsyncStorage.getItem("isAskToGiveRate").then(isAsk => {
                            if (isAsk === null || isAsk !== "true") {
                                // alert("Ask for rate popup")
                                if (Constant.isIOS) {
                                    if (StoreReview.isAvailable) {
                                        // StoreReview.requestReview();
                                        AsyncStorage.setItem("isAskToGiveRate", "true");
                                    }
                                }
                            }
                        }).catch(err => {
                            if (__DEV__) {
                                alert(err)
                            }
                        });
                    }
                }
            }).catch(err => {
                if (__DEV__) {
                    alert(err)
                }
            });
        }
    }

    //connection change
    manageConnectionChangeListener = () => {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.fetch().then(isConnected => {
            this.handleFirstConnectivityChange(isConnected)
        });
    };

    handleFirstConnectivityChange = (isConnected) => {
        this.props.setIsNetworkAvailable(isConnected);

        if (isConnected === true) {
            AsyncStorage.getItem('isSubscribe').then((isSubscribe) => {
                if (isSubscribe == 'false') {
                    // if (!__DEV__) {
                    try {
                        // let formatedDate = moment(this.props.userDetails.register_date, 'YYYY-MM-DD');
                        // let day = moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'days')

                        if (Constant.isRelease) {
                            setTimeout(() => {
                                this.checkForSubscriptionNew();  // While release
                            }, 1500)
                        } else {
                            // setTimeout(() => {
                            //     this.checkForSubscriptionNew();  // While release
                            // }, 1500)
                        }
                    } catch (e) {
                    }
                }
            });
        }
    };

    setWhenComponentMount = (isActive = false, visibleTab = null, isTodayTab = null, isCallPopup = true) => {
        this.manageConnectionChangeListener();
        this.props.setSubscriptionInProcess(false);
        this.setCheckupView();
        this.setDayTitle();
        this.setMorningRoutine();
        this.setOptionalActivities();
        this.setToDOActivity();

        this.props.setUpLocalNotificationAlerts();
        if (isCallPopup) {
            setTimeout(() => {
                this.managePopup(isActive, visibleTab, isTodayTab, null, this.props);
            }, 100);
        }
        this.setAllUpdatedData();
    };

    makeFadeInAnimation = () => {
        // this.props.removeSafeArea(true);
        // if (this.refs.mainView) {
        //     this.refs.mainView.fadeIn(200);
        // }
    };

    checkIsNeedToShowPopup = (cleanDays, goal) => {
        //Streak goal
        let showStreakGoalPopUp = this.state.streakData;
        let currentClean = cleanDays;
        if (currentClean != 0 && !showStreakGoalPopUp.inProcess && !showStreakGoalPopUp.isShow) {
            let userGoals = Constant.userGoals;
            if (userGoals.includes(currentClean)) {
                let today = new Date().toDateString();
                // if (showStreakGoalPopUp.achivedGoal != currentClean) {
                if (showStreakGoalPopUp.displayDate === today && showStreakGoalPopUp.whileGoal === goal) {
                    //do nothing
                } else {
                    if (showStreakGoalPopUp.achivedGoal != currentClean || showStreakGoalPopUp.displayDate !== today) {
                        this.props.navigation.navigate('Today');
                        this.props.tabChanged("today");
                        this.setWhenComponentMount(true, 'today', true);
                        this.setState({
                            isTodayTab: true
                        });
                        return;
                    }
                }
                // }
            }
        }

        //Rewired
        let obj = this.props.showRewindProgressPopUp;
        let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
        if (diff !== 0 && (diff % 10 === 0) && !obj.isShow) {
            this.props.navigation.navigate('Today');
            this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            });
            return;
        }

        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        if (currentHour >= checkupHour && this.props.last_checkup_at !== moment().format("YYYY-MM-DD")) {
            // this.props.navigation.navigate('Today');
            // this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            })
            return;
        }

        this.setWhenComponentMount(true);
    }

    managePopup = (isActive = false, visibleTab = null, isTodayTab = null, goalData = null, nextProps = null) => {
        if (!isCalculationDone) {
            return;
        }
        try {
            if (nextProps == null) {
                nextProps = this.props;
            }
            let arrMain = [];

            // if (!isPopupInProcess) {
            isPopupInProcess = true;
            if (visibleTab == null) {
                visibleTab = nextProps.visibleTab;
            }
            if (isTodayTab === null) {
                isTodayTab = this.state.isTodayTab;
            }

            if ((this.state.appState === 'active' || isActive) && visibleTab === "today") {
                let checkupDate = nextProps.last_checkup_at;
                let date = new Date().toDateString();
                let objFirstAsk = nextProps.isOpenFirstTime;
                let currentHour = new Date().getHours();
                let checkupHour = nextProps.checkupTime;
                let todayDate = moment().format("YYYY-MM-DD");
                let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                let dayBeforeYesterdayDate = moment().subtract(2, 'days').format('YYYY-MM-DD');

                // if (currentHour < checkupHour) {
                if (nextProps.last_checkup_at === yesterdayDate
                    || nextProps.last_checkup_at === todayDate || nextProps.last_checkup_at === ""
                    || nextProps.last_checkup_at === null) {
                } else {
                    if (nextProps.last_checkup_at === dayBeforeYesterdayDate && !this.state.isAskYesterdayCheckup) {
                        if (find(nextProps.p_array.data, {occurred_at: yesterdayDate}) === undefined
                            && nextProps.popupQueue.checkup == null) {
                            // nextProps.manageCheckupPopup({
                            //     isShow: true,
                            //     checkUpDetail: {
                            //         title: this.getGreetingMessage(nextProps.userName),
                            //         alertMessage: "You missed your checkup yesterday",
                            //         buttonTitle: strLocale("today.Complete now"),
                            //         closeText: "",
                            //         pageName: "checkUp",
                            //         scrollToTopToday: this.scrollToTopToday,
                            //         isYesterday: true
                            //     }
                            // });
                            let value = this.state.notificationArray;

                            // if (!find(this.state.notificationArray, notificationList.checkUpNotification)) {

                            let dict = notificationList.checkUpNotification;
                            dict.title = strLocale("today.Checkup Now");
                            dict.desc = "You missed your checkup yesterday";
                            arrMain.push(dict);
                            // this.setState({
                            //     isAskYesterdayCheckup: true,
                            //     notificationArray: value
                            // })
                            // }

                            if (global.isOpenNotificationMissedCheckupYesterday && global.isOpenNotificationMissedCheckupYesterday === true) {
                                global.isOpenNotificationMissedCheckupYesterday = false;
                                this.props.navigation.navigate("checkUp", {
                                    isYesterday: true,
                                    isFromToday: true,
                                    scrollToTopToday: this.scrollToTopToday,
                                    transition: "myCustomSlideUpTransition"
                                });
                            }

                            nextProps.setDateforTodayOpen(false, false);
                            isPopupInProcess = false;
                        }
                        nextProps.setDateforTodayOpen(false, false);
                    } else {
                        // if (objFirstAsk.date === date && objFirstAsk.isAskForUpdateCalendar) {
                        //     // if(isActive){
                        //     //     if (find(nextProps.p_array.data, {occurred_at: todayDate}) === undefined &&
                        //     //         find(nextProps.p_array.data, {occurred_at: yesterdayDate}) === undefined &&
                        //     //         find(nextProps.p_array.data, {occurred_at: dayBeforeYesterdayDate}) === undefined) {
                        //     //         nextProps.manageCheckupPopup({
                        //     //             isShow: true,
                        //     //             checkUpDetail: {
                        //     //                 title: "Welcome back " + nextProps.userName,
                        //     //                 alertMessage: "Take a moment to update your calendar.",
                        //     //                 buttonTitle: "Update calendar",
                        //     //                 closeText: "Update later",
                        //     //                 pageName: "editPornCalendar"
                        //     //             }
                        //     //         });
                        //     //     }
                        //     //     nextProps.setDateforTodayOpen(true, false);
                        //     // }
                        // } else {
                        //All time here
                        // if (!this.state.isAskForUpdateCalendar) {
                        if (find(nextProps.p_array.data, {occurred_at: todayDate}) === undefined &&
                            find(nextProps.p_array.data, {occurred_at: yesterdayDate}) === undefined &&
                            find(nextProps.p_array.data, {occurred_at: dayBeforeYesterdayDate}) === undefined &&
                            nextProps.popupQueue.checkup == null) {
                            // nextProps.manageCheckupPopup({
                            //     isShow: true,
                            //     checkUpDetail: {
                            //         title: strLocale("today.Welcome back", {name: nextProps.userName}),
                            //         alertMessage: "Take a moment to update your calendar",
                            //         buttonTitle: "Update calendar",
                            //         closeText: "Update later",
                            //         pageName: "editPornCalendar"
                            //     }
                            // });

                            if (this.props.register_date === moment().format("YYYY-MM-DD")) {
                                let dict = notificationList.newUserCalendar;
                                dict.title = `Welcome ${this.props.userName}`;
                                dict.desc = "today.Update your calendar";
                                arrMain.push(dict);
                            } else {
                                arrMain.push(notificationList.checkUpCalendarUpdate);
                            }

                            // if (!find(this.state.notificationArray, notificationList.checkUpNotification)) {
                            //     let value = this.state.notificationArray;
                            //     value.push(notificationList.checkUpNotification);
                            //     this.setState({
                            //         isAskForUpdateCalendar: true,
                            //         notificationArray: value
                            //     })
                            // }
                        }
                        nextProps.setDateforTodayOpen(true, false);
                        isPopupInProcess = false;
                        // }
                        // }
                    }
                }

                //Streak goal
                let showStreakGoalPopUp = nextProps.showStreakGoalPopUp;
                let currentClean = nextProps.current_p_clean_days;
                let goalDays = nextProps.currentGoal.goalDays;
                if (goalData !== null) {
                    currentClean = goalData.cleanDays;
                    goalDays = goalData.goal;
                }

                let userGoals = Constant.userGoals;
                if (userGoals.includes(currentClean)) {
                    let today = new Date().toDateString();

                    if (nextProps.streckProgress !== moment().format("YYYY-MM-DD")) {

                        let dict = notificationList.streakGoal;
                        dict.title = global.generalArchievementStr;
                        dict.desc = strLocale("today.You completed the 10 day challenge", {currentClean: currentClean});
                        arrMain.push(dict);

                        let objStreak = {
                            isShow: false,
                            achivedGoal: currentClean,
                            displayDate: today,
                            whileGoal: goalDays,
                            inProcess: false
                        }
                        this.props.manageStreakAchievedPopup(objStreak);
                    }
                }

                //Rewired progress
                if (nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null && this.state.isReachedList === false) {
                    let obj = nextProps.showRewindProgressPopUp;
                    let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
                    if (diff !== 0 && (diff % 5 === 0) && !obj.isShow) {

                        let dict = notificationList.rewiringTotal;
                        dict.title = global.generalaBestStr;
                        dict.desc = strLocale("today.You have reached 10 total rewired", {review: obj.rewindDetail.totalRewiringPercentage});

                        let value = this.state.notificationArray;
                        if (nextProps.rewiredProgress !== moment().format("YYYY-MM-DD")) {
                            arrMain.push(dict);
                        }

                        this.props.manageRewiredProgressPopup(false, true);
                    }
                }

                //Complete Level
                if (this.props.levelNumber.date === moment().format("YYYY-MM-DD")) {
                    let dict = notificationList.levelIncrease;
                    dict.title = global.generalaBestStr;
                    dict.desc = strLocale("today.You have reached level 10", {level: this.props.levelNumber.level});

                    let value = this.state.notificationArray;

                    if (nextProps.levelProgress !== moment().format("YYYY-MM-DD")) {
                        arrMain.push(dict);
                    }
                }

                //Award today compeleted
                if (this.props.awardToday.date === moment().format("YYYY-MM-DD")) {
                    if (this.props.awardToday.awardToday.length !== 0) {
                        let dict = notificationList.reachAward;

                        if (nextProps.awardProgress !== moment().format("YYYY-MM-DD")) {
                            dict.title = global.generalGoalStr;
                            if (this.props.awardToday.awardToday.length === 1) {
                                dict.desc = strLocale("today.You have completed new award", {award: this.props.awardToday.awardToday[0].name});
                            } else {
                                dict.desc = strLocale("today.You have completed new award and other more award", {award: this.props.awardToday.awardToday[0].name});
                            }
                            arrMain.push(dict);
                        }
                    }
                }

                this.setState({
                    notificationArray: arrMain
                })


                // let dict = notificationList.checkUpNotification;
                // dict.title = `You completed the ${55} day challenge`;
                //
                // let value = this.state.notificationArray;
                // value.push(dict);
                // this.setState({
                //     notificationArray: value
                // });

                // //Monthly Challenge
                // let currentDate = new Date().getDate();
                // if (currentDate == 1) {
                //     if (nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null
                //         && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null)) {
                //
                //         let currentMonth = new Date().getMonth();
                //         let currentYear = new Date().getFullYear();
                //         let prevMonth = currentMonth - 1;
                //         if (currentMonth == 0) {
                //             prevMonth = 11;  //December
                //             currentYear = currentYear - 1;
                //         }
                //         if (nextProps.clean_p_days_per_month && nextProps.clean_p_days_per_month[currentYear.toString()] &&
                //             nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"]) {
                //             let lastMonth = nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"][prevMonth];
                //             if (lastMonth == 100) {
                //                 if (nextProps.monthlyChallengeAchived && nextProps.monthlyChallengeAchived.month != prevMonth &&
                //                     nextProps.monthlyChallengeAchived.year != currentYear) {
                //                     nextProps.manageMonthlyChallengeAchieved({
                //                         month: prevMonth,
                //                         year: currentYear,
                //                         showDate: moment().format("YYYY-MM-DD")
                //                     });
                //                     nextProps.manageMonthlyChallengePopup({
                //                         isShow: true,
                //                         monthlyDetail: {
                //                             year: currentYear,
                //                             month: prevMonth,
                //                             description: strLocale("today.Challenge success"),
                //                             title: strLocale("today.Clean month", {month: getCurrentMonth(prevMonth)}),
                //                             iconType: "Y",
                //                             progressPer: "100%",
                //                             actualProgress: strLocale("today.Progress", {per: 100}),
                //                             type: 'rewiring',
                //                             isAchieved: true
                //                         }
                //                     });
                //                     isPopupInProcess = false;
                //                 }
                //             }
                //         }
                //     }
                // }

            }
            isPopupInProcess = false;
            // }
        } catch (e) {
            isPopupInProcess = false;
            console.log(e)
        }
    }

    setAllUpdatedData = () => {
        if (this.props.todayViewInstance !== null) {
            clearInterval(this.props.todayViewInstance);
        }
        let instance = setInterval(() => {
            let currentHour = new Date().getHours();
            if (currentHour === 0) {
                let today = new Date().toDateString();
                if (this.props.dateForAPICall !== today) {
                    this.props.setDoneAPICallForToday().then(res => {
                        // this.props.loadDataOnAppOpen().then((res) => {
                        //     this.props.setUpLocalNotificationAlerts();
                        //     setTimeout(() => {
                        //         this.managePopup();
                        //     }, 400);
                        // }).catch((err) => {
                        // });
                        this.setMorningRoutine();
                        this.setOptionalActivities();
                        this.setToDOActivity();
                    })
                }
                this.props.goalCalculation(true);
            } else {
                this.props.goalCalculation();
            }
            this.managePopup();
        }, 10000);
        this.props.manageTodayInstances(instance);
    };

    setDayTitle = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let today = new Date().getDay();
        this.setState({
            todayTitle: strLocale("today.Today Activity")
        });
    };

    manageMonthlyChalange = () => {
        let todayDate = new Date().getDate();
        if (todayDate == 1) {
            let todayDate = moment().format("YYYY-MM-DD");
            let todayObj = find(this.props.p_array, {occurred_at: todayDate});
            if (todayObj != undefined && todayObj.is_relapse) {
                this.setState({
                    isShowMonthlyChallenge: false,
                });
            } else {
                let objMonthlyChallenge = this.state.monthlyChallenge;
                objMonthlyChallenge.title = getCurrentMonth() + " challenge";
                objMonthlyChallenge.Icon = iconImage.monthlyIcons[new Date().getMonth()];
                this.setState({
                    monthlyChallenge: objMonthlyChallenge,
                    isShowMonthlyChallenge: true,
                });
            }
        } else {
            this.setState({
                isShowMonthlyChallenge: false
            });
        }
    }

    onSelectMonthlyChallenge = (obj) => {
        this.props.manageMonthlyChallengePopup({
            isShow: true,
            monthlyDetail: {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                description: strLocale("today.Report a clean day every day this month to win this achievement"),
                title: strLocale("today.month challenge", {month: getCurrentMonth()}),
                iconType: "Y",
                progressPer: "4%",
                actualProgress: strLocale("today.Progress", {per: 0}),
                type: 'today',
            }
        });
    }

    setMorningRoutine = () => {
        try {
            let today = new Date().getDay();
            let morningRoutine = [];
            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.registered_at === todayDate) {
                morningRoutine = [
                    allMorningRoutine.rMeditation,
                    allMorningRoutine.rStory,
                    allMorningRoutine.audioActivity,
                    allMorningRoutine.rExercise,
                ];
            } else {
                switch (today) {
                    case 1 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rExercise,
                            allMorningRoutine.rStory,
                            allMorningRoutine.audioActivity
                        ];
                        break;
                    case 2 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rExercise,
                            allMorningRoutine.rStory2,
                            allMorningRoutine.rChoosePath,
                        ];
                        break;
                    case 3 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rExercise,
                            allMorningRoutine.audioActivity,
                            allMorningRoutine.rStory2,
                        ];
                        break;
                    case 4 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rExercise,
                            allMorningRoutine.rStory2,
                            allMorningRoutine.rChoosePath,
                        ];
                        break;
                    case 5 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rExercise,
                            allMorningRoutine.rStory2,
                            allMorningRoutine.audioActivity
                        ];
                        break;
                    case 6 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rChoosePath,
                            allMorningRoutine.rStory,
                            // allMorningRoutine.gamePowerMemory
                        ];
                        break;
                    case 0 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                            allMorningRoutine.rStory2,
                            allMorningRoutine.audioActivity,
                            // allMorningRoutine.gameActivity,
                        ];
                        break;
                }
            }

            let filteredMorning = [];
            morningRoutine.forEach(obj => {
                if (obj) {
                    if (find(this.props.todayScreenExercise, {pageName: obj.pageName}) === undefined
                        || find(this.props.todayScreenExercise, {
                            pageName: obj.pageName,
                            isSelected: true
                        }) !== undefined) {
                        filteredMorning.push(obj);
                    }
                }
            });
            let totalTime = 0;
            filteredMorning.forEach(obj => {
                if (obj) {
                    totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
                }
            });


            // filteredMorning = [
            //     allMorningRoutine.gameActivity,
            //     allMorningRoutine.rExercise,
            //     allMorningRoutine.rStory,
            //     allMorningRoutine.gamePowerMemory
            // ];
            /*Completed activity
            allMorningRoutine.rMeditation,
            allMorningRoutine.rExercise,
            allMorningRoutine.rStory
            allMorningRoutine.gameActivity
            allMorningRoutine.gamePowerMemory
            */


            this.setState({
                morningRoutine: filteredMorning,
                totalMorningRoutineTimes: strLocale("today.minutes", {totalTime})
            });
            this.props.setMorningRoutine(filteredMorning);
        } catch (e) {
            console.log(e)
        }
    };

    setMorningRoutineLabel = () => {
        let index = 0;
        let totalTime = 0;
        let today = new Date().toDateString();
        this.state.morningRoutine.forEach(obj => {
            totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
            if (this.isReplayActivity(obj.pageName)) {
                index += 1;
            }
        });
        if (index === this.state.morningRoutine.length || index === 0) {
            this.setState({
                totalMorningRoutineTimes: strLocale("today.minutes", {totalTime}),
                isAllMorningRoutineDone: index === this.state.morningRoutine.length
            });
        } else {
            this.setState({
                totalMorningRoutineTimes: strLocale("today.Tap to resume")
            });
        }
    };

    setOptionalActivities = () => {
        try {
            let isAudioActivity = false;
            let today = new Date().getDay();
            let optionalExercies = [];
            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.registered_at === todayDate) {
                isAudioActivity = true;
                optionalExercies = [
                    allOptionalExercies.didYouKnow, //..
                    allOptionalExercies.stressRelief]; //..
            } else {
                switch (today) {
                    case 1 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.stressRelief, //
                            allOptionalExercies.healthyActivity, //..
                        ];
                        break;
                    case 2 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity, //..
                        ];
                        break;
                    case 3 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.healthyActivity,
                        ];
                        break;
                    case 4 :
                        optionalExercies = [
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity,
                        ];
                        break;
                    case 5 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.didYouKnow,
                        ];
                        break;
                    case 6 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.healthyActivity,
                            allOptionalExercies.stressRelief,
                        ];
                        break;
                    case 0 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity,
                        ];
                        break;
                }
            }
            optionalExercies = [
                allOptionalExercies.healthyActivity,
            ];
            let filteredOptional = [];
            let cardPosition = 0;
            if (this.props.exercise_number_profile <= 9) {
                let description = ["", "psychology", "anxiety", "self-esteem", "stress",
                    "relationship", "behavioural", "activity", "dietary", ""];
                if (this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)) {
                    allOptionalExercies.aboutYouActivity.desc = "Complete your " + description[this.props.exercise_number_profile - 1] + " profile";
                } else {
                    allOptionalExercies.aboutYouActivity.desc = "Complete your " + description[this.props.exercise_number_profile] + " profile";
                }
                if (this.props.exercise_number_profile > 8) {
                    if (this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)) {
                        optionalExercies.splice(0, 0, allOptionalExercies.aboutYouActivity);
                        cardPosition = 1;
                    }
                } else {
                    optionalExercies.splice(0, 0, allOptionalExercies.aboutYouActivity);
                    cardPosition = 1;
                }
            }
            PushNotificationIOS.checkPermissions(res => {
                if (res.alert == 1) {
                    //Allow
                } else {
                    //Show notification card
                    if (find(this.props.todayScreenExercise, {pageName: "notificationsReminder"}) === undefined
                        || find(this.props.todayScreenExercise, {
                            pageName: "notificationsReminder",
                            isSelected: true
                        }) !== undefined) {
                        optionalExercies.splice(cardPosition, 0, allOptionalExercies.notificationActivity);
                        cardPosition = cardPosition + 1;
                    }
                }

                AsyncStorage.getItem('isFilterOnToday').then((isFilterOnToday) => {
                    if (isFilterOnToday === null || this.isReplayActivity(allOptionalExercies.internetFilterActivity.pageName)) {
                        optionalExercies.splice(cardPosition, 0, allOptionalExercies.internetFilterActivity);
                    }
                    //If Did you know > 15 then not diaply card
                    if (this.props.exercise_number_learn > 15) {
                        if (this.props.exercise_number_learn == 16 && this.isReplayActivity(allOptionalExercies.didYouKnow.pageName)) {
                            //Do nothing
                        } else {
                            let index = optionalExercies.indexOf(allOptionalExercies.didYouKnow);
                            if (index >= 0) {
                                optionalExercies.splice(index, 1);
                            }
                        }
                    }

                    optionalExercies.forEach(obj => {
                        if (find(this.props.todayScreenExercise, {pageName: obj.pageName}) === undefined
                            || find(this.props.todayScreenExercise, {
                                pageName: obj.pageName,
                                isSelected: true
                            }) !== undefined) {
                            filteredOptional.push(obj);
                        }
                    });

                    if (find(this.props.todayScreenExercise, {
                        pageName: allOptionalExercies.audioActivity.pageName,
                        isSelected: false
                    }) !== undefined) {
                        isAudioActivity = false;
                    }
                    if (find(this.props.todayScreenExercise, {pageName: "journal", isSelected: true}) !== undefined) {
                        filteredOptional.push(allOptionalExercies.journalActivity);
                    }
                    this.setState({
                        optionalExercies: cloneDeep(filteredOptional),
                        isAudioActivity: isAudioActivity
                    });
                });
            });
        } catch (e) {
            console.log(e)
        }
    };

    setToDOActivity = () => {
        try {
            let isAudioActivity = false;
            let today = new Date().getDay();

            let optionalExercies = [];

            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.registered_at === todayDate) {
                optionalExercies = [
                    allOptionalExercies.healthyActivity,
                    allOptionalExercies.didYouKnow,
                    allOptionalExercies.kegalsActivity,
                    allOptionalExercies.visualizationActivity,
                ];
            } else {
                switch (today) {
                    case 1 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.healthyActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.visualizationActivity,
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.internetFilterActivity,
                        ];
                        break;
                    case 2 :
                        optionalExercies = [
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                        ];
                        break;
                    case 3 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.healthyActivity,
                            allOptionalExercies.visualizationActivity,
                            allOptionalExercies.lettersToYourSelf,
                        ];
                        break;
                    case 4 :
                        optionalExercies = [
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.lettersToYourSelf,
                        ];
                        break;
                    case 5 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.healthyActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.lettersToYourSelf,
                        ];
                        break;
                    case 6 :
                        optionalExercies = [
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.lettersToYourSelf,
                        ];
                        break;
                    case 0 :
                        optionalExercies = [
                            allOptionalExercies.visualizationActivity,
                        ];
                        break;
                }
            }

            this.setState({
                todoActivityArray: cloneDeep(optionalExercies),
            });
        } catch (e) {
            console.log(e)
        }
    };

    setCheckupView = () => {
        let currentHour = new Date().getHours();
        let currentMinute = new Date().getMinutes();
        let checkupHour = this.props.checkupTime;
        let checkUpTime = this.state.checkUpTime;
        switch (checkupHour) {
            case 18:
                checkUpTime = "6pm";
                break;
            case 19:
                checkUpTime = "7pm";
                break;
            case 20:
                checkUpTime = "8pm";
                break;
            case 21:
                checkUpTime = "9pm";
                break;
            case 22:
                checkUpTime = "10pm";
                break;
            case 23:
                checkUpTime = "11pm";
                break;
        }

        //Before checkup time and after checkup
        //Before checkup time and after checkup
        let flag = 1;

        try {
            let settingNotifications = this.props.settingNotifications;
            // alert(settingNotifications[0].hours);
            if (settingNotifications[0].hours) {
                if (parseInt(currentHour) > parseInt(settingNotifications[0].hours)) {
                    flag = 2;
                } else if (parseInt(currentHour) === parseInt(settingNotifications[0].hours)) {
                    let value = settingNotifications[0].minute && parseInt(settingNotifications[0].minute) || 0;
                    if (parseInt(currentMinute) >= value) {
                        flag = 2;
                    }
                }
            } else {
                let hourHere = settingNotifications[0].selectedTime;
                if (hourHere.toString().includes('am')) {
                    hourHere = parseInt(hourHere);
                } else if (hourHere.toString().includes('pm')) {
                    hourHere = parseInt(hourHere) + 12;
                }

                if (parseInt(currentHour) > parseInt(hourHere)) {
                    flag = 2;
                } else if (parseInt(currentHour) === parseInt(hourHere)) {
                    let value = settingNotifications[0].minute && parseInt(settingNotifications[0].minute) || 0;
                    if (parseInt(currentMinute) >= value) {
                        flag = 2;
                    }
                }
            }
        } catch (e) {

        }
        if (flag === 2 && global.isOpenNotificationTodayUpdate && global.isOpenNotificationTodayUpdate === true) {
            global.isOpenNotificationTodayUpdate = false;
            this.onPressCheckUp();
        }

        this.getCheckupMessage(flag, checkUpTime);
        this.setState({
            checkUpTime: checkUpTime,
            checkUpFlag: flag,
        });
    };

    getCheckupMessage = (flag, checkUpTime) => {
        try {
            let messageLoc = "It's time for your checkup";
            let message = strLocale("today.It's time for your checkup");
            let todayDate = moment().format("YYYY-MM-DD");
            let relapseCheckup = false
            if (this.props.last_checkup_at === todayDate) {
                message = (Constant.screenWidth < 350) && strLocale("today.Checkup complete")
                    || strLocale("today.Checkup done Tap to redo");
                messageLoc = "Checkup done Tap to redo";

                try {
                    let todayDate = moment().format("YYYY-MM-DD");
                    let todayObj = find(this.props.p_array.data, {occurred_at: todayDate});
                    if (todayObj) {
                        relapseCheckup = todayObj.is_relapse
                    }
                } catch (e) {

                }
            } else {
                if (flag === 1) {
                    if (Constant.screenWidth < 350) {
                        message = strLocale("today.Checkup set for time", {checkUpTime});
                        messageLoc = "Checkup set for time " + checkUpTime;
                    } else {
                        message = strLocale("today.Checkup scheduled for time", {checkUpTime});
                        messageLoc = "Checkup scheduled for time " + checkUpTime;
                    }
                }
            }
            this.setState({
                checkupTimeMessage: messageLoc,
                checkupTimeMessageDis: message,
                relapseCheckup: relapseCheckup
            });
        } catch (e) {
            console.log(e)
        }
    };

    getGreetingMessage = (userName) => {
        let myDate = new Date();
        let hrs = myDate.getHours();
        if (hrs < 12)
            return strLocale("greeting.GM", {name: userName});
        else if (hrs >= 12 && hrs <= 17)
            return strLocale("greeting.GA", {name: userName});
        else if (hrs >= 17 && hrs <= 24)
            return strLocale("greeting.GE", {name: userName});
    };

    onLifeTreeSelect = () => {
        this.props.removeSafeArea();
        this.props.navigation.navigate("lifeTree", {
            makeFadeInAnimation: this.makeFadeInAnimation,
            scrollToTopToday: this.scrollToTopToday,
            isFromTodayScreen: true,
            onBackLifeTree: this.onBackLifeTree, transition: "myCustomSlideUpTransition"
        });
        isActivityPushed = true;
    };

    onCheckupCardClicked = (type) => {
        try {
            let todayDate = moment().format("YYYY-MM-DD");
            let currentHour = new Date().getHours();
            let checkupHour = this.props.checkupTime;
            // if (currentHour < checkupHour) {
            if (this.props.last_checkup_at === todayDate) {
                this.props.manageCheckupPopup({
                    isShow: true,
                    checkUpDetail: {
                        title: strLocale("today.Checkup done"),
                        alertMessage: "Would you like to redo your checkup?",
                        buttonTitle: "Redo checkup",
                        closeText: "Keep existing checkup",
                        pageName: "checkUp",
                        scrollToTopToday: this.scrollToTopToday,
                        type: type,
                    }
                });
            } else {
                // this.props.manageCheckupPopup({
                //     isShow: true,
                //     checkUpDetail: {
                //         title: strLocale("today.Checkup set for time", {checkUpTime: this.state.checkUpTime}),
                //         alertMessage: "Would you like to checkup now?",
                //         buttonTitle: "Begin",
                //         closeText: "Checkup later",
                //         pageName: "checkUp",
                //         scrollToTopToday: this.scrollToTopToday,
                //         type: type,
                //     }
                // });
                this.props.removeSafeArea();
                AsyncStorage.getItem('isCheckupClicked').then((isCheckupClicked) => {
                    AsyncStorage.setItem('isCheckupClicked', "true");
                    if (isCheckupClicked || isCheckupClicked === "false") {
                        this.props.navigation.navigate("checkUp", {
                            isYesterday: false,
                            isFromToday: true,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition",
                            type: type,
                        });
                    }
                });
            }
            // }
            // else {
            //     this.props.removeSafeArea();
            //     AsyncStorage.getItem('isCheckupClicked').then((isCheckupClicked) => {
            //         AsyncStorage.setItem('isCheckupClicked', "true");
            //         if (isCheckupClicked || isCheckupClicked === "false") {
            //             alert(type)
            //             this.props.navigation.navigate("checkUp", {
            //                 isYesterday: false,
            //                 isFromToday: true,
            //                 scrollToTopToday: this.scrollToTopToday,
            //                 transition: "myCustomSlideUpTransition",
            //                 type: type,
            //             });
            //         }
            //     });
            // }
        } catch (e) {
            console.log(e)
        }
    };

    //Managed Pushnotification enable or disable card
    notificationCardPress = () => {
        try {
            NativeCallback.checkForNotification((error, events) => {
                if (events == "NotDetermined") {
                    PushNotificationIOS.requestPermissions().then(res => {
                        if (res.alert == 1) {
                            this.setOptionalActivities();
                            this.setToDOActivity();
                            this.props.sendTagOneSignal();
                            //allow
                        } else {
                            //don't allow
                        }
                    }).catch(res => {
                    });
                } else {
                    showThemeAlert({
                        title: strLocale("App Permission Denied"),
                        message: strLocale("App Permission Denied Desc"),
                        leftBtn: strLocale("Cancel"),
                        styleLeft: 'destructive',
                        rightBtn: strLocale("Settings"),
                        rightPress: (i) => {
                            Linking.canOpenURL('app-settings:').then(supported => {
                                Linking.openURL('app-settings:')
                            }).catch(error => {
                            })
                        },
                    });
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    onSelectExercises = (page, isMornigRoutine = false) => {
        try {
            if (page === "morningRoutine") {
                this.manageMorningRoutine();
            } else {
                this.props.removeSafeArea();
                if (isMornigRoutine) {
                    let obj = find(this.state.morningRoutine, {pageName: page});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    let length = this.state.morningRoutine.length;
                    isActivityPushed = true;

                    let completedMorningRoutine = [];
                    let today = new Date().toDateString();
                    if (this.props.completedMorningRoutine.completedDate === today) {
                        completedMorningRoutine = this.props.completedMorningRoutine.routineActivities;
                    } else {
                        if (this.props.completedMorningRoutine.routineActivities.length > 0) {
                            this.props.onCompletedMorningRoutine();
                        }
                    }
                    let morningRoutine = this.props.morningRoutine;
                    let isLast = (morningRoutine.length === completedMorningRoutine.length + 1);
                    this.props.navigation.navigate(page,
                        {
                            pageName: page,
                            isReplay: this.isReplayActivity(page),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            improve: obj.improve || [],
                            isOptional: false,
                            isLast: isLast,
                            introTitle: strLocale("ex.Exercise index of length", {index: objIndex, length: length}),
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                } else {
                    if (page === "notificationsReminder") {
                        this.notificationCardPress();
                    } else if (page === "journalActivity") {
                        this.onJournalActivityPress();
                    } else {
                        let obj = find(allOptionalExercies, {pageName: page});
                        if (page.includes("internetFilter")) {
                            NativeInternetFilter.checkIsFilterEnable((error, events) => {
                                if (events == "NULL") {
                                    this.props.navigation.navigate(page,
                                        {
                                            isReplay: this.isReplayActivity(page),
                                            pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                            isOptional: true,
                                            improve: obj.improve || [],
                                            onCompleteExercises: this.onCompleteExercises,
                                            makeFadeInAnimation: this.makeFadeInAnimation,
                                            scrollToTopToday: this.scrollToTopToday,
                                            transition: "myCustomSlideUpTransition"
                                        });
                                    isActivityPushed = true;
                                } else {
                                    this.props.navigation.navigate("internetFilter",
                                        {
                                            isReplay: this.isReplayActivity(page),
                                            pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                            isOptional: true,
                                            improve: obj.improve || [],
                                            onCompleteExercises: this.onCompleteExercises,
                                            makeFadeInAnimation: this.makeFadeInAnimation,
                                            scrollToTopToday: this.scrollToTopToday,
                                            transition: "myCustomSlideUpTransition"
                                        });
                                    isActivityPushed = true;
                                }
                            });
                        } else {
                            this.props.navigation.navigate(page,
                                {
                                    isReplay: this.isReplayActivity(page),
                                    pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                    isOptional: true,
                                    improve: obj.improve || [],
                                    onCompleteExercises: this.onCompleteExercises,
                                    makeFadeInAnimation: this.makeFadeInAnimation,
                                    scrollToTopToday: this.scrollToTopToday,
                                    transition: "myCustomSlideUpTransition"
                                });
                            isActivityPushed = true;
                        }
                    }
                }
            }
        } catch (e) {
            isActivityPushed = false;
            isToday = true;
            if (__DEV__) {
                alert("onSelectExercises - " + JSON.stringify(e))
            }
        }
    };

    onSelectDailyDiscussion = () => {
        //this.props.dailyDiscussion
        this.props.removeSafeArea(true);
        this.props.navigation.navigate('commentCommunity', {
            detail: this.props.dailyDiscussion[0],
            index: 0,
            feedId: this.props.dailyDiscussion[0].feedId,
            type: "dailydiscussion",
        })
    }

    onSOSPress = () => {
        this.props.navigation.navigate('sosController');
    };

    manageMorningRoutine = () => {
        try {
            if (this.state.morningRoutine.length > 0) {
                let today = new Date().toDateString();
                let completedMorningRoutine = [];
                if (this.props.completedMorningRoutine.completedDate === today) {
                    completedMorningRoutine = this.props.completedMorningRoutine.routineActivities;
                } else {
                    if (this.props.completedMorningRoutine.routineActivities.length > 0) {
                        this.props.onCompletedMorningRoutine();
                    }
                }
                this.props.removeSafeArea();
                let morningRoutine = this.props.morningRoutine;
                let isLast = (morningRoutine.length === completedMorningRoutine.length + 1);
                let length = this.state.morningRoutine.length;
                if (morningRoutine.length === completedMorningRoutine.length) {
                    let obj = find(this.state.morningRoutine, {pageName: this.state.morningRoutine[0].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    this.props.navigation.navigate(this.state.morningRoutine[0].pageName,
                        {
                            pageName: this.state.morningRoutine[0].pageName,
                            isReplay: this.isReplayActivity(this.state.morningRoutine[0].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            isOptional: false,
                            isLast: isLast,
                            improve: this.state.morningRoutine[0].improve,
                            introTitle: strLocale("ex.Exercise index of length", {index: objIndex, length: length}),
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                    isActivityPushed = true;
                } else {
                    let obj = find(this.state.morningRoutine, {pageName: morningRoutine[completedMorningRoutine.length].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    this.props.navigation.navigate(morningRoutine[completedMorningRoutine.length].pageName,
                        {
                            pageName: morningRoutine[completedMorningRoutine.length].pageName,
                            isReplay: this.isReplayActivity(morningRoutine[completedMorningRoutine.length].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            isLast: isLast,
                            isOptional: false,
                            introTitle: strLocale("ex.Exercise index of length", {index: objIndex, length: length}),
                            improve: morningRoutine[completedMorningRoutine.length].improve,
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                    isActivityPushed = true;
                }
            }
        } catch (err) {
            if (__DEV__) {
                alert(err)
            }
        }
    };

    onBackToTabView = () => {
    }

    //Missed checkup do from why streak reset
    performYesterdayCheckup = () => {
        this.props.navigation.navigate("checkUp", {
            isYesterday: true, isFromToday: false,
            onBackToTabView: this.onBackToTabView,
            scrollToTopToday: this.scrollToTopToday,
            transition: "myCustomSlideUpTransition"
        });
    }

    onPressCheckUp = (type) => {
        // if (type === 2) {
        this.props.navigation.navigate("checkUp", {
            isYesterday: false,
            isFromToday: true,
            scrollToTopToday: this.scrollToTopToday,
            transition: "myCustomSlideUpTransition",
            type: 0,
        });
        // }
    }

    onPressRecheduleTime = () => {
        EventRegister.emit('setSeduleTime', "true");
        this.props.tabChanged("milestone");
        this.props.navigation.navigate('Milestone');
    }

    onRedoCheup = () => {
        this.onCheckupCardClicked(0)
    }

    setDoneMorningRoutine = (pageName) => {
        this.props.setCompletedMorningRoutine(pageName);
    };

    onCompleteExercises = (pageName) => {
        this.props.setCompletedExercises(pageName);
    };

    onReadLetterPress = (page) => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        let title = (this.props.currentGoal.previousAchieved === 1)
            ? strLocale("ex.24 Hour Victory") : (this.props.currentGoal.previousAchieved === 365) ?
                strLocale("ex.1 Year Victory")
                : strLocale("today.goalDays Day Victory", {goalDays: this.props.currentGoal.previousAchieved});
        if (obj !== undefined) {
            if (obj.content !== null) {
                this.props.removeSafeArea();
                this.props.navigation.navigate(page, {
                    letterContent: obj.content,
                    title: title,
                    isFromPopup: false,
                    previousAchieved: this.props.currentGoal.previousAchieved,
                    makeFadeInAnimation: this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    transition: "myCustomSlideUpTransition"
                });
                isActivityPushed = true;
            }
        }
    };

    isReplayActivity = (pageName) => {
        let today = new Date().toDateString();
        let objIndex = this.props.completedExercises.exercises.indexOf(pageName);
        return (objIndex >= 0 && this.props.completedExercises.date === today);
    };

    renderTodayList = () => {
        let appColor = Constant[this.context];

        let isRenderLatter = this.isReadLetter();
        let today = new Date().toDateString();
        // if (!this.state.isAllMorningRoutineDone || isRenderLatter ||
        //     (this.state.isAudioActivity && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName))) {
        return (
            <View style={{width: '90%', left: '5%', marginBottom: -15}}>
                <Text style={[styles.titleStyle, {color: appColor.titleMain}]}>
                    {this.state.todayTitle}
                </Text>
                {/*{*/}
                {/*    this.renderReadLetterCard()*/}
                {/*}*/}
                {
                    // (!this.state.isAllMorningRoutineDone) &&
                    this.renderMorningRoutine()
                }
                {/*{*/}
                {/*    (this.state.isAudioActivity && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) &&*/}
                {/*    <Routine title={allOptionalExercies.audioActivity.title}*/}
                {/*             desc={allOptionalExercies.audioActivity.desc}*/}
                {/*             Icon={allOptionalExercies.audioActivity.Icon}*/}
                {/*             completedExercises={this.props.completedExercises}*/}
                {/*             TodayItemList={null}*/}
                {/*             isIcon={true}*/}
                {/*             onSelectExercises={this.onSelectExercises}*/}
                {/*             pageName={allOptionalExercies.audioActivity.pageName}/>*/}
                {/*    || null*/}
                {/*}*/}
                {/*{this.renderTopLifeTreeCard()}*/}
            </View>)
        // } else {
        //     return (
        //         <View>
        //             {this.renderTopLifeTreeCard(false, false, true)}
        //         </View>
        //     )
        // }
        return null
    };

    renderTodayCheckUp = (checkup = false) => {
        let appColor = Constant[this.context];
        if (this.state.checkUpFlag === 1 && !this.state.checkupTimeMessage.includes("redo")) {
            return (
                <View>
                    {
                        ((checkup === false && !(this.state.checkupTimeMessage.includes("redo"))) ||
                            (checkup === true && (this.state.checkupTimeMessage.includes("redo")))) &&
                        <View>
                            <Text style={[styles.titleStyle, {color: appColor.titleMain, width: '90%', left: '5%'}]}>
                                {checkup === false && strLocale("today.Tonight") || strLocale("today.Redo Your Checkup")}
                            </Text>
                            <CheckupTime message={this.state.checkupTimeMessageDis}
                                         onPress={this.onCheckupCardClicked}
                                         checkUpFlag={this.state.checkUpFlag}
                                         checkupType={checkup}/>
                        </View>
                        || null
                    }
                </View>
            )
        }

        return null;
    }

    renderMorningRoutine = () => {
        return (
            <View>
                <Routine title="Morning Routine"
                         desc={this.state.totalMorningRoutineTimes}
                         Icon={iconImage.morningIcon}
                         TodayItemList={this.state.morningRoutine}
                         pageName="morningRoutine"
                         completedExercises={this.props.completedExercises}
                         onSelectExercises={this.onSelectExercises}/>
            </View>
        );
    };

    scrollToTopToday = () => {
        try {
            if (this.refs.todaysScroll) {
                this.refs.todaysScroll.scrollTo({x: 0, y: 0, animated: false})
            }
        } catch (err) {
            if (__DEV__) {
                alert(err)
            }
        }
    }

    onBackLifeTree = () => {
        this.setState({});
    }

    renderTopLifeTreeCard = (isCompleted = false, isTitle = false, isTopTitle = false, isFromNow = false) => {
        try {
            let appColor = Constant[this.context];
            let isViewCompleted = false;
            let dateToday = new Date().toDateString();
            if (this.props.todayLifeTree.isCompleted && this.props.todayLifeTree.completedDate === dateToday) {
                isViewCompleted = true;
            }
            let todayDate = moment().format("YYYY-MM-DD");
            let todayObj = find(this.props.p_array, {occurred_at: todayDate});
            if (find(this.props.todayScreenExercise, {pageName: "lifeTree", isSelected: true}) !== undefined &&
                this.props.last_checkup_at === todayDate && todayObj != undefined && !todayObj.is_relapse) {
                let title = strLocale("today.Your life tree is growing!");
                if (this.props.current_p_clean_days > 53) {
                    title = strLocale("today.Your life tree is healthy!");
                }
                if (isCompleted) {
                    if (this.props.todayLifeTree.isShow && isViewCompleted) {
                        return (
                            <View>
                                {
                                    (isTitle) &&
                                    this.renderViewBtnCompleted()
                                    || null
                                }
                                {
                                    (this.state.viewCompleted) &&
                                    <LifeTree message={title}
                                              onPress={this.onLifeTreeSelect}/>
                                    || null
                                }
                            </View>
                        )
                    }
                } else {
                    if (this.props.todayLifeTree.isShow && !isViewCompleted) {
                        if (isFromNow) {
                            return (
                                <View>
                                    {(isTopTitle) &&
                                    <Text style={[styles.titleStyle, {color: appColor.todayHeaderTitle}]}>
                                        {strLocale("today.NOW")}
                                    </Text>
                                    || null}
                                    <LifeTree message={title}
                                              onPress={() => this.onLifeTreeSelect()}/>
                                </View>
                            )
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
            return null;
        }
        return null;
    };

    onpressWriteAboutYourDay = () => {
        try {
            this.props.removeSafeArea();
            let list = this.props.journal_date_wise_list;
            let month = moment().format("MMMM");
            let year = moment().format("YYYY");
            let key = month + "-" + year;
            let currentList = list[key];
            let todayDate = moment().format("YYYY-MM-DD");
            let rowData = currentList && currentList[todayDate] || {
                data: "",
                color: "rgb(239,239,244)",
                formatedDate: "Today",
                day: moment(todayDate, 'YYYY-MM-DD').format('DD'),
                key: todayDate,
                id: 0
            };
            if (rowData) {
                isActivityPushed = true;
                this.props.navigation.navigate('journalActivity', {
                    pageName: 'writeAboutYourDay',
                    rowData: rowData,
                    onCompleteExercises: this.onCompleteExercises,
                    isReplay: this.isReplayActivity('writeAboutYourDay'),
                    isOptional: true,
                    makeFadeInAnimation: this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    onBackJournal: this.onBackLifeTree,
                    transition: "myCustomSlideUpTransition"
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    onJournalActivityPress = () => {
        try {
            this.props.removeSafeArea();
            let list = this.props.journal_date_wise_list;
            let month = moment().format("MMMM");
            let year = moment().format("YYYY");
            let key = month + "-" + year;
            let currentList = list[key];
            let todayDate = moment().format("YYYY-MM-DD");
            let rowData = currentList && currentList[todayDate] || {
                data: "",
                color: "rgb(239,239,244)",
                formatedDate: "Today",
                day: moment(todayDate, 'YYYY-MM-DD').format('DD'),
                key: todayDate,
                id: 0
            };
            if (rowData) {
                isActivityPushed = true;
                this.props.navigation.navigate('journalActivity', {
                    pageName: 'journalActivity',
                    rowData: rowData,
                    onCompleteExercises: this.onCompleteExercises,
                    isReplay: this.isReplayActivity('journalActivity'),
                    isOptional: true,
                    makeFadeInAnimation: this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    onBackJournal: this.onBackLifeTree,
                    transition: "myCustomSlideUpTransition"
                });
            }
        } catch (e) {
            console.log(e)
        }
    };

    onViewShowHideclicked = () => {
        this.setState({
            viewCompleted: !this.state.viewCompleted
        });
    };

    onViewShowHideclicked2 = () => {
        this.setState({
            viewHideOption: !this.state.viewHideOption
        });
    };

    renderViewBtnCompleted = () => {
        let appColor = Constant[this.context];
        return (
            <View style={{marginTop: 25, marginBottom: 5}}>
                <TouchableOpacity delayPressIn={15}
                                  onPress={this.onViewShowHideclicked}
                                  style={[styles.btnViewCompleted, {backgroundColor: appColor.viewCompletedBtn}]}>
                    <View>
                        <Text style={[styles.txtViewCompleted, {color: appColor.viewCompletedText}]}>
                            {this.state.viewCompleted && strLocale("today.Hide completed") ||
                            strLocale("today.View completed")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    onViewShowHideclicked3 = () => {
        this.setState({
            viewHideOptionMain: !this.state.viewHideOptionMain
        });
    };

    renderViewBtnOption = () => {
        let today = new Date().getDay();

        let appColor = Constant[this.context];
        return (
            <View style={{flexDirection: 'row', marginBottom: 3, marginHorizontal: 20}}>
                <Text style={[styles.titleStyle, {
                    flex: 1,
                    marginTop: 15,
                    color: appColor.titleMain
                }]}>
                    {strLocale("today.Notification")}</Text>

                <TouchableOpacity delayPressIn={15}
                                  onPress={this.onViewShowHideclicked2}
                                  style={[styles.btnViewCompleted, {
                                      backgroundColor: appColor.newTabSelected,
                                      marginTop: 12,
                                  }]}>
                    <View>
                        <Text style={[styles.txtViewCompleted, {color: 'white'}]}>
                            {this.state.viewHideOption && strLocale("today.Show") ||
                            strLocale("today.Hide")}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    };

    renderViewOptionBtnOption = () => {
        let today = new Date().getDay();

        let appColor = Constant[this.context];
        return (
            <View style={{flexDirection: 'row', marginBottom: 3, marginHorizontal: 20, marginTop: 10}}>
                <Text style={[styles.titleStyle, {
                    flex: 1,
                    marginTop: 15,
                    color: appColor.titleMain
                }]}>
                    {strLocale("today.Optional Activity")}</Text>

                <TouchableOpacity delayPressIn={15}
                                  onPress={this.onViewShowHideclicked3}
                                  style={[styles.btnViewCompleted, {
                                      backgroundColor: appColor.newTabSelected,
                                      marginTop: 12,
                                  }]}>
                    <View>
                        <Text style={[styles.txtViewCompleted, {color: 'white'}]}>
                            {this.state.viewHideOptionMain && strLocale("today.Show") ||
                            strLocale("today.Hide")}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    };

    //Read your letter and write letter
    renderReadLetterCard = (isCompleted = false) => {
        if (this.isLetterDataAvailable()) {
            if (isCompleted && this.isReadLetterCompleted() || this.isReadLetter()) {
                let subTitle = (this.props.currentGoal.previousAchieved === 1)
                    ? strLocale("today.Goal achieved - 24 hour clean") :
                    strLocale("today.Goal achieved - day victory", {day: this.props.currentGoal.previousAchieved});
                return (
                    <Routine title={"Read Your Letter"}
                             desc={subTitle}
                             Icon={iconImage.letterIcon}
                             TodayItemList={null}
                             isIcon={false}
                             improve={[]}
                             completedExercises={this.props.completedExercises}
                             onSelectExercises={this.onReadLetterPress}
                             gradientStart={'#ED8C43'}
                             gradientEnd={'#F3B951'}
                             pageName={"readLetter"}/>
                )
            }
        }
        return null;
    };

    //Read Data available or not
    isLetterDataAvailable = () => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        if (obj !== undefined) {
            if (obj.content) {
                return true;
            }
        }
        return false;
    }

    isReadLetter = () => {
        if (this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()) {
            return !this.isReadLetterCompleted();
        }
        return false;
    }

    isReadLetterCompleted = () => {
        if (this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()) {
            let readDate = this.props.readLatterDate.date;
            if (readDate != "") {
                let today = moment();
                let letterReadDate = moment(readDate);
                let goalDays = this.props.currentGoal.goalDays;
                if (goalDays != 0 && this.props.readLatterDate.previousAchieved === this.props.currentGoal.previousAchieved) {
                    let diff = today.diff(letterReadDate, 'days');
                    switch (goalDays) {
                        case 1:
                            if (diff == 0)
                                return true;
                            break
                        case 3:
                            if (diff <= 2)
                                return true;
                            break;
                        case 7:
                            if (diff <= 4)
                                return true;
                            break;
                        case 14:
                            if (diff <= 7)
                                return true;
                            break;
                        case 30:
                            if (diff <= 16)
                                return true;
                            break;
                        case 90:
                            if (diff <= 60)
                                return true;
                            break;
                        case 180:
                            if (diff <= 90)
                                return true;
                            break;
                        case 365:
                            if (diff <= 185)
                                return true;
                            break;
                        case 400:
                            if (diff <= 35)
                                return true;
                            break;
                        case 500:
                            if (diff <= 100)
                                return true;
                            break;
                        case 600:
                            if (diff <= 100)
                                return true;
                            break;
                        case 700:
                            if (diff <= 100)
                                return true;
                            break;
                        case 730:
                            if (diff <= 30)
                                return true;
                            break;
                        case 800:
                            if (diff <= 70)
                                return true;
                            break;
                        case 900:
                            if (diff <= 100)
                                return true;
                            break;
                        case 1000:
                            if (diff <= 100)
                                return true;
                            break;
                    }
                    return false;
                }
            }
        }
    }

    //Is Write letter for previous streak
    isWriteLetterForPreviosGoal = () => {
        //Today and for current goal
        if (this.props.currentGoal.previousAchieved != 0) {
            let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
            if (obj && obj.updateDate) {
                let updatedDate = obj.updateDate || null;
                let today = moment();
                let letterInsertedDate = moment(updatedDate);
                let goalDays = this.props.currentGoal.goalDays;
                if (goalDays != 0) {
                    let diff = today.diff(letterInsertedDate, 'days');
                    switch (this.props.currentGoal.goalDays) {
                        case 1:
                            if (diff <= 1)
                                return true;
                            break
                        case 3:
                            if (diff <= 2)
                                return true;
                            break;
                        case 7:
                            if (diff <= 4)
                                return true;
                            break;
                        case 14:
                            if (diff <= 7)
                                return true;
                            break;
                        case 30:
                            if (diff <= 16)
                                return true;
                            break;
                        case 90:
                            if (diff <= 60)
                                return true;
                            break;
                        case 180:
                            if (diff <= 90)
                                return true;
                            break;
                        case 365:
                            if (diff <= 185)
                                return true;
                            break;
                        case 400:
                            if (diff <= 35)
                                return true;
                            break;
                        case 500:
                            if (diff <= 100)
                                return true;
                            break;
                        case 600:
                            if (diff <= 100)
                                return true;
                            break;
                        case 700:
                            if (diff <= 100)
                                return true;
                            break;
                        case 730:
                            if (diff <= 30)
                                return true;
                            break;
                        case 800:
                            if (diff <= 70)
                                return true;
                            break;
                        case 900:
                            if (diff <= 100)
                                return true;
                            break;
                        case 1000:
                            if (diff <= 100)
                                return true;
                            break;
                    }
                    return false;
                    // }
                }
            }
        }
        return false;
    }

    //For Write letter
    isWriteLetterCard = () => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.goalDays});
        if (obj && obj.updateDate) {
            let insertedDate = obj.updateDate;
            let today = moment();
            let letterInsertedDate = moment(insertedDate);
            let diff = today.diff(letterInsertedDate, 'days');
            switch (this.props.currentGoal.goalDays) {
                case 1:
                    if (diff !== 0)
                        return true;
                    break;
                case 3:
                    if (diff > 2)
                        return true;
                    break;
                case 7:
                    if (diff > 4)
                        return true;
                    break;
                case 14:
                    if (diff > 7)
                        return true;
                    break;
                case 30:
                    if (diff > 16)
                        return true;
                    break;
                case 90:
                    if (diff > 60)
                        return true;
                    break;
                case 180:
                    if (diff > 90)
                        return true;
                    break;
                case 365:
                    if (diff > 185)
                        return true;
                    break;
                case 400:
                    if (diff > 35)
                        return true;
                    break;
                case 500:
                    if (diff > 100)
                        return true;
                    break;
                case 600:
                    if (diff > 100)
                        return true;
                    break;
                case 700:
                    if (diff > 100)
                        return true;
                    break;
                case 730:
                    if (diff > 30)
                        return true;
                    break;
                case 800:
                    if (diff > 70)
                        return true;
                    break;
                case 900:
                    if (diff > 100)
                        return true;
                    break;
                case 1000:
                    if (diff > 100)
                        return true;
                    break;
            }
            return false;
        }
        return true;
    }

    isDisplayWriteLetter = () => {
        if (this.isReadLetter()) {
            if (this.isReadLetterCompleted()) {
                return this.isWriteLetterCard();
            } else {
                return false;
            }
        }
        return this.isWriteLetterCard();
    }

    onMore = (index) => {
        switch (index) {
            case 0:
                this.props.navigation.navigate("analysis", {
                    initPage: 3
                });
                break
            case 1:
                this.props.navigation.navigate("analysis", {
                    initPage: 1
                });
                break
            case 2:
                this.props.navigation.navigate("analysis");
                break
            case 3:
                this.props.navigation.navigate("analysis");
                break
        }
    }

    renderSOS = () => {

        return (
            <RoutineSOSComponent title={'Feeling triggered?'}
                                 desc={'SOS'}
                                 Icon={''}
                                 completedExercises={this.props.completedExercises}
                                 TodayItemList={null}
                                 isIcon={true}
                                 onSelectExercises={this.onSOSPress}
                                 pageName={"SOS"}
                                 gradientStart={'#EB6B9D'}
                                 gradientEnd={'#EE8C68'}
                                 key={0}
            />
        )
    }

    render() {
        let renderCompletedActivity = [];
        let renderOptionalActivity = [];
        let isReadCard = this.isReadLetterCompleted();
        let isWriteAboutYourDay = false;
        if (this.isReplayActivity('writeAboutYourDay')) {
            isWriteAboutYourDay = true;
        }
        this.state.optionalExercies.forEach(obj => {
            if (obj.pageName === "lettersToYourSelf") {
                if (this.isDisplayWriteLetter()) {
                    renderOptionalActivity.push(obj);
                }
            } else if (obj.pageName === "kegalsActivity" &&
                (this.state.gender === 'female' || this.state.gender === 'transgender_female')) {
            } else {
                if (this.isReplayActivity(obj.pageName)) {
                    renderCompletedActivity.push(obj);
                } else {
                    renderOptionalActivity.push(obj);
                }
            }
        });
        if (this.state.isAudioActivity && this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) {
            renderCompletedActivity.push(allOptionalExercies.audioActivity)
        }

        if (renderCompletedActivity.length !== 0) {
            if (find(renderCompletedActivity, {pageName: "healthyActivity2"}) !== undefined) {

            }
        }

        let arrNotification = [];
        let checkUpType = 0;
        if (this.state.checkUpFlag === 2 && !this.state.checkupTimeMessage.includes("redo")) {
            checkUpType = 1;
            try {
                // let settingNotifications = this.props.settingNotifications;
                //
                // let dict = notificationList.checkInTime;
                // dict.desc = `Current scheduled time for checkup is ${settingNotifications[0].hours}:${settingNotifications[0].minute}hr`
                // arrNotification.push(notificationList.checkInTime);
            } catch (e) {
            }
        } else if (this.state.relapseCheckup === true) {
            checkUpType = 2;
        } else if (this.state.checkupTimeMessage.includes("redo")) {
            checkUpType = 3;
        }
        this.state.notificationArray.forEach(obj => {
            arrNotification.push(obj);
        });

        let appColor = Constant[this.context];
        return (
            <View style={[styles.container, {flex: 1, backgroundColor: appColor.appBackground, overflow: 'hidden'}]}>
                <Animatable.View style={{flex: 1}} ref="mainView">
                    <LinearGradient colors={['white', 'white']}
                                    locations={[0.5, 0.5]}
                                    style={styles.linearGradient}>
                        <ScrollView automaticallyAdjustContentInsets={false}
                                    contentContainerStyle={{backgroundColor: appColor.appBackground}}
                                    bounces={false}
                                    alwaysBounceVertical={false}
                                    ref="todaysScroll">

                            <TotalProgress propsNew={this.props}
                                           performYesterdayCheckup={this.performYesterdayCheckup}
                                           onMore={this.onMore}
                                           currentStreak={this.props.current_p_clean_days && this.props.current_p_clean_days || 0}
                                           levelCurrent={this.props.levelNumber && this.props.levelNumber.level || 1}
                                           positive={this.state.positive}
                                           nagative={this.state.nagative}
                                           celebration={this.state.celebration}
                                           checkUpType={checkUpType}
                                           checkUpFlag={this.state.checkUpFlag}
                                           message={this.state.checkupTimeMessage}
                                           onPressCheckUp={this.onPressCheckUp}
                                           onPressRecheduleTime={this.onPressRecheduleTime}
                                           onRedoCheup={this.onRedoCheup}/>

                            {
                                !!(checkUpType === 1 || checkUpType === 2 || checkUpType === 3) &&
                                <TotalProgress2 propsNew={this.props}
                                                performYesterdayCheckup={this.performYesterdayCheckup}
                                                onMore={this.onMore}
                                                currentStreak={this.props.current_p_clean_days && this.props.current_p_clean_days || 0}
                                                levelCurrent={this.props.levelNumber && this.props.levelNumber.level || 1}
                                                positive={this.state.positive}
                                                nagative={this.state.nagative}
                                                celebration={this.state.celebration}
                                                checkUpType={checkUpType}
                                                checkUpFlag={this.state.checkUpFlag}
                                                message={this.state.checkupTimeMessage}/>
                            }

                            <View style={{
                                top: -Constant.screenWidth * 0.13, right: 0,
                                position: 'absolute', alignItems: 'center'
                            }}>
                                <Image source={{uri: 'new_icon_home_topright'}}
                                       resizeMode="contain"
                                       style={{
                                           height: Constant.screenWidth * 0.42,
                                           width: (Constant.screenWidth * 0.42) * 0.731
                                       }}/>

                                <View style={{
                                    top: 70 + this.props.safeAreaInsetsData.top, right: 15,
                                    position: 'absolute', alignItems: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("moreSettings")}
                                                      style={{
                                                          borderRadius: 25,
                                                          height: 50, width: 50,
                                                          alignItems: 'flex-end',
                                                          justifyContent: 'center',
                                                      }}>
                                        <Image source={{uri: 'icon_setting_home'}}
                                               style={{left: 10, height: 70, width: 70}}/>

                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{paddingBottom: 40}}>

                                {
                                    (arrNotification.length > 0) &&
                                    <View>
                                        <View>
                                            {
                                                this.renderViewBtnOption()
                                            }
                                        </View>
                                        {
                                            !!(this.state.viewHideOption === false) &&
                                            arrNotification.map((obj, index) => {
                                                return (
                                                    <RoutineSingleLine title={obj.title}
                                                                       desc={(obj.pageName === "lettersToYourSelf") ?
                                                                           (this.props.currentGoal.goalDays === 1) ? strLocale("today.24 hour clean")
                                                                               : strLocale("today.goalDays day victory", {goalDays: this.props.currentGoal.goalDays}) : obj.desc}
                                                                       Icon={obj.Icon}
                                                                       completedExercises={this.props.completedExercises}
                                                                       TodayItemList={null}
                                                                       isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                                       onSelectExercises={this.onSelectNotificatication}
                                                                       pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                                       gradientStart={obj.gradientStart}
                                                                       gradientEnd={obj.gradientEnd}
                                                                       type={obj.type}
                                                                       key={index}/>
                                                )
                                            })
                                        }
                                    </View>
                                    || null
                                }

                                {this.renderTodayList()}

                                {
                                    (this.state.todoActivityArray.length > 0) &&
                                    <View>
                                        <View>
                                            {
                                                this.renderViewOptionBtnOption()
                                            }
                                        </View>
                                        {
                                            !!(this.state.viewHideOptionMain === false) &&
                                            this.state.todoActivityArray.map((obj, index) => {
                                                return (
                                                    <Routine title={obj.title}
                                                             desc={(obj.pageName === "lettersToYourSelf") ?
                                                                 (this.props.currentGoal.goalDays === 1) ? strLocale("today.24 hour clean")
                                                                     : strLocale("today.goalDays day victory", {goalDays: this.props.currentGoal.goalDays}) : obj.desc}
                                                             Icon={obj.Icon}
                                                             completedExercises={this.props.completedExercises}
                                                             TodayItemList={null}
                                                             isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                             onSelectExercises={this.onSelectExercises}
                                                             pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                             gradientStart={obj.gradientStart}
                                                             gradientEnd={obj.gradientEnd}
                                                             key={index}
                                                             isNew={obj.isNew && 1 || 0}
                                                    />
                                                )
                                            })
                                        }
                                        {
                                            !!(this.state.checkUpFlag === 2 && this.state.viewHideOptionMain === false) &&
                                            <View>
                                                <Routine title={allOptionalExercies.slipeMeditation.title}
                                                         desc={allOptionalExercies.slipeMeditation.desc}
                                                         Icon={allOptionalExercies.slipeMeditation.Icon}
                                                         completedExercises={this.props.completedExercises}
                                                         TodayItemList={null}
                                                         isIcon={(allOptionalExercies.slipeMeditation.isIcon !== undefined) ? allOptionalExercies.slipeMeditation.isIcon : true}
                                                         onSelectExercises={this.onSelectExercises}
                                                         pageName={(allOptionalExercies.slipeMeditation.pageName !== undefined) ? allOptionalExercies.slipeMeditation.pageName : "healthyActivity"}
                                                         gradientStart={allOptionalExercies.slipeMeditation.gradientStart}
                                                         gradientEnd={allOptionalExercies.slipeMeditation.gradientEnd}
                                                         key={0}
                                                         isNew={allOptionalExercies.slipeMeditation.isNew && allOptionalExercies.slipeMeditation.isNew || false}
                                                />
                                            </View>
                                        }
                                    </View>
                                    || null
                                }

                                {
                                    !!(this.props.dailyDiscussion.length !== 0) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {
                                            color: appColor.titleMain,
                                            width: '90%',
                                            left: '5%'
                                        }]}>
                                            {strLocale("topbar.Discussion")}
                                        </Text>

                                        <Routine title={this.state.dailyDiscussionObject.title}
                                                 desc={this.props.dailyDiscussion[0].text || 'Discussion today point'}
                                                 isNoApplyLoc={true}
                                                 Icon={this.state.dailyDiscussionObject.Icon}
                                                 completedExercises={this.props.completedExercises}
                                                 TodayItemList={null}
                                                 isIcon={(this.state.dailyDiscussionObject.isIcon !== undefined) ? this.state.dailyDiscussionObject.isIcon : true}
                                                 onSelectExercises={this.onSelectDailyDiscussion}
                                                 pageName={(this.state.dailyDiscussionObject.pageName !== undefined) ? this.state.dailyDiscussionObject.pageName : "healthyActivity"}
                                                 gradientStart={this.state.dailyDiscussionObject.gradientStart}
                                                 gradientEnd={this.state.dailyDiscussionObject.gradientEnd}
                                                 isNew={0}
                                                 key={0}/>
                                    </View>
                                }

                                {this.renderTodayCheckUp(false)}

                                {
                                    this.renderSOS()
                                }
                            </View>

                        </ScrollView>
                    </LinearGradient>
                </Animatable.View>
            </View>
        );
    }

    //Manage subscription
    checkForSubscription = () => {

        console.log('Subscription ' + this.props.subscriptionInProcess)
        if (this.props.isConnected) {
            if (!this.props.subscriptionInProcess) {
                let text = "";
                InAppBilling.close().then(() => {
                    // alert('ddd')
                    // text = text + "-- " + "then close() "
                    // this.setState({
                    //     tmp: text
                    // })
                    InAppBilling.open().then(() => {
                        // text = text + "-- " + "then open() "
                        // this.setState({
                        //     tmp: text
                        // })
                        InAppBilling.loadOwnedPurchasesFromGoogle().then(() => {
                            // text = text + "-- " + "then loadOwnedPurchasesFromGoogle() "
                            // this.setState({
                            //     tmp: text
                            // });
                            InAppBilling.listOwnedSubscriptions().then((subDetail) => {
                                // text = text + "-- " + "then listOwnedSubscriptions() => " + JSON.stringify(subDetail)
                                // this.setState({
                                //     tmp: text
                                // });
                                InAppBilling.isSubscribed('beefup_subscribe_monthly2').then((isSubscribed) => {
                                    // text = text + "-- " + "then---isSubscribed" + isSubscribed + "";
                                    // this.setState({
                                    //     tmp: text
                                    // });
                                    AsyncStorage.setItem('isNewOpen', "false");
                                    if (isSubscribed) {
                                        //  alert("Already subscribed")
                                        InAppBilling.getSubscriptionTransactionDetails('beefup_subscribe_monthly2')
                                            .then((details) => {
                                                // text = text + "\n\n-- " + "then---getSubscriptionTransactionDetails"
                                                // + JSON.stringify(details) + "---end====\n" +
                                                //     details.purchaseState;
                                                // this.setState({
                                                //     tmp: text
                                                // })
                                                this.props.setSubscriptionInProcess(false);

                                                if (details.purchaseState !== undefined && details.purchaseState == "PurchasedSuccessfully") {
                                                    AsyncStorage.setItem('isSubscribe', "true");
                                                } else {
                                                    this.hideAlltodaysPopup();
                                                    this.props.navigation.navigate("getStarted", {
                                                        nextPage: "rootTabNavigation",
                                                        isRestore: true
                                                    });

                                                    //Get started
                                                    showThemeAlert({
                                                        title: "BeefUp",
                                                        message: "Your subscription is expired now. Please purchase subscription for continue using BeefUp",
                                                        leftBtn: strLocale("OK"),
                                                        leftPress: (i) => {
                                                            // this.hideAlltodaysPopup();
                                                            // this.props.navigation.navigate("getStarted", {
                                                            //     nextPage: "rootTabNavigation",
                                                            //     isRestore: true
                                                            // });
                                                        }
                                                    });
                                                }
                                            }).catch((e) => {
                                            this.props.setSubscriptionInProcess(false);
                                            this.checkForSubscription();
                                            console.log("fail InAppBilling")
                                            // alert("----Catch getSubscriptionTransactionDetails");
                                        });
                                    } else {
                                        this.props.setSubscriptionInProcess(false);

                                        // Get Started
                                        this.hideAlltodaysPopup();
                                        this.props.navigation.navigate("getStarted", {nextPage: "rootTabNavigation"});

                                        showThemeAlert({
                                            title: "BeefUp",
                                            message: "Your subscription is expired now. Please purchase subscription for continue using BeefUp",
                                            leftBtn: strLocale("OK"),
                                            leftPress: (i) => {
                                                // this.hideAlltodaysPopup();
                                                // this.props.navigation.navigate("getStarted", {nextPage: "rootTabNavigation"});
                                            }
                                        });
                                    }
                                }).catch((e) => {
                                    this.props.setSubscriptionInProcess(false);
                                    // alert("--Catch --isSubscribed " + e)
                                })
                            }).catch((e) => {
                                this.props.setSubscriptionInProcess(false);
                                // alert("--Catch --listOwnedSubscriptions " + e)
                            })
                        }).catch((e) => {
                            this.props.setSubscriptionInProcess(false);
                            // alert("--Catch --loadOwnedPurchasesFromGoogle " + e)
                        })
                    }).catch((e) => {
                        this.props.setSubscriptionInProcess(false);
                        // alert("--Catch --open " + e)
                    });
                }).catch((e) => {
                    this.props.setSubscriptionInProcess(false);
                    // alert("--Catch --close " + e)
                });
            }
        }
    };

    async checkForSubscriptionNew() {
        //Set if in revenecat
        // alert(`${this.props.userId}_${generateRandomNumber(this.props.userId)}`)
        Purchases.setup("PHKkRkzRAvkTQQXEBksoRRspHagnuMBk", `${this.props.userId}_${generateRandomNumber(this.props.userId)}`);

        setTimeout(() => {

            if (this.props.revenuecatID === '') {
                this.syncSubscriptionNew();
                this.props.updaterevenuecatID("synced")
            } else {
                this.checkForSubscriptionNew2();
            }
        }, 800)
    }

    async extraMethod() {
        try {
            alert(`${this.props.userId}_${generateRandomNumber(this.props.userId)}`)
            console.log('--------------Purchase -- Start Exra method---------');
            Purchases.identify(`${this.props.userId}_${generateRandomNumber(this.props.userId)}`);
            console.log('--------------Purchase -- End Exra method---------');
        } catch (e) {

        }
    }

    async checkForSubscriptionNew2() {
        try {
            if (this.props.isConnected) {
                if (!this.props.subscriptionInProcess) {
                    // this.extraMethod();
                    this.props.setSubscriptionInProcess(true);
                    console.log('--------------Purchase -- Checking - Get purchase info---------');
                    const purchaserInfo = await Purchases.getPurchaserInfo();
                    console.log("Result - Purchase info: " + JSON.stringify(purchaserInfo))

                    if (typeof purchaserInfo.entitlements.active["Full Acess"] !== "undefined") {
                        // Grant user "pro" access
                        this.props.setSubscriptionInProcess(false);
                        const purchaserInfo = await Purchases.restoreTransactions();
                        console.log('--------------Purchase -- Success - Active purchase---------');
                    } else {
                        console.log('--------------Purchase -- Checking - Restore purchase---------');
                        setTimeout(() => {
                            this.restoringProgram();
                        }, 1000)
                    }
                }
            }
        } catch (e) {
            console.log(`--------------Purchase -- Fail - To checking subscription process---------\n${e}`);
            this.props.setSubscriptionInProcess(false);
            // Error fetching purchaser info
        }
    }

    async restoringProgram() {
        const purchaserInfo = await Purchases.restoreTransactions();

        if (typeof purchaserInfo.entitlements.active["Full Acess"] !== "undefined") {
            this.props.setSubscriptionInProcess(false);
            console.log('--------------Purchase -- Success - Active restore purchase---------');
        } else {
            console.log('--------------Purchase -- Fail - Restore not availble---------');
            if (!global.isExpired) {
                global.isExpired = true;
                // this.props.setSubscriptionInProcess(false);
                this.hideAlltodaysPopup();
                this.props.navigation.navigate("getStarted", {
                    nextPage: "rootTabNavigation",
                    isRestore: true,
                    isFromToday: true,
                });

                //Get started
                showThemeAlert({
                    title: "BeefUp",
                    message: "Your subscription is expired now. Please purchase subscription for continue using BeefUp",
                    leftBtn: strLocale("OK"),
                    leftPress: (i) => {
                        // this.hideAlltodaysPopup();
                        // this.props.navigation.navigate("getStarted", {
                        //     nextPage: "rootTabNavigation",
                        //     isRestore: true
                        // });
                    }
                });
            }
        }
    }

    async syncSubscriptionNew() {
        try {
            if (this.props.isConnected) {
                if (!this.props.subscriptionInProcess) {
                    console.log('--------------Purchase -- Checking with old subscription---------');
                    const purchaserInfo = await Purchases.syncPurchases();

                    Purchases.setup("PHKkRkzRAvkTQQXEBksoRRspHagnuMBk", `${this.props.userId}_${generateRandomNumber(this.props.userId)}`);

                    setTimeout(() => {
                        this.checkForSubscriptionNew2();
                    }, 1000)
                }
            }
        } catch (e) {
            this.checkForSubscriptionNew2();
            console.log('--------------Purchase -- Fail - Synced---------');
            // Error fetching purchaser info
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 0
    },
    titleStyle: {
        marginTop: 25,
        marginBottom: 3,
        color: 'black',
        fontSize: 18,
        alignSelf: 'flex-start',
        fontFamily: Constant.font700,
    },
    linearGradient: {
        flex: 1,
    },
    btnViewCompleted: {
        alignSelf: 'center',
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingRight: 5,
        paddingLeft: 5,
        minWidth: 50
    },
    txtViewCompleted: {
        fontSize: 12,
        fontFamily: Constant.font500,
        color: '#dee1e3'
    }
});

const mapStateToProps = state => {
    return {
        p_array: state.statistic.pornDetail.p_array,
        current_p_clean_days: state.statistic.pornDetail.current_p_clean_days,
        totalRewiringPercentage: state.statistic.totalRewiringPercentage,
        userName: state.user.userDetails.name,
        userEmail: state.user.userDetails.email,
        gender: state.user.userDetails.gender,
        register_date: state.user.userDetails.register_date || '',
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        userDetails: state.user.userDetails || {},
        dateForAPICall: state.user.dateForAPICall,
        completedExercises: state.user.completedExercises,
        checkupTime: state.metaData.metaData.checkup_time || 18,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        registered_at: state.metaData.metaData && state.metaData.metaData.registered_at || "",
        morningRoutine: state.metaData.morningRoutine,
        completedMorningRoutine: state.metaData.completedMorningRoutine,
        currentGoal: state.statistic.currentGoal,
        letterInsertedDate: state.letters.letterInsertedDate,
        letters: state.letters.letters,
        visibleTab: state.user.visibleTab,
        readLatterDate: state.user.readLatterDate,
        todayViewInstance: state.user.todayViewInstance,
        isOpenFirstTime: state.user.isOpenFirstTime,
        isAskForCheckup: state.user.isAskForCheckup,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        subscriptionInProcess: state.user.subscriptionInProcess,
        isConnected: state.user.isConnected,
        meditationTime: state.metaData.meditationTime || 10,
        popupQueue: state.user.popupQueue,
        showRewindProgressPopUp: state.user.showRewindProgressPopUp,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        todayScreenExercise: state.metaData.todayScreenExercise || [],
        todayLifeTree: state.user.todayLifeTree || [],
        journal_date_wise_list: state.statistic.journal_date_wise_list,
        exercise_number_learn: state.metaData.metaData.exercise_number_learn || 1,
        exercise_number_profile: state.metaData.metaData.exercise_number_profile || 1,
        appBadgeCount: state.user.appBadgeCount,
        eventBadgeCount: state.team.eventBadgeCount || 0,
        clean_p_days_per_month: state.statistic.pornDetail.clean_p_days_per_month,
        monthlyChallengeAchived: state.user.monthlyChallengeAchived,
        userCommunity: state.user.userCommunity || null,
        levelNumber: state.metaData.levelNumber,
        awardToday: state.metaData.awardToday,
        notificationPreset: state.user.notificationPreset || {},
        rewiredProgress: state.user.rewiredProgress || '',
        streckProgress: state.user.streckProgress || '',
        levelProgress: state.user.levelProgress || '',
        awardProgress: state.user.awardProgress || '',
        settingNotifications: state.user.settingNotifications,
        tutorialTab1: state.user.tutorialTab1,
        appTheme: state.user.appTheme,
        teamID: state.user.userDetails && state.user.userDetails.teamID || '',
        selectSingleTime: state.user.selectSingleTime || false,
        dailyDiscussion: state.user && state.user.dailyDiscussion || [],
        revenuecatID: state.user.revenuecatID || ''
    };
};

export default connect(mapStateToProps, {
    loadDataOnAppOpen,
    setMorningRoutine,
    setCompletedMorningRoutine,
    setCompletedExercises,
    manageCheckupPopup,
    onCompletedMorningRoutine,
    setDoneAPICallForToday,
    setUpLocalNotificationAlerts,
    manageTodayInstances,
    goalCalculation,
    setDateforTodayOpen,
    setAskedForCheckupPopup,
    removeSafeArea,
    setSubscriptionInProcess,
    manageRewiringPopup,
    manageRewiredProgressPopup,
    manageAchievedPopup,
    activeAppManagedTab,
    managedLetterAPI,
    manageStreakAchievedPopup,
    managePopupQueue,
    setIsNetworkAvailable,
    resetStoreData,
    tabChanged,
    getCurrentClean,
    sendTagOneSignal,
    manageMonthlyChallengePopup,
    manageMonthlyChallengeAchieved,
    sendNotification,
    manageTutorialPopUp,
    manageNotificationToday,
    manageNotificationRewring,
    manageNotificationStrek,
    manageNotificationLevel,
    manageNotificationAward,
    addMessageTeamChat,
    sendNotificationRemote,
    themeUpdate,
    updaterevenuecatID
})(TodayPage);
