import {
    APP_SET_USER_DATA,
    USER_EMAIL_CHANGED, USER_PASS_CHANGED, START_LOADING,
    USER_USERNAME_EDIT,
    VISIBLE_TAB, REWIRING_PLAY, SET_USER_DETAIL,
    SET_COMPLETED_EXERCISES,
    SETTING_NOTIFICATIONS, SHOW_CHECKUP_POPUP,
    SHOW_REWIRING_POPUP,
    SET_READ_TODAY_LATTER, SET_API_CALL_DATE,
    FIRST_TIME_APP_OPEN_IN_DAY,
    IS_ASK_FOR_CHECKUP,
    IS_NETWORK_AVAILABLE,
    SET_SAFE_AREA_INTENT,
    SET_SAFE_AREA_INTENT_X,
    SET_SAFE_AREA_INTENT_CHAT,
    SUBSCRIPTION_CHECK_DATE,
    SHOW_REWIRING_PROGRESS_POPUP,
    SHOW_STREAK_POPUP,
    STREAK_GOAL_ACHIEVED_POPUP,
    MANAGED_SHOW_STREAK_POPUP,
    POPUP_QUEUE,
    TODAY_LIFE_TREEE,
    APP_BADGE_COUNT,
    SETTING_TEAMCHAT_NOTIFICATIONS,
    TODAY_INSTANCES,
    INTERNET_FILTER,
    APPTHEME_TYPE,
    SHOW_MONTHLY_POPUP,
    SHOW_MONTHLY_CHALLENGE_POPUP,
    MONTHLY_CHALLENGE_ACHIEVED,
    ENCOURAGE_POPUP,
    CONGRATULATE_POPUP,
    SET_DO_NOT_DISTURB,
    SHOW_TEAM_ACHIEVEMENT_POPUP,
    SET_CURRENT_USER_DATA, SET_USER_TOKEN,
    CUSTOM_POPUP, SET_LOCATION_INFO,
    USER_LEADERBOARD,
    SHOW_TUTORIAL_POPUP,
    MANAGE_NOTIFICATION,
    MANAGE_REWIRINGPROGRESS,
    MANAGE_STREKPROGRESS,
    MANAGE_LEVELPROGRESS,
    MANAGE_AWARDPROGRESS,
    SET_RANDOMVARIBLE,
    RATE_YOURDAY_3,
    RATE_YOURDAY_7,
    SERVER_DATE,
    TUTORIAL_TAB1, TUTORIAL_TAB2, TUTORIAL_TAB3, TUTORIAL_TAB4,
    LAST_TEAM_MESSAGE,
    NOTIFICATION_LIST,
    NOTIFICATION_PROFILE,
    NOTIFICATION_BADGE_COUNT,
    SELECT_THEME, SELECT_THEME2,
    DAILY_DISCUSSION,
    INTERNET_FILTERSTATE,
    REVENUECAYID, REMEMBERPASSWORD, SHOW_UPDATE_CALENDAR_POPUP, SHOW_MISSED_CHECKUP_POPUP,
    PURCHASE_REGISTATION_DATA
} from '../actions/types';
import _ from 'lodash';
import {appDefaultReducer} from './defaultReducer';
// import {app} from "../helper/firebaseConfig";
const INITIAL_STATE = appDefaultReducer.user;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case START_LOADING: {
            return {
                ...state,
                isLoading: action.payload,
            };
        }
        case SET_USER_DETAIL: {
            return {
                ...state,
                userDetails: action.payload,
            };
        }
        case APP_SET_USER_DATA: {
            return {
                ...state,
                email: state.email,
                password: state.password,
                token: action.payload.token
            };
        }
        case SET_USER_TOKEN: {
            return {
                ...state,
                email: action.payload.email,
                password: action.payload.password,
                token: action.payload.token
            };
        }
        case USER_EMAIL_CHANGED: {
            return {
                ...state,
                email: action.payload,
            };
        }
        case USER_PASS_CHANGED: {
            return {
                ...state,
                password: action.payload,
            };
        }
        case USER_USERNAME_EDIT: {
            return {
                ...state,
                userName: action.payload,
            };
        }
        case VISIBLE_TAB: {
            return {
                ...state,
                visibleTab: action.payload,
            };
        }
        case REWIRING_PLAY: {
            return {
                ...state,
                rewiringPlay: action.payload,
            };
        }
        case SET_COMPLETED_EXERCISES: {
            return {
                ...state,
                completedExercises: action.payload,
            };
        }
        case SETTING_NOTIFICATIONS: {
            return {
                ...state,
                settingNotifications: action.payload,
            };
        }
        case SETTING_TEAMCHAT_NOTIFICATIONS: {
            return {
                ...state,
                settingTeamChatNotifications: action.payload,
            };
        }
        case SHOW_CHECKUP_POPUP: {
            return {
                ...state,
                showCheckupPopUp: action.payload,
            };
        }
        case SHOW_UPDATE_CALENDAR_POPUP: {
            return {
                ...state,
                showUpdateCalendarPopUp: action.payload,
            };
        }
        case SHOW_MISSED_CHECKUP_POPUP: {
            return {
                ...state,
                showMissedYesterdayCheckup: action.payload,
            };
        }
        case SHOW_REWIRING_POPUP: {
            return {
                ...state,
                showRewiringPopUp: action.payload,
            };
        }
        case SET_READ_TODAY_LATTER: {
            return {
                ...state,
                readLatterDate: action.payload,
            };
        }
        case SET_API_CALL_DATE: {
            return {
                ...state,
                dateForAPICall: action.payload,
            };
        }
        case TODAY_INSTANCES: {
            return {
                ...state,
                todayViewInstance: action.payload,
            };
        }
        case FIRST_TIME_APP_OPEN_IN_DAY: {
            return {
                ...state,
                isOpenFirstTime: action.payload,
            };
        }
        case IS_ASK_FOR_CHECKUP: {
            return {
                ...state,
                isAskForCheckup: action.payload,
            };
        }
        case IS_NETWORK_AVAILABLE: {
            return {
                ...state,
                isConnected: action.payload,
            };
        }
        case SET_SAFE_AREA_INTENT: {

            return {
                ...state,
                safeAreaInsetsDefault:action.payload,
                safeAreaInsetsData: action.payload
            }
        }
        case SET_SAFE_AREA_INTENT_X : {
            return {
                ...state,
                safeAreaInsetsData: action.payload,
            }
        }
        case SET_SAFE_AREA_INTENT_CHAT : {
            return {
                ...state,
                safeAreaInsetsDataChat: action.payload,
            }
        }
        case SUBSCRIPTION_CHECK_DATE : {
            return {
                ...state,
                subscriptionInProcess: action.payload,
            }
        }
        case SHOW_REWIRING_PROGRESS_POPUP : {
            return {
                ...state,
                showRewindProgressPopUp: action.payload,
            }
        }
        case STREAK_GOAL_ACHIEVED_POPUP : {
            return {
                ...state,
                streakGoalAchievedPopUp: action.payload,
            }
        }
        case MANAGED_SHOW_STREAK_POPUP : {
            return {
                ...state,
                showGoalAchieved: action.payload,
            }
        }
        case POPUP_QUEUE : {
            return {
                ...state,
                popupQueue: _.cloneDeep(action.payload),
            }
        }
        case TODAY_LIFE_TREEE : {
            return {
                ...state,
                todayLifeTree: action.payload,
            }
        }
        case SHOW_STREAK_POPUP : {
            return {
                ...state,
                showStreakGoalPopUp: action.payload,
            }
        }
        case APP_BADGE_COUNT : {
            return {
                ...state,
                appBadgeCount: action.payload,
            }
        }
        case INTERNET_FILTER : {
            return {
                ...state,
                internetFilterList: action.payload,
            }
        }
        case APPTHEME_TYPE : {
            return {
                ...state,
                appTheme: action.payload,
            }
        }
        case SHOW_MONTHLY_POPUP : {
            return {
                ...state,
                monthlyPopup: action.payload,
            }
        }
        case SHOW_MONTHLY_CHALLENGE_POPUP : {
            return {
                ...state,
                monthlyChallengePopup: action.payload,
            }
        }
        case MONTHLY_CHALLENGE_ACHIEVED : {
            return {
                ...state,
                monthlyChallengeAchived: action.payload,
            }
        }
        case ENCOURAGE_POPUP : {
            return {
                ...state,
                encouragePopup: action.payload,
            }
        }
        case CONGRATULATE_POPUP : {
            return {
                ...state,
                congratulatePopup: action.payload,
            }
        }
        case SET_DO_NOT_DISTURB : {
            return {
                ...state,
                doNotDisturb: action.payload,
            }
        }
        case SHOW_TEAM_ACHIEVEMENT_POPUP : {
            return {
                ...state,
                teamAchievementPopUp: action.payload,
            }
        }
        case CUSTOM_POPUP : {
            return {
                ...state,
                customPopup: action.payload,
            }
        }
        case SET_CURRENT_USER_DATA : {
            return {
                ...state,
                userCommunity: action.payload,
            }
        }
        case SET_LOCATION_INFO : {
            return {
                ...state,
                locationInfo: action.payload,
            }
        }
        case USER_LEADERBOARD : {
            return {
                ...state,
                leaderBoardList: action.payload,
            }
        }
        case SHOW_TUTORIAL_POPUP: {
            return {
                ...state,
                showTutorial: action.payload,
            };
        }
        case MANAGE_NOTIFICATION: {
            return {
                ...state,
                notificationPreset: action.payload,
            };
        }
        case MANAGE_REWIRINGPROGRESS: {
            return {
                ...state,
                rewiredProgress: action.payload,
            };
        }
        case MANAGE_STREKPROGRESS: {
            return {
                ...state,
                streckProgress: action.payload,
            };
        }
        case MANAGE_LEVELPROGRESS: {
            return {
                ...state,
                levelProgress: action.payload,
            };
        }
        case MANAGE_AWARDPROGRESS: {
            return {
                ...state,
                awardProgress: action.payload,
            }
        }

        case SET_RANDOMVARIBLE : {
            return {
                ...state,
                rendomDateSave: action.payload,
            }
        }

        case RATE_YOURDAY_3 : {
            return {
                ...state,
                rateYourDay3: action.payload,
            }
        }

        case RATE_YOURDAY_7 : {
            return {
                ...state,
                rateYourDay7: action.payload,
            }
        }

        case SERVER_DATE : {
            return {
                ...state,
                serverDate: action.payload,
            }
        }

        case TUTORIAL_TAB1 : {
            return {
                ...state,
                tutorialTab1: action.payload,
            }
        }

        case TUTORIAL_TAB2 : {
            return {
                ...state,
                tutorialTab2: action.payload,
            }
        }

        case TUTORIAL_TAB3 : {
            return {
                ...state,
                tutorialTab3: action.payload,
            }
        }

        case TUTORIAL_TAB4 : {
            return {
                ...state,
                tutorialTab4: action.payload,
            }
        }

        case LAST_TEAM_MESSAGE: {
            return {
                ...state,
                lastTeamMessage: action.payload
            }
        }

        case NOTIFICATION_LIST: {
            return {
                ...state,
                notificationList: action.payload
            }
        }
        case NOTIFICATION_PROFILE: {
            return {
                ...state,
                lastNotificationMessage: action.payload
            }
        }
        case NOTIFICATION_BADGE_COUNT: {
            return {
                ...state,
                notificationBadgeCount: action.payload,
            }
        }
        case SELECT_THEME: {
            return {
                ...state,
                selectThemePopup: action.payload,
            }
        }
        case SELECT_THEME2: {
            return {
                ...state,
                selectSingleTime: action.payload,
            }
        }
        case DAILY_DISCUSSION: {
            return {
                ...state,
                dailyDiscussion: action.payload,
            }
        }
        case INTERNET_FILTERSTATE: {
            return {
                ...state,
                internetFilterState: action.payload,
            }
        }
        case REVENUECAYID: {
            return {
                ...state,
                revenuecatID: action.payload,
            }
        }
        case REMEMBERPASSWORD: {
            return {
                ...state,
                rememberPassword: action.payload,
            }
        }
        case PURCHASE_REGISTATION_DATA: {
            return {
                ...state,
                userRegistrationData: action.payload,
            }
        }
        default:
            return state;
    }
}

