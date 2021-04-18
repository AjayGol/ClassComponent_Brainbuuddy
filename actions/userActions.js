import {
    SET_USER_TOKEN,
    APP_SET_USER_DATA,
    USER_EMAIL_CHANGED,
    USER_PASS_CHANGED,
    START_LOADING,
    VISIBLE_TAB,
    REWIRING_PLAY,
    SET_USER_DETAIL,
    SET_COMPLETED_EXERCISES,
    SETTING_NOTIFICATIONS,
    SETTING_TEAMCHAT_NOTIFICATIONS,
    SET_READ_TODAY_LATTER,
    SET_API_CALL_DATE,
    TODAY_INSTANCES,
    FIRST_TIME_APP_OPEN_IN_DAY,
    IS_ASK_FOR_CHECKUP,
    IS_NETWORK_AVAILABLE,
    SET_SAFE_AREA_INTENT,
    SET_SAFE_AREA_INTENT_CHAT,
    SET_SAFE_AREA_INTENT_X,
    SUBSCRIPTION_CHECK_DATE,
    SHOW_CHECKUP_POPUP,
    SHOW_REWIRING_POPUP,
    SHOW_REWIRING_PROGRESS_POPUP,
    STREAK_GOAL_ACHIEVED_POPUP,
    MANAGED_SHOW_STREAK_POPUP,
    POPUP_QUEUE,
    TODAY_LIFE_TREEE,
    SHOW_STREAK_POPUP,
    APP_BADGE_COUNT,
    INTERNET_FILTER,
    APPTHEME_TYPE,
    RESET_STORE,
    SET_META_DATA,
    SET_LETTERS,
    SHOW_MONTHLY_POPUP,
    SHOW_MONTHLY_CHALLENGE_POPUP,
    MONTHLY_CHALLENGE_ACHIEVED,
    ENCOURAGE_POPUP,
    CONGRATULATE_POPUP,
    SET_DO_NOT_DISTURB,
    SHOW_TEAM_ACHIEVEMENT_POPUP,
    CUSTOM_POPUP,
    SET_LOCATION_INFO,
    PROFESSIONAL_USER_VISIBLE,
    META_DATA_BACKUP,
    SET_PORN_DAYS,
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
    TUTORIAL_TAB1,
    TUTORIAL_TAB2,
    TUTORIAL_TAB3,
    TUTORIAL_TAB4,
    TEAM_MEMBER_ARRAY,
    LAST_TEAM_MESSAGE,
    TEAM_CHAT_DISPLAY_LIST, NOTIFICATION_LIST, NOTIFICATION_BADGE_COUNT,
    SELECT_THEME, SELECT_THEME2,
    INTERNET_FILTERSTATE, REVENUECAYID, REMEMBERPASSWORD,
    SHOW_UPDATE_CALENDAR_POPUP, SHOW_MISSED_CHECKUP_POPUP,
    PURCHASE_REGISTATION_DATA
} from './types'
import React, {Component, useState, useContext, useEffect} from 'react';
import {AsyncStorage, Linking, NativeModules, Alert, Platform} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {CallApi, CallApi2, checkForRechability} from '../services/apiCall'
import Constant from '../services/apiConstant'
import {getPornDaysNew, calculatePornDay} from './statisticAction';
import {
    getTeamDetail, getTeamChat,
     getGlobalStatistic
} from './teamAction';
import {
    calculateImprovementByActivity,
    calculateMasturbationWhenIRelapse,
    calculatePornWhenIRelapse,
    calculatePornWhyIRelapse,
    calculateRewiringProgress,
    getAllMetaDataNew,
    setTimeZoneAndCheckupDateNew,
    updateMetaData,
} from './metadataActions';
// import {getAllLetters} from './lettersActions';
import {manageNotification} from '../helper/localNotification';
import moment from 'moment';
import _, {cloneDeep, filter, find, orderBy} from 'lodash';
import {appDefaultReducer} from "../reducers/defaultReducer";
import {
    resetAllAsyncStorageData, showThemeAlert, getCurrentMonth,
    showNoInternetAlert, showServerNotReachable,
    showAPICallError, backendNotReachable, getValidMetadata
} from "../helper/appHelper";
import {EventRegister} from 'react-native-event-listeners';
import AppConstant from '../helper/constant';
import OneSignal from "react-native-onesignal";
import axios from "axios";
import {strLocale, setI18nConfig} from "locale";

let nativeCall = (AppConstant.isIOS) && NativeModules.checkBundle || null;
import Geolocation from '@react-native-community/geolocation';
import * as RNLocalize from "react-native-localize";
import RNRestart from "react-native-restart";
import PushNotificationIOS from "@react-native-community/push-notification-ios/js/index";
// import {app} from '../helper/firebaseConfig';
import database from '@react-native-firebase/database';

let NativeCallback = NativeModules.checkBundle;

let isAlertShown = false;

const db = database();
const pageSize = 20;

export const loginUserNew2 = (email, password, isNewUser = false) => async (dispatch) => {
        try {

            var ref = db.ref("beefup/user")
            const key = ref.push().key;
            let value = {
                'id': key,
                'name': 'Bahivancha Barot',
                'email': 'ketan@gmail.com',
                'password': 'test1234',
                'age': '30',
                'avatar_id': '51',
                'gender': "transgender_male",
                'biography': "Test",
                'device_locale': "en",
                'motivation': "both",
                'notification_type': "none",
                'orientation': "heterosexual",
                'preferred_locale': "en",
                'region': "america",
                'suspended_until': '',
                'porn-days': {
                    "data": [
                        {
                            "id": 3761352,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-06"
                        },
                        {
                            "id": 3743894,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-07"
                        },
                        {
                            "id": 3730173,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-08"
                        },
                        {
                            "id": 3757146,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-09"
                        },
                        {
                            "id": 3761348,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-10"
                        },
                        {
                            "id": 3761894,
                            "is_relapse": true,
                            "is_resolved": true,
                            "occurred_at": "2020-02-11"
                        },
                        {
                            "id": 3761614,
                            "is_relapse": true,
                            "is_resolved": true,
                            "occurred_at": "2020-02-12"
                        },
                        {
                            "id": 3769919,
                            "is_relapse": true,
                            "is_resolved": true,
                            "occurred_at": "2020-02-13"
                        },
                        {
                            "id": 3769927,
                            "is_relapse": true,
                            "is_resolved": true,
                            "occurred_at": "2020-02-14"
                        },
                        {
                            "id": 3769933,
                            "is_relapse": true,
                            "is_resolved": true,
                            "occurred_at": "2020-02-15"
                        },
                        {
                            "id": 3783110,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-16"
                        },
                        {
                            "id": 3788582,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-17"
                        },
                        {
                            "id": 3792323,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-18"
                        },
                        {
                            "id": 3770518,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-19"
                        },
                        {
                            "id": 3849438,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-20"
                        },
                        {
                            "id": 3810259,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-21"
                        },
                        {
                            "id": 3849437,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-22"
                        },
                        {
                            "id": 3770459,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-23"
                        },
                        {
                            "id": 3823696,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-24"
                        },
                        {
                            "id": 3824901,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-25"
                        },
                        {
                            "id": 3823729,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-26"
                        },
                        {
                            "id": 3844158,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-27"
                        },
                        {
                            "id": 3823746,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-28"
                        },
                        {
                            "id": 3858443,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-02-29"
                        },
                        {
                            "id": 3877301,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-03-01"
                        },
                        {
                            "id": 3866028,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-03-02"
                        },
                        {
                            "id": 3872109,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-03-03"
                        },
                        {
                            "id": 3880404,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-03-04"
                        },
                        {
                            "id": 3888153,
                            "is_relapse": false,
                            "is_resolved": true,
                            "occurred_at": "2020-03-05"
                        }
                    ]
                },
                'get-latter': {
                    "data": [
                        {
                            "day": 1,
                            "content": "Godard art party letterpress single-origin coffee photo booth +1 yr. Cold-pressed intelligentsia truffaut next level everyday carry organic tilde. Gentrify retro tbh, 3 wolf moon pitchfork art party tote bag four dollar toast."
                        },
                        {
                            "day": 3,
                            "content": null
                        },
                        {
                            "day": 7,
                            "content": "Schlitz bicycle rights hoodie woke next level portland small batch shaman air plant etsy. Direct trade selvage lomo single-origin coffee readymade tousled intelligentsia, tattooed cray iPhone PBR&B kickstarter bushwick. Taxidermy enamel pin cornhole vape."
                        },
                        {
                            "day": 14,
                            "content": "Banjo pork belly irony venmo cray keffiyeh prism 3 wolf moon flexitarian, woke offal cliche keytar humblebrag mumblecore. Hoodie pop-up next level artisan pinterest kickstarter narwhal authentic squid. PBR&B sriracha yr mixtape truffaut art party. Gastropub fam quinoa subway tile +1 iceland. Post-ironic air plant ugh four dollar toast occupy, yuccie unicorn fanny pack."
                        },
                        {
                            "day": 30,
                            "content": null
                        },
                        {
                            "day": 90,
                            "content": null
                        },
                        {
                            "day": 180,
                            "content": "Hashtag put a bird on it disrupt mlkshk ennui shabby chic viral woke aesthetic everyday carry gluten-free marfa leggings helvetica. Raclette vice typewriter next level migas bespoke bitters."
                        },
                        {
                            "day": 365,
                            "content": "Pour-over yr etsy, woke occupy bitters neutra. Keytar post-ironic helvetica, knausgaard small batch heirloom XOXO selvage snackwave letterpress intelligentsia occupy subway tile literally shaman."
                        }
                    ]
                },
                'matadata': {
                    "progress_desensitation": 0,
                    "progress_hypofrontality": 0,
                    "progress_wisdom": 0,
                    "progress_dopamine_rewiring": 0,
                    "progress_stress_control": 0,
                    "relapse_porn_bored": 0,
                    "relapse_porn_stress": 0,
                    "relapse_porn_anxiety": 0,
                    "relapse_porn_tired": 0,
                    "relapse_porn_alone": 0,
                    "relapse_porn_pain": 0,
                    "relapse_porn_horny": 0,
                    "relapse_porn_morning": 0,
                    "relapse_porn_afternoon": 0,
                    "relapse_porn_evening": 0,
                    "relapse_porn_night": 0,
                    "relapse_masturbation_morning": 0,
                    "relapse_masturbation_afternoon": 0,
                    "relapse_masturbation_evening": 0,
                    "relapse_masturbation_night": 0,
                    "tempted_porn_morning": 0,
                    "tempted_porn_afternoon": 0,
                    "tempted_porn_evening": 0,
                    "tempted_porn_night": 0,
                    "tempted_masturbation_morning": 0,
                    "tempted_masturbation_afternoon": 0,
                    "tempted_masturbation_evening": 0,
                    "tempted_masturbation_night": 0,
                    "tempted_porn_bored": 0,
                    "tempted_porn_stress": 0,
                    "tempted_porn_anxiety": 0,
                    "tempted_porn_tired": 0,
                    "tempted_porn_alone": 0,
                    "tempted_porn_pain": 0,
                    "tempted_porn_horny": 0,
                    "exercise_number_activity": 0,
                    "exercise_number_audio": 0,
                    "exercise_number_breathing": 0,
                    "exercise_number_choose": 0,
                    "exercise_number_emotion": 0,
                    "exercise_number_escape": 0,
                    "exercise_number_faith": 0,
                    "exercise_number_kegals": 0,
                    "exercise_number_learn": 0,
                    "exercise_number_letters": 0,
                    "exercise_number_meditation": 0,
                    "exercise_number_slideshow": 0,
                    "exercise_number_story": 0,
                    "exercise_number_stress_relief": 0,
                    "exercise_number_thought_control": 0,
                    "exercise_number_brain_training": 0,
                    "exercise_number_video": 0,
                    "exercise_number_visualization": 0,
                    "exercise_number_profile": 0,
                    "tab_number_number": 0,
                    "power_memory_number": 0,
                    "improvement_mind": 0,
                    "improvement_energy": 0,
                    "improvement_attraction": 0,
                    "improvement_sleep": 0,
                    "improvement_voice": 0,
                    "improvement_health": 0,
                    "improvement_confidence": 0,
                    "improvement_alive": 0,
                    "stressed_morning": 0,
                    "stressed_afternoon": 0,
                    "stressed_evening": 0,
                    "stressed_night": 0,
                    "profile_psychology_1": 0,
                    "profile_psychology_2": 0,
                    "profile_psychology_3": 0,
                    "profile_psychology_4": 0,
                    "profile_psychology_5": 0,
                    "profile_psychology_6": 0,
                    "profile_psychology_7": 0,
                    "profile_psychology_8": 0,
                    "profile_anxiety_1": 0,
                    "profile_anxiety_2": 0,
                    "profile_anxiety_3": 0,
                    "profile_anxiety_4": 0,
                    "profile_anxiety_5": 0,
                    "profile_anxiety_6": 0,
                    "profile_anxiety_7": 0,
                    "profile_anxiety_8": 0,
                    "profile_selfesteem_1": 0,
                    "profile_selfesteem_2": 0,
                    "profile_selfesteem_3": 0,
                    "profile_selfesteem_4": 0,
                    "profile_selfesteem_5": 0,
                    "profile_selfesteem_6": 0,
                    "profile_selfesteem_7": 0,
                    "profile_selfesteem_8": 0,
                    "profile_behaviour_1": 0,
                    "profile_behaviour_2": 0,
                    "profile_behaviour_3": 0,
                    "profile_behaviour_4": 0,
                    "profile_behaviour_5": 0,
                    "profile_behaviour_6": 0,
                    "profile_behaviour_7": 0,
                    "profile_behaviour_8": 0,
                    "profile_relationship_1": 0,
                    "profile_relationship_2": 0,
                    "profile_relationship_3": 0,
                    "profile_relationship_4": 0,
                    "profile_relationship_5": 0,
                    "profile_relationship_6": 0,
                    "profile_relationship_7": 0,
                    "profile_relationship_8": 0,
                    "profile_physicality_1": 0,
                    "profile_physicality_2": 0,
                    "profile_physicality_3": 0,
                    "profile_physicality_4": 0,
                    "profile_physicality_5": 0,
                    "profile_physicality_6": 0,
                    "profile_physicality_7": 0,
                    "profile_physicality_8": 0,
                    "profile_dietary_1": 0,
                    "profile_dietary_2": 0,
                    "profile_dietary_3": 0,
                    "profile_dietary_4": 0,
                    "profile_dietary_5": 0,
                    "profile_dietary_6": 0,
                    "profile_dietary_7": 0,
                    "profile_dietary_8": 0,
                    "profile_stress_1": 0,
                    "profile_stress_2": 0,
                    "profile_stress_3": 0,
                    "profile_stress_4": 0,
                    "profile_stress_5": 0,
                    "profile_stress_6": 0,
                    "profile_stress_7": 0,
                    "profile_stress_8": 0,
                    "audio_exercises_completed": true,
                    "wants_religious_content": false,
                    "wants_reply_notifications": false,
                    "do_not_disturb_start": 20,
                    "do_not_disturb_end": 0,
                    "meditation_time": 30,
                    "colour_theme": "light",
                    "timezone": "Australia/Sydney",
                    "checkup_time": 0,
                    "last_checkup_at": "2017-01-22",
                    "registered_at": "2016-05-12",
                    "device": "iPhone 7",
                    "os_version": "12.2",
                    "app_version": "5.3.1"
                }
            }

            return new Promise((resolve, reject) => {
                ref.child(cloneDeep(key)).set(value)
                    .then(() => {
                        resolve(key)
                    })
                    .catch(error => {
                        reject('')
                    })
            });
        } catch
            (error) {
            alert(error.toString())
        }
    }

export const loginUserNew = (email, password, isNewUser = false) => async (dispatch, getState) => {
    const db = database().ref('beefup/user/').orderByChild("email").equalTo(email)

    return new Promise((resolve, reject) => {
        return db.once('value', snapshot => {
            if (snapshot.val()) {
                const snap = Object.entries(snapshot.val())
                if (snap.length !== 0) {
                    const data = snap[snap.length - 1]
                    if (data[1] && data[1].password === password) {
                        let user = {
                            email: email,
                            password: password,
                            // token: 'KzbxIYHZeSrqfCzDzTg2Np62MP4u05VAO2MXatj3WpYnbfj6yoTSxOOGPyxMw7Me',
                            id: data[1].id
                        };
                        AsyncStorage.setItem('user', JSON.stringify(user));
                        dispatch({
                            type: APP_SET_USER_DATA,
                            payload: {
                                // "token": "KzbxIYHZeSrqfCzDzTg2Np62MP4u05VAO2MXatj3WpYnbfj6yoTSxOOGPyxMw7Me"
                            },
                        });

                        dispatch(loadDataAfterLoginNew(isNewUser, true, {email: email}, snapshot, data[1].id))
                        resolve(true)
                    }
                }
                reject(false)
            } else {
                reject('')
            }
        }, e => {
            reject('')
        })
    })
}

export const checkUserAlreadyRegistered = (email) => async (dispatch) => {
    const db = database().ref('beefup/user/').orderByChild("email").equalTo(email)

    return new Promise((resolve, reject) => {
        return db.once('value', snapshot => {
            if (snapshot.val()) {
                resolve(false)
            } else {
                resolve(true)
            }
        }, e => {
            reject('')
        })
    })
}

export const checkUserAlreadyRegisteredForgote = (email) => async (dispatch) => {
    const db = database().ref('beefup/user/').orderByChild("email").equalTo(email)

    return new Promise((resolve, reject) => {
        return db.once('value', snapshot => {
            if (snapshot.val()) {

                const snap = Object.entries(snapshot.val())
                if (snap.length !== 0) {
                    const data = snap[snap.length - 1]
                    resolve({id: data[0], password: data[1].password})
                }

                resolve(true)
            } else {
                resolve(true)
            }
        }, e => {
            reject('')
        })
    })
}

export const createUserNew = (userDetails) => async (dispatch) => {

    try {
        var ref = db.ref("beefup/user")
        const key = ref.push().key;
        //
        //Defualt paramater add here
        let defaultValue = {
            'id': key,
            'platform': AppConstant.isIOS && 'ios' || 'android',
            'biography': "Test",
            'device_locale': "en",
            'motivation': "both",
            'notification_type': "none",
            'orientation': "heterosexual",
            'preferred_locale': "en",
            'region': "america",
            'suspended_until': '',
            "register_date": moment().format("YYYY-MM-DD"),
            'get-latter': {
                "data": [
                    {
                        "day": 1,
                        "content": "Godard art party letterpress single-origin coffee photo booth +1 yr. Cold-pressed intelligentsia truffaut next level everyday carry organic tilde. Gentrify retro tbh, 3 wolf moon pitchfork art party tote bag four dollar toast."
                    },
                    {
                        "day": 3,
                        "content": null
                    },
                    {
                        "day": 7,
                        "content": "Schlitz bicycle rights hoodie woke next level portland small batch shaman air plant etsy. Direct trade selvage lomo single-origin coffee readymade tousled intelligentsia, tattooed cray iPhone PBR&B kickstarter bushwick. Taxidermy enamel pin cornhole vape."
                    },
                    {
                        "day": 14,
                        "content": "Banjo pork belly irony venmo cray keffiyeh prism 3 wolf moon flexitarian, woke offal cliche keytar humblebrag mumblecore. Hoodie pop-up next level artisan pinterest kickstarter narwhal authentic squid. PBR&B sriracha yr mixtape truffaut art party. Gastropub fam quinoa subway tile +1 iceland. Post-ironic air plant ugh four dollar toast occupy, yuccie unicorn fanny pack."
                    },
                    {
                        "day": 30,
                        "content": null
                    },
                    {
                        "day": 90,
                        "content": null
                    },
                    {
                        "day": 180,
                        "content": "Hashtag put a bird on it disrupt mlkshk ennui shabby chic viral woke aesthetic everyday carry gluten-free marfa leggings helvetica. Raclette vice typewriter next level migas bespoke bitters."
                    },
                    {
                        "day": 365,
                        "content": "Pour-over yr etsy, woke occupy bitters neutra. Keytar post-ironic helvetica, knausgaard small batch heirloom XOXO selvage snackwave letterpress intelligentsia occupy subway tile literally shaman."
                    }
                ]
            },
            'level': {
                'started_app': {'point': 10, title: 'started app', date: "2018-05-10"},
                'first_excesices': {'point': 10, title: 'complete first excesices', date: "2018-05-8"},
            },
            'matadata': {
                "progress_selfcompassion": 0,
                "progress_rest": 0,
                "progress_activity": 0,
                "progress_nutrition": 0,
                "progress_mentaldiet": 0,
                "progress_relationships": 0,
                "progress_stress": 0,
                "progress_level": 0,
                "awards_community": 0,
                "awards_lover": 0,
                "awards_launch": 0,
                "awards_meditation": 0,
                "awards_selfconfident": 0,
                "awards_streakgoalmaster": 0,
                "progress_desensitation": 0,
                "progress_hypofrontality": 0,
                "progress_wisdom": 0,
                "progress_dopamine_rewiring": 0,
                "progress_stress_control": 0,
                "relapse_porn_bored": 0,
                "relapse_porn_stress": 0,
                "relapse_porn_anxiety": 0,
                "relapse_porn_tired": 0,
                "relapse_porn_alone": 0,
                "relapse_porn_pain": 0,
                "relapse_porn_horny": 0,
                "relapse_porn_morning": 0,
                "relapse_porn_afternoon": 0,
                "relapse_porn_evening": 0,
                "relapse_porn_night": 0,
                "relapse_masturbation_morning": 0,
                "relapse_masturbation_afternoon": 0,
                "relapse_masturbation_evening": 0,
                "relapse_masturbation_night": 0,
                "tempted_porn_morning": 0,
                "tempted_porn_afternoon": 0,
                "tempted_porn_evening": 0,
                "tempted_porn_night": 0,
                "tempted_masturbation_morning": 0,
                "tempted_masturbation_afternoon": 0,
                "tempted_masturbation_evening": 0,
                "tempted_masturbation_night": 0,
                "tempted_porn_bored": 0,
                "tempted_porn_stress": 0,
                "tempted_porn_anxiety": 0,
                "tempted_porn_tired": 0,
                "tempted_porn_alone": 0,
                "tempted_porn_pain": 0,
                "tempted_porn_horny": 0,
                "exercise_number_activity": 0,
                "exercise_number_audio": 0,
                "exercise_number_breathing": 0,
                "exercise_number_choose": 0,
                "exercise_number_emotion": 0,
                "exercise_number_escape": 0,
                "exercise_number_faith": 0,
                "exercise_number_kegals": 0,
                "exercise_number_learn": 0,
                "exercise_number_letters": 0,
                "exercise_number_meditation": 0,
                "exercise_number_slideshow": 0,
                "exercise_number_story": 0,
                "exercise_number_stress_relief": 0,
                "exercise_number_thought_control": 0,
                "exercise_number_brain_training": 0,
                "exercise_number_video": 0,
                "exercise_number_visualization": 0,
                "exercise_number_profile": 0,
                "improvement_mind": 0,
                "improvement_energy": 0,
                "improvement_attraction": 0,
                "improvement_sleep": 0,
                "improvement_voice": 0,
                "improvement_health": 0,
                "improvement_confidence": 0,
                "improvement_alive": 0,
                "stressed_morning": 0,
                "stressed_afternoon": 0,
                "stressed_evening": 0,
                "stressed_night": 0,
                "profile_psychology_1": 0,
                "profile_psychology_2": 0,
                "profile_psychology_3": 0,
                "profile_psychology_4": 0,
                "profile_psychology_5": 0,
                "profile_psychology_6": 0,
                "profile_psychology_7": 0,
                "profile_psychology_8": 0,
                "profile_anxiety_1": 0,
                "profile_anxiety_2": 0,
                "profile_anxiety_3": 0,
                "profile_anxiety_4": 0,
                "profile_anxiety_5": 0,
                "profile_anxiety_6": 0,
                "profile_anxiety_7": 0,
                "profile_anxiety_8": 0,
                "profile_selfesteem_1": 0,
                "profile_selfesteem_2": 0,
                "profile_selfesteem_3": 0,
                "profile_selfesteem_4": 0,
                "profile_selfesteem_5": 0,
                "profile_selfesteem_6": 0,
                "profile_selfesteem_7": 0,
                "profile_selfesteem_8": 0,
                "profile_behaviour_1": 0,
                "profile_behaviour_2": 0,
                "profile_behaviour_3": 0,
                "profile_behaviour_4": 0,
                "profile_behaviour_5": 0,
                "profile_behaviour_6": 0,
                "profile_behaviour_7": 0,
                "profile_behaviour_8": 0,
                "profile_relationship_1": 0,
                "profile_relationship_2": 0,
                "profile_relationship_3": 0,
                "profile_relationship_4": 0,
                "profile_relationship_5": 0,
                "profile_relationship_6": 0,
                "profile_relationship_7": 0,
                "profile_relationship_8": 0,
                "profile_physicality_1": 0,
                "profile_physicality_2": 0,
                "profile_physicality_3": 0,
                "profile_physicality_4": 0,
                "profile_physicality_5": 0,
                "profile_physicality_6": 0,
                "profile_physicality_7": 0,
                "profile_physicality_8": 0,
                "profile_dietary_1": 0,
                "profile_dietary_2": 0,
                "profile_dietary_3": 0,
                "profile_dietary_4": 0,
                "profile_dietary_5": 0,
                "profile_dietary_6": 0,
                "profile_dietary_7": 0,
                "profile_dietary_8": 0,
                "profile_stress_1": 0,
                "profile_stress_2": 0,
                "profile_stress_3": 0,
                "profile_stress_4": 0,
                "profile_stress_5": 0,
                "profile_stress_6": 0,
                "profile_stress_7": 0,
                "profile_stress_8": 0,
                "audio_exercises_completed": true,
                "wants_religious_content": false,
                "wants_reply_notifications": false,
                "do_not_disturb_start": 20,
                "do_not_disturb_end": 0,
                "meditation_time": 30,
                "colour_theme": "light",
                "timezone": "Australia/Sydney",
                "checkup_time": 0,
                "last_checkup_at": moment().subtract(1, 'days').format('YYYY-MM-DD'),
                "registered_at": moment().format("YYYY-MM-DD"),
                "device": "iPhone 7",
                "os_version": "12.2",
                "app_version": "5.3.1"
            }
        }
        if (!userDetails["porn-days"]){
            defaultValue["porn-days"] = {
                "data": []
            }
        }
        let newValue = Object.assign({}, userDetails, defaultValue)
        // alert(key)

        //
        return new Promise((resolve, reject) => {
            ref.child(key).set(newValue)
                .then(() => {
                    resolve(true)
                })
                .catch(error => {
                    reject('')
                })
        });
    } catch
        (error) {
        alert(error.toString())
    }

};

export const loadDataAfterLoginNew = (isNewUser = false, isFromLogin = false, userLoginObj = null, snapshot, id = null) => {
    return (dispatch, getState) => {
        let userLanguage = "en";
        let currentLocale = RNLocalize.getLocales();
        if (currentLocale.length > 0 && currentLocale[0].languageCode) {
            userLanguage = currentLocale[0].languageCode;
        }

        if (isNewUser) {
            let userObj = _.cloneDeep(getState().user.userDetails);
            if (userLoginObj) {
                userObj.email = userLoginObj.email;
                userObj.device_locale = userLanguage;
                userObj.preferred_locale = AppConstant.appLocalization.includes(userLanguage) && userLanguage || 'en';
                // setI18nConfig({dbValue: userObj.preferred_locale, isRTL: false});
                // AsyncStorage.setItem("appLanguage", JSON.stringify({dbValue: userObj.preferred_locale, isRTL: false}));
                if (userObj.preferred_locale === 'zh') {
                    userObj.preferred_locale = 'zh-Hans';
                }
                if ('id' in userObj) {
                    delete userObj['id'];
                }
            }
            return Promise.all([
                // dispatch(updateUserDetail(userObj)),
                dispatch(getAllMetaDataNew()),
                // dispatch(getPornDays()),
                // dispatch(getMasturbationDays()),
            ]).then(res => {
                if (isFromLogin) {
                    console.log('calling when signUp');
                    // dispatch(getTeamDetail());
                    // dispatch(getAllLetters());
                    dispatch(getTeamChat());
                    // dispatch(getHelpPostDetail());
                    // dispatch(getleaderboardTeamList(true));
                    // dispatch(getUserDetail());
                }
                dispatch({
                    type: START_LOADING,
                    payload: false,
                });
                return Promise.resolve(true);
            }).catch((error) => {
                console.log("Error loadDataAfterLogin ---> ", error)
                return Promise.reject(error)
            });
        } else {

            let valueData = {};
            if (snapshot.val()) {
                const snap = Object.entries(snapshot.val())
                if (snap.length !== 0) {
                    valueData = snap[snap.length - 1]
                }
            }

            if (isFromLogin) {
                console.log('calling when login')


                return Promise.all([
                    dispatch(getAllMetaDataNew(null, false, snapshot, id)),
                    dispatch(getPornDaysNew(false, true, null, valueData[1] || null)),
                    // dispatch(getMasturbationDays()),
                    dispatch(getUserDetailNew(true, snapshot)),
                ]).then(res => {
                    // dispatch(getAllLetters());
                    // dispatch(getTeamDetail());
                    // dispatch(getTeamChat());
                    // dispatch(getHelpPostDetail());
                    // // dispatch(manageLocalization(null, true));
                    // dispatch(getleaderboardTeamList(true));
                    //
                    // dispatch({
                    //     type: START_LOADING,
                    //     payload: false,
                    // });
                    return Promise.resolve(true);
                }).catch((error) => {
                    console.log("Error loadDataAfterLogin ---> ", error)
                    return Promise.reject(error)
                });

                // setTimeout(()=>{
                //     dispatch(getAllLetters());
                //     dispatch(getTeamDetail());
                //     dispatch(getTeamChat());
                //     dispatch(getHelpPostDetail());
                //     // dispatch(manageLocalization(null, true));
                //     dispatch(getleaderboardTeamList(true));
                // },500)
            }
        }
    }
}

//SetData while app open
export const setUserTokenOnOpen = (userObj) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_USER_TOKEN,
            payload: userObj
        });
    };
};

export const setNewUser = (userObj) => {
    return (dispatch, getState) => {
        debugger
        dispatch({
            type: SET_USER_DETAIL,
            payload: userObj
        });
    };
};


export const getUserDetailNew = (isFromLogin = false, snapshot = null) => {
    return (dispatch, getState) => {
        if (snapshot.val()) {
            const snap = Object.entries(snapshot.val())
            if (snap.length !== 0) {
                const data = snap[snap.length - 1]

                if (data[1]) {
                    if (isFromLogin) {
                        let preferedLanguage = data[1].preferred_locale || 'en';
                        if (preferedLanguage.includes('zh')) {
                            preferedLanguage = 'zh';
                        }
                        // setI18nConfig({dbValue: preferedLanguage, isRTL: false});
                        // AsyncStorage.setItem("appLanguage", JSON.stringify({dbValue: preferedLanguage, isRTL: false}));
                    }
                }


                dispatch({
                    type: SET_USER_DETAIL,
                    payload: data[1],
                });
                return Promise.resolve(true);
            }
        }
    };
};


export const emailChanged = (text) => {
    return {type: USER_EMAIL_CHANGED, payload: text};
};

export const startLoading = (text) => {
    return {type: START_LOADING, payload: text};
};

export const passChanged = (text) => {
    return {type: USER_PASS_CHANGED, payload: text};
};

//On Tabbar change
export const tabChanged = (tabName) => {
    return (dispatch, getState) => {
        if (AppConstant.isIOS) {
            if (tabName == "team") {
                nativeCall.manageKeyboard(true);
            } else {
                nativeCall.manageKeyboard(false);
            }
        }
        dispatch({type: VISIBLE_TAB, payload: tabName});
        if (tabName == 'milestone' || tabName == 'team') {
            // dispatch(activeAppManagedTab(tabName))
        }
        return;
    }
};

//Setting Notification
export const setNotification = (notification) => {
    return (dispatch, getState) => {
        dispatch({
            type: SETTING_NOTIFICATIONS,
            payload: notification
        });
    };
};
//setting team chat notification
export const setTeamChatNotification = (notification) => {
    return (dispatch, getState) => {
        dispatch({
            type: SETTING_TEAMCHAT_NOTIFICATIONS,
            payload: notification
        });
    };
};

//Set completed exercises
export const setCompletedExercises = (exercisesName) => {
    return (dispatch, getState) => {
        let completedExercises = getState().user.completedExercises;
        let today = new Date().toDateString();
        let exericieses = [];
        if (completedExercises.date != today) {
            exericieses = [exercisesName];
        } else {
            exericieses = completedExercises.exercises;
            if (exericieses.indexOf(exercisesName) < 0) {
                exericieses.push(exercisesName);
            }
        }
        dispatch({
            type: SET_COMPLETED_EXERCISES,
            payload: {
                date: today,
                exercises: exericieses
            }
        });
    };
};

export const setReadLatterDone = (previousAchieved) => {
    return (dispatch, getState) => {
        let obj = {
            date: new Date().toDateString(),
            previousAchieved: previousAchieved
        };
        dispatch({
            type: SET_READ_TODAY_LATTER,
            payload: obj
        });
        return Promise.resolve(true);
    };
};

export const setDoneAPICallForToday = () => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_API_CALL_DATE,
            payload: new Date().toDateString()
        });
        return Promise.resolve(true);
    };
};

export const manageTodayInstances = (instance) => {
    return (dispatch, getState) => {
        dispatch({
            type: TODAY_INSTANCES,
            payload: instance
        });
        return Promise.resolve(true);
    };
};

//Manage local notification
export const setUpLocalNotificationAlerts = () => {
    return (dispatch, getState) => {
        try {
            let last_checkup_at = (getState().metaData.metaData.last_checkup_at != undefined) &&
                getState().metaData.metaData.last_checkup_at || "";
            let checkup_time = (getState().metaData.metaData.checkup_time != undefined) &&
                getState().metaData.metaData.checkup_time || 18;

            let userName = (getState().user && getState().user.userDetails && getState().user.userDetails.name)
                && getState().user.userDetails.name || "";

            let settingNotifications = getState().user.settingNotifications;

            let streakGoal = "";
            let calculatedObj = getState().statistic.currentGoal || 0;
            let currentClean = getState().statistic.pornDetail.current_p_clean_days || 0;
            let remainingHour = (calculatedObj.goalDays * 24) - ((currentClean * 24) + new Date().getHours());
            let todayDate = moment().format("YYYY-MM-DD");
            let pornObj = _.find(getState().statistic.pornDetail.p_array, {occurred_at: todayDate, is_relapse: false});

            if (remainingHour <= 24 && last_checkup_at == todayDate && pornObj != undefined) {
                let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
                streakGoal = "Streak goal achieved. Congratulations on 24 hours clean";
                if (calculatedObj.goalDays != 1) {
                    streakGoal = "Streak goal achieved. Congratulations on " + calculatedObj.goalDays + " days clean! \ud83c\udf89";
                }
                // let objGoalAchieved = {isShown: false,showDate: tomorrow,achievedGoal: calculatedObj.goalDays};
                // let obj = getState().user.showGoalAchieved;
                // console.log("objGoalAchieved",objGoalAchieved, obj)
                // if(_.isEqual(obj, objGoalAchieved)) {
                // }else {
                //     dispatch({
                //         type: MANAGED_SHOW_STREAK_POPUP,
                //         payload: objGoalAchieved
                //     });
                //     console.log(objGoalAchieved);
                // }
            }
            // else {
            //     let obj = getState().user.showGoalAchieved;
            //     if(!obj.isShown) {
            //         let todayDate = moment().format("YYYY-MM-DD");
            //         let yesterdayDate = moment().subtract(0, 'days').format('YYYY-MM-DD');
            //         let yesterdayPornObj = _.find(getState().statistic.pornDetail.p_array,
            //             { occurred_at: yesterdayDate, is_relapse: false });
            //         console.log(yesterdayPornObj);
            //
            //         if(yesterdayPornObj != undefined && obj.showDate === todayDate){
            //             //&& obj.achievedGoal === calculatedObj.previousAchieved) {
            //             console.log("inside iffff - do nothing")
            //         }else{
            //             let showGoalAchieved = {
            //                 isShown: false,
            //                 showDate: "",
            //                 achievedGoal: 0
            //             };
            //             console.log("inside else - set no goal completed")
            //             if(_.isEqual(obj, showGoalAchieved)){
            //             }else {
            //                 if(obj.showDate != ""){
            //                     dispatch({
            //                         type: MANAGED_SHOW_STREAK_POPUP,
            //                         payload: showGoalAchieved
            //                     });
            //                     console.log(showGoalAchieved);
            //                 }
            //             }
            //         }
            //     }
            // }

            // if (settingNotifications.length>0 && !settingNotifications[0].hours){
            //     settingNotifications[0].hours = getState().user.userDetails.time;
            //     settingNotifications[0].minute = getState().user.userDetails.time2;
            // }
            manageNotification(checkup_time, last_checkup_at, userName, settingNotifications, streakGoal);
            return true;
        } catch (e) {
            console.log("error - setUpLocalNotificationAlerts", e);
        }
    };
};

export const manageStreakAchievedPopup = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SHOW_STREAK_POPUP,
            payload: detail
        });
    };
};

//Manage streak achieved popup
export const manageAchievedPopup = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: MANAGED_SHOW_STREAK_POPUP,
            payload: detail
        });
    };
};

//Show Custom popup
export const manageCustomPopup = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: CUSTOM_POPUP,
            payload: detail
        });
    };
};

//first time open app in a day  //false true true
//objFirstAsk.isAskForUpdateCalendar, false   => no popup
//nextProps.setDateforTodayOpen(true, false); == if popup
export const setDateforTodayOpen = (isAskForUpdate, isNewOpen, isFromInitial = false) => {
    return (dispatch, getState) => {
        let isAsked = isAskForUpdate;
        let todayDate = new Date().toDateString();
        if (isFromInitial) {
            isAsked = getState().user.isOpenFirstTime.isAskForUpdateCalendar;
            todayDate = getState().user.isOpenFirstTime.date;
        }
        dispatch({
            type: FIRST_TIME_APP_OPEN_IN_DAY,
            payload: {
                date: todayDate,
                isAskForUpdateCalendar: isAsked,
                isNewOpen: isNewOpen
            }
        });
        return Promise.resolve(true);
    };
};

//Managed Popup Here
//Manage ask for checkup popup
export const setAskedForCheckupPopup = (isAsked) => {
    return (dispatch, getState) => {
        return dispatch({
            type: IS_ASK_FOR_CHECKUP,
            payload: isAsked
        });
    };
};

//Manage checkup popup
export const manageCheckupPopup = (showCheckupDetail) => {
    return (dispatch, getState) => {
        if (showCheckupDetail.isShow) {
            let obj = _.cloneDeep(getState().user.popupQueue);
            obj.checkup = (showCheckupDetail.isShow) ? showCheckupDetail : null;
            dispatch({
                type: POPUP_QUEUE,
                payload: obj
            });
        }
        return dispatch({
            type: SHOW_CHECKUP_POPUP,
            payload: showCheckupDetail
        });
    };
};

//Manage rewiring popup
export const manageRewiringPopup = (showRewiringDetail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SHOW_REWIRING_POPUP,
            payload: showRewiringDetail
        });
    };
};

//Manage welcome back checkup
export const manageUpdateForCalendar = (showRewiringDetail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SHOW_UPDATE_CALENDAR_POPUP,
            payload: showRewiringDetail
        });
    };
};

export const manageMissedCheckup = (showRewiringDetail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SHOW_MISSED_CHECKUP_POPUP,
            payload: showRewiringDetail
        });
    };
};

//Manage team achievement popup
export const manageTeamAchievementPopup = (teamAchievementDetail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SHOW_TEAM_ACHIEVEMENT_POPUP,
            payload: teamAchievementDetail
        });
    };
};

//Manage Monthly Challenge popup
export const manageMonthlyChallengePopup = (monthlyDetail) => {
    return (dispatch, getState) => {
        let obj = _.cloneDeep(getState().user.popupQueue);
        obj.monthlyChallenge = (monthlyDetail.isShow) && true || null;
        dispatch({
            type: POPUP_QUEUE,
            payload: obj
        });
        return dispatch({
            type: SHOW_MONTHLY_CHALLENGE_POPUP,
            payload: monthlyDetail
        });
    };
};

export const manageMonthlyChallengeAchieved = (details) => {
    return (dispatch, getState) => {
        return dispatch({
            type: MONTHLY_CHALLENGE_ACHIEVED,
            payload: details
        });
    };
};

//Manage Rewired popup
export const manageRewiredProgressPopup = (isShow, isSetPrev = false, isNewUpdate = false, rewiredData = null) => {
    return (dispatch, getState) => {
        let obj = _.cloneDeep(getState().user.popupQueue);
        obj.rewired = (isShow) && true || null;
        dispatch({
            type: POPUP_QUEUE,
            payload: obj
        });

        let totalRewiringPercentage = getState().statistic.totalRewiringPercentage;
        let circularRewiringPercentage = getState().statistic.circularRewiringPercentage;

        if (rewiredData) {
            totalRewiringPercentage = rewiredData.totalRewiringPercentage;
            circularRewiringPercentage = rewiredData.circularRewiringPercentage;
        }

        let prevPrec = getState().user.showRewindProgressPopUp.rewindDetail.prevProgress;
        if (isSetPrev || prevPrec > totalRewiringPercentage) {
            prevPrec = ((getState().user.showRewindProgressPopUp.rewindDetail.totalRewiringPercentage % 10) == 0) ?
                getState().user.showRewindProgressPopUp.rewindDetail.totalRewiringPercentage : 0;
        }

        let showRewindProgressPopUp = {
            isShow: (isNewUpdate) ? getState().user.showRewindProgressPopUp.isShow : isShow,
            rewindDetail: {
                totalRewiringPercentage: totalRewiringPercentage,
                circularRewiringPercentage: circularRewiringPercentage,
                avatar_id: getState().user.userDetails.avatar_id,
                prevProgress: prevPrec,
            }
        };
        return dispatch({
            type: SHOW_REWIRING_PROGRESS_POPUP,
            payload: showRewindProgressPopUp
        });
    };
};

//Manage Encourage popup
export const manageEncouragePopup = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: ENCOURAGE_POPUP,
            payload: detail
        });
    };
};

//Manage Congratulate popup
export const manageCongatulatePopup = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: CONGRATULATE_POPUP,
            payload: detail
        });
    };
};

//Set setIsNetworkAvailable - isConnected = true or false
export const setIsNetworkAvailable = (isConnected) => {
    return (dispatch, getState) => {
        if (!isConnected) {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    return dispatch({
                        type: IS_NETWORK_AVAILABLE,
                        payload: true
                    });
                } else {
                    return dispatch({
                        type: IS_NETWORK_AVAILABLE,
                        payload: false
                    });
                }
            });
        } else {
            return dispatch({
                type: IS_NETWORK_AVAILABLE,
                payload: isConnected
            });
        }
    };
};


export const setSafeAreaIntent = (data) => {
    return (dispatch, getState) => {
        if (AppConstant.isIOS) {
            return dispatch({
                type: SET_SAFE_AREA_INTENT,
                payload: data
            });
        }
    }
};

export const setSafeAreaIntentChatModule = (data) => {
    return (dispatch, getState) => {
        if (AppConstant.isIOS) {
            return dispatch({
                type: SET_SAFE_AREA_INTENT_CHAT,
                payload: data
            });
        }
    }
};

export const setSafeAreaIntentX = (data) => {
    return (dispatch, getState) => {
        if (AppConstant.isIOS) {
            return dispatch({
                type: SET_SAFE_AREA_INTENT_X,
                payload: data
            });
        }
    }
};

export const removeSafeArea = (isDefault = false) => {
    return (dispatch, getState) => {
        if (AppConstant.isIOS) {
            let obj = _.cloneDeep(getState().user.safeAreaInsetsDefault);
            if (!isDefault) {
                obj.bottom = 0;
            }
            return dispatch({
                type: SET_SAFE_AREA_INTENT_X,
                payload: obj
            })
        }
    }
};

// export const setSafeAreaIntent = (data) => {
//     return (dispatch, getState) => {
//         return dispatch({
//             type: SET_SAFE_AREA_INTENT,
//             payload: data
//         });
//     }
// };
//
// export const setSafeAreaIntentX = (data) => {
//     return (dispatch, getState) => {
//         return dispatch({
//             type: SET_SAFE_AREA_INTENT_X,
//             payload: data
//         });
//     }
// };
//
// export const removeSafeArea = (isDefault=false) => {
//     return (dispatch,getState) => {
//         let obj = _.cloneDeep(getState().user.safeAreaInsetsDefault);
//         if(!isDefault){
//             obj.bottom=0;
//         }
//         return dispatch({
//             type:SET_SAFE_AREA_INTENT_X,
//             payload:obj
//         })
//     }
// };

//Set Subscription in process
export const setSubscriptionInProcess = (flag) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SUBSCRIPTION_CHECK_DATE,
            payload: flag
        });
    }
};

//Manage popup queue
export const managePopupQueue = (obj) => {
    return (dispatch, getState) => {
        return dispatch({
            type: POPUP_QUEUE,
            payload: obj
        });
    }
};

//Manage Today life Tree
export const manageLifeTreeOnToday = (obj) => {

    return (dispatch, getState) => {
        return dispatch({
            type: TODAY_LIFE_TREEE,
            payload: obj
        });
    }
};

//Manage App badge count
export const manageAppBadgeCount = (count) => {
    return (dispatch, getState) => {
        return dispatch({
            type: APP_BADGE_COUNT,
            payload: _.cloneDeep(count)
        });
    }
};

export const manageNotificationBadgeCount = (count) => {
    return (dispatch, getState) => {
        return dispatch({
            type: NOTIFICATION_BADGE_COUNT,
            payload: _.cloneDeep(count)
        });
    }
};

export const manageLastTeamMessage = (message) => {
    return (dispatch, getState) => {
        return dispatch({
            type: LAST_TEAM_MESSAGE,
            payload: message
        });
    }
};

//Manage Internet Filter
export const manageInternetFilter = (internetFilter) => {
    return (dispatch, getState) => {
        this.manaheInternetFilterNative(internetFilter);
        return dispatch({
            type: INTERNET_FILTER,
            payload: _.cloneDeep(internetFilter)
        });
    }
};

manaheInternetFilterNative = (alteredData) => {
    let kBlockList = "blockAllList";
    let kBlockWebsite = "websites";
    let kBlockKeyword = "keywords";
    let NativeInternetFilter = NativeModules.InternetFilter;
    try {
        debugger
        let webSiteBlockes = [];
        let isBlockAllAdultWebSite = alteredData[0][kBlockList][0].value;

        let allWeb = alteredData[1][kBlockWebsite][0].allWebSite;
        allWeb.forEach(obj => {
            webSiteBlockes.push({action: {type: "block"}, trigger: {"url-filter": ".*" + obj.name + ".*"}});
        });

        let allKeywod = alteredData[2][kBlockKeyword][0].allKeywords;
        allKeywod.forEach(obj => {
            webSiteBlockes.push({action: {type: "block"}, trigger: {"url-filter": ".*" + obj.name + ".*"}});
        });

        if (webSiteBlockes.length == 0 && !isBlockAllAdultWebSite) {
            webSiteBlockes.push({action: {type: "ignore-previous-rules"}, trigger: {"url-filter": ".*"}});
        }
        webSiteBlockes.push({action: {type: "block"}, trigger: {"url-filter": ".*" + "yahoo" + ".*"}});
        let objStr = JSON.stringify(webSiteBlockes);

        NativeInternetFilter.setSites(objStr, isBlockAllAdultWebSite, (error, events) => {
            // console.log("call");
        });
    } catch (e) {
        console.log("Err - manageWebsiteBlock", e);
    }
}

//call api when app comes from background to foreground
export const activeAppManagedTab = (selectedTab = null) => {
    return (dispatch, getState) => {
        let tabName = getState().user.visibleTab;
        if (selectedTab) {
            tabName = selectedTab
        }
        switch (tabName) {
            case "today":
                break;
            case "statistic":
                break;
            case "team":
                if (getState().user.isConnected) {
                    dispatch(getTeamChat());
                    break;
                }
            case "milestone":
                if (getState().user.isConnected) {
                    EventRegister.emit('milestoneTab', "true");
                }
                break;
            case "more":
                break;
        }
    }
};

//call letter api
export const managedLetterAPI = (isCall = false) => {
    return (dispatch, getState) => {
        if (isCall) {
            // dispatch(getAllLetters());
        } else {
            let today = new Date().toDateString()
            AsyncStorage.getItem('letterAPICall').then((letter) => {
                if (letter) {
                    if (letter !== today) {
                        // dispatch(getAllLetters());
                    }
                } else {
                    // dispatch(getAllLetters());
                }
                AsyncStorage.setItem('letterAPICall', today);
            });
        }
    }
};

//App Theme type
export const setAppTheme = (type, isCallApi = true) => {
    return (dispatch, getState) => {
        if (type == 'dark') {
            dispatch({
                type: APPTHEME_TYPE,
                payload: AppConstant.darkTheme
            });
            EventRegister.emit('themeListener', AppConstant.darkTheme);
        } else {

            dispatch({
                type: APPTHEME_TYPE,
                payload: AppConstant.lightTheme
            });
            EventRegister.emit('themeListener', AppConstant.lightTheme);
        }
        if (isCallApi) {
            // dispatch(updateMetaDataNoCalculation({colour_theme: type}));
        }
        return Promise.resolve(true);
    };
};

export const setThemeAfterSunset = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if ((AppConstant.isIOS && Platform.Version >= 13.0)) {
                resolve(true);
            } else {
                return Geolocation.getCurrentPosition(
                    position => {
                        resolve(true);
                        if (position && position.coords) {
                            const url = `https://api.sunrise-sunset.org/json?lat=${position.coords.latitude}&lng=${position.coords.longitude}&formatted=0`;
                            axios.get(url)
                                .then(res => {
                                    if (res && res.data && res.data.results) {
                                        let finalResult = res.data.results;
                                        let sunrise = new Date(finalResult.sunrise);
                                        let sunset = new Date(finalResult.sunset);
                                        Promise.all(
                                            dispatch({
                                                type: SET_LOCATION_INFO,
                                                payload: {
                                                    userLocation: {
                                                        latitude: position.coords.latitude,
                                                        longitude: position.coords.longitude
                                                    },
                                                    sunsetSunrise: {
                                                        sunrise,
                                                        sunset
                                                    }
                                                }
                                            })).then(res => {
                                            dispatch(setAppTheme('autodark', false));
                                        })
                                    }
                                })
                                .catch(err => {
                                    //alert(JSON.stringify(err));
                                });
                        }
                    },
                    error => {
                        reject(error);
                    },
                    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
                );
            }
        });
    };
}

//Reset Store
export const resetStoreData = () => {
    return (dispatch, getState) => {
        appDefaultReducer.user.safeAreaInsetsData = getState().user.safeAreaInsetsDefault;
        appDefaultReducer.user.safeAreaInsetsDefault = getState().user.safeAreaInsetsDefault;
        try {
            appDefaultReducer.user.tutorialTab1 = getState().user.tutorialTab1;
            appDefaultReducer.user.tutorialTab2 = getState().user.tutorialTab2;
            appDefaultReducer.user.tutorialTab3 = getState().user.tutorialTab3;
            appDefaultReducer.user.tutorialTab4 = getState().user.tutorialTab4;
            appDefaultReducer.user.selectThemePopup = getState().user.selectThemePopup;
            appDefaultReducer.user.selectSingleTime = getState().user.selectSingleTime;
            appDefaultReducer.user.rememberPassword = getState().user.rememberPassword;
        }catch (e) {
        }
        appDefaultReducer.navigation = getState().navigation
        return dispatch({
            type: RESET_STORE,
            payload: appDefaultReducer
        });
    };
};

//set do not distub
export const setDoNotDisturbEnable = (doNotDisturb) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SET_DO_NOT_DISTURB,
            payload: doNotDisturb
        });
    };
};

export const sendNotificationRemote = (message, type = '', idArray = []) => {
    // let otherParameters = {
    //     "heading": {en: 'sdsadasda'},
    //     "big_picture": "https://cdn.pixabay.com/photo/2017/09/16/16/09/sea-2755908_960_720.jpg",
    //     priority: 10
    // }

    let contents = {
        'en': message
    }

    let data = {
        "type": type
    }
    let otherParameters = {"ios_attachments" : {"big_picture" : "https://cdn.pixabay.com/photo/2017/09/16/16/09/sea-2755908_960_720.jpg"}};

    return (dispatch, getState) => {
        OneSignal.postNotification(contents, data, idArray, otherParameters);
    }
}

export const sendTagOneSignal = () => {

    return (dispatch, getState) => {
        try {
            let userId = getState().user.userDetails.id;
            if (userId && userId != 0) {
                userId = userId.toString();

                // OneSignal.getTags((receivedTags) => {4
                //     debugger
                //     alert(JSON.stringify(receivedTags));
                // })

                if (AppConstant.isIOS) {
                    //Send tag if permission enabled
                    OneSignal.getPermissionSubscriptionState((status) => {
                        if (status && status.notificationsEnabled) {
                            // Getting the tags from the server and use the received object
                            OneSignal.getTags((receivedTags) => {
                                // alert(JSON.stringify(receivedTags))
                                EventRegister.emit('playerIDUpdate', true);
                                try {
                                    if (receivedTags == null || receivedTags == undefined || Object.keys(receivedTags).length === 0 || (receivedTags.id && receivedTags.id !== userId)) {
                                        OneSignal.sendTag("id", userId);
                                    }
                                } catch (e) {
                                    if (__DEV__) {
                                        alert(e)
                                    }
                                }
                            });
                        }
                    });
                } else {
                    console.log("call----OneSignal.getTags((receivedTags)")

                    OneSignal.getTags((receivedTags) => {
                        EventRegister.emit('playerIDUpdate', true);
                        try {
                            if (receivedTags === null || receivedTags == undefined || (receivedTags.id && receivedTags.id !== userId)) {
                                OneSignal.sendTag("id", userId);
                            }
                            console.log(receivedTags);
                        } catch (e) {
                            if (__DEV__) {
                                alert(e)
                            }
                        }
                    });
                }
            }
        } catch (e) {
            if (__DEV__) {
                alert(e)
            }
        }
    };
}

// Localization
export const manageLocalization = (preferred_locale = null) => {
    return (dispatch, getState) => {
        let currentDetails = getState().user.userDetails;
        let userDetails = cloneDeep(currentDetails);
        if (currentDetails && currentDetails.id !== 0) {
            let userLanguage = "en";
            let currentLocale = RNLocalize.getLocales();
            if (currentLocale.length > 0 && currentLocale[0].languageCode) {
                userLanguage = currentLocale[0].languageCode;
            }
            let preferredLocale = preferred_locale;
            if (preferredLocale) {
                preferredLocale = preferred_locale.dbValue || "en";
            } else {
                preferredLocale = AppConstant.appLocalization.includes(userLanguage) && userLanguage || "en";
            }
            // if(preferredLocale === 'zh' && currentLocale[0].languageTag.includes('zh-Hans')){
            if (preferredLocale === 'zh') {
                preferredLocale = 'zh-Hans';
            }
            userDetails.device_locale = userLanguage;
            userDetails.preferred_locale = preferredLocale;
            if (JSON.stringify(currentDetails) !== JSON.stringify(userDetails)) {
                return dispatch(updateUserDetail({
                    device_locale: userLanguage,
                    preferred_locale: preferredLocale
                }, true));
            }
        }
    }
}

//Global error handling
export const apiErrorHandler = (error) => {
    return (dispatch, getState) => {
        console.log("-----------Error-----------");
        console.log(error);
        if (__DEV__) {
            if (error) {
                alert(JSON.stringify(error))
            }
        }
        if (error && typeof error === 'object' && error.message && error.message == AppConstant.cancelTokenError) {
            return Promise.reject(false);
        }
        if (error && typeof error === 'object' && error.response) {
            if (error.response && error.response.status) {
                let errorCode = error.response.status;
                // if(error && error.response && error.response.status){
                //     if(error.response.data && error.response.data.errors && error.response.data.errors.length > 0 && error.response.data.errors[0]){
                //         messageFroServer = error.response.data.errors[0].toString();
                //     }
                // }
                switch (errorCode) {
                    case 401:
                        EventRegister.emit('RedirectToLogin', 'logout');
                        return Promise.reject(false);
                    case 403:
                        break;
                    case 429:
                    case 422:
                        if (error.response.data && error.response.data.errors) {
                            let errObj = error.response.data.errors;
                            if (Object.keys(errObj).length > 0) {
                                let messages = Object.values(errObj);
                                if (messages.length > 0) {
                                    let alertMessage = messages.join('\n')
                                    showAPICallError({
                                        title: "Uh oh",
                                        message: alertMessage + "(Error " + errorCode + ")",
                                        leftBtn: "OK"
                                    });
                                    return Promise.reject(error);
                                }
                            }
                        }
                        break;
                    case 500:
                    case 501:
                    case 502:
                    case 503:
                    case 504:
                    case 505:
                    case 506:
                    case 507:
                    case 508:
                    case 509:
                    case 510:
                    case 520:
                    case 521:
                    case 522:
                    case 523:
                    case 524:
                    case 525:
                    case 526:
                    case 527:
                    case 530:
                        showAPICallError({
                            title: strLocale("Uh oh"),
                            message: strLocale("We are fixing an issue with our server", {errorCode}),
                            leftBtn: strLocale("OK")
                        });
                        return Promise.reject(error);
                    default:
                        showAPICallError({
                            title: strLocale("Uh oh"),
                            message: strLocale("We are fixing an issue with our server", {errorCode}),
                            leftBtn: strLocale("OK")
                        });
                        return Promise.reject(error);
                }
            }
        } else {
            return checkForRechability().then(resStatus => {
                if (resStatus === AppConstant.NOT_REACHABLE_BACKEND) {
                    backendNotReachable();
                    return Promise.reject(error);
                }
            }).catch(errStatus => {
                if (errStatus === AppConstant.NOT_REACHABLE) {
                    if (getState().user.isConnected) {
                        // showServerNotReachable();
                    } else {
                        debugger
                        // showNoInternetAlert();
                    }
                }
                return Promise.reject(error);
            })
        }
        return Promise.reject(error);
    };
};

//Call Failed apis
export const callBackgroundFailAPI = (apiCall) => {
    return (dispatch, getState) => {
        let data = {};
        apiCall.map(res => {
            data = Object.assign({}, data, res.data);
        });
        let finalObj = getValidMetadata(data);
        let call = apiCall[0];
        return CallApi(call.url, call.type, finalObj, call.header)
            .then((response) => {
                // return (dispatch(getAllMetaData()))
            })
            .catch((error) => {
                //Failed
            })
    };
};

export const visibleProfessionalUser = (visible = false) => {
    return (dispatch, getState) => {
        dispatch({
            type: PROFESSIONAL_USER_VISIBLE,
            payload: visible
        });
        return Promise.resolve(true);
    };
};

export const updateUserProfile = (key, updateObject) => async (dispatch) => {

    return new Promise((resolve, reject) => {
        const path = `beefup/user/${key}`;
        const db = database().ref(path);

        db.update(cloneDeep(updateObject)).then(responseData => {
            resolve(true)
        }).catch(err => {
            resolve(true)
        })
    })

}

export const deleteUser = (UserId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = `beefup/user/${UserId}`;
        const db = database().ref(ref);

        db.remove()
            .then(() => {
                resolve(true)
            })
            .catch(error => {
                resolve(false)
            })
    })
};

export const forgotPassword = (email, password) => {
    return (dispatch, getState) => {
        dispatch({
            type: START_LOADING,
            payload: true,
        });

        return CallApi(`http://www.vedantinfoways.com/Mailer/sendmail.php?email=${email}&password=${password}`, 'post', {}, {})
            .then((response) => {
                return Promise.resolve(true);
            })
            .catch((error) => {
                return Promise.reject(true);
            })
    };
};

export const getUserSubDetail = (userId) => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/user/${userId}/`)
        ref.once('value', function (snapshot) {
            if (snapshot.val() !== null) {
                 resolve(snapshot.val())
            }
        }, (err) => {
            return Promise.resolve('');
        })
    })
}

export const manageData = (pornData) => {
    pornData = pornData["porn-days"];
    let arrN_NO = [], arrN_YES = [], arrN = [], midnight_of_last_checkup_at = false;
    let full_array = [];
    if (pornData && pornData.data){
        full_array = cloneDeep(pornData.data);
    }
    let todayDate = moment().format("YYYY-MM-DD");
    let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let remove_futureDate_array = [];

    full_array.map(obj => {
        // if(new Date(obj.occurred_at) <= new Date()){
        if (moment(obj.occurred_at, 'YYYY-MM-DD').toDate() <= new Date()) {
            remove_futureDate_array.push(obj)
        }
    })
    arrN_YES = filter(remove_futureDate_array, {is_relapse: false, is_resolved: true});
    arrN_NO = filter(remove_futureDate_array, {is_relapse: true, is_resolved: true});

    let arrPornFreeObj = filter(remove_futureDate_array, {is_relapse: false, is_resolved: false});

    arrPornFreeObj.forEach(obj => {
        if (obj.occurred_at !== todayDate) {
            obj.is_resolved = true;
            arrN_YES.push(obj);
        }
    })

    arrN_YES.sort(function (a, b) {
        return new Date(a.occurred_at) - new Date(b.occurred_at);
    });

    arrN_NO.sort(function (a, b) {
        return new Date(a.occurred_at) - new Date(b.occurred_at);
    });

    arrN_YES = arrN_YES.map(a => a.occurred_at);

    let i = 1, current_clean_streak_p = 0, streakarrayp = [];
    if (find(remove_futureDate_array, {
        occurred_at: todayDate,
        is_resolved: true,
        is_relapse: true
    }) !== undefined) {
        i = 0
    }
    while (true) {
        let res = arrN_YES.indexOf(moment(moment().subtract(i, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD').format('YYYY-MM-DD'));
        if (res != -1) {
            current_clean_streak_p++;
            i++;
        } else break;
    }

    let isPopUpRelapse = false, isPopupCongratulation = false;
    if (current_clean_streak_p === 0){
        // if (arrN_YES)
            if (find(arrN_YES, {occurred_at: todayDate}) === undefined &&
                find(arrN_YES, {occurred_at: yesterdayDate}) === undefined){
                isPopUpRelapse = true;
            }
    }

    let best_streak_p = 0, counterp = 0;
    //Best Streak
    let ii = 1;
    arrN_YES.map((obj) => {
        let a = moment(obj).toDate();
        let dayafter = moment(a).add(1, 'days').toDate();
        let res = arrN_YES.indexOf(moment(dayafter).format('YYYY-MM-DD'));
        if (res != -1) {
            counterp++;
            ii++;
        } else {
            streakarrayp.push(counterp + 1);
            ii = 1;
            counterp = 0;
        }
    });
    if (streakarrayp.length > 0) {
        best_streak_p = streakarrayp.reduce(function (previous, current) {
            return previous > current ? previous : current
        });
    }
    //END Best Streak calculation

    let isCongratulation = false;
    if (AppConstant.userGoals2.indexOf(current_clean_streak_p) >= 0){
        isCongratulation = true;
    }

    return {
        totalFree: arrN_YES,
        totalRelapce: arrN_NO,
        current_Streak: current_clean_streak_p || 0,
        best_Streak: best_streak_p || 0,
        isPopUpRelapse: isPopUpRelapse,
        isCongratulation: isCongratulation
    }
}

//Manage checkup popup
export const manageTutorialPopUp = (type) => async (dispatch, getState) => {
    return dispatch({
        type: SHOW_TUTORIAL_POPUP,
        payload: type
    });
};

//Manage checkup popup
export const manageNotificationToday = (type) => async (dispatch, getState) => {
    debugger
    return dispatch({
        type: MANAGE_NOTIFICATION,
        payload: type
    });
};

export const manageNotificationRewring = (type) => async (dispatch, getState) => {
    debugger
    return dispatch({
        type: MANAGE_REWIRINGPROGRESS,
        payload: type
    });
};

export const manageNotificationStrek = (type) => async (dispatch, getState) => {
    debugger
    return dispatch({
        type: MANAGE_STREKPROGRESS,
        payload: type
    });
};

export const manageNotificationLevel = (type) => async (dispatch, getState) => {
    debugger
    return dispatch({
        type: MANAGE_LEVELPROGRESS,
        payload: type
    });
};

export const manageNotificationAward = (type) => async (dispatch, getState) => {
    debugger
    return dispatch({
        type: MANAGE_AWARDPROGRESS,
        payload: type
    });
};

export const updateRandomDateChange = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_RANDOMVARIBLE,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const rateYourDay3Update = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: RATE_YOURDAY_3,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const rateYourDay7Update = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: RATE_YOURDAY_7,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const getCurrentTimeZone = (isFromLogin = false) => {
    return (dispatch, getState) => {
        return CallApi2('', 'get', {}, {})
            .then((response) => {
                let date = "";

                if (response && response.utc_datetime){
                    date = response.utc_datetime;
                    dispatch({
                        type: SERVER_DATE,
                        payload: date
                    });
                }else{
                    dispatch({
                        type: SERVER_DATE,
                        payload: ''
                    });
                }

                return Promise.resolve(true);
            })
            .catch((error) => {
                dispatch({
                    type: SERVER_DATE,
                    payload: ''
                });
                return Promise.resolve(true);
            })
    };
};


export const tutorialUpdateTab1 = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: TUTORIAL_TAB1,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const tutorialUpdateTab2 = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: TUTORIAL_TAB2,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const tutorialUpdateTab3 = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: TUTORIAL_TAB3,
            payload: value
        });
        return Promise.resolve(true);
    };
};


export const tutorialUpdateTab4 = (value= '') => {
    return (dispatch, getState) => {
        dispatch({
            type: TUTORIAL_TAB4,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const fireChatNotification = (myUserDetails, userDetails, message, type, chatId) => async (dispatch) => {
    if (userDetails) {
        const db = database().ref(`/apps/${userDetails.appId}/users/${userDetails.userId}/notification/`);
        const id = db.push().key
        const path = database().ref(`/apps/${userDetails.appId}/users/${userDetails.userId}/notification/${id}`);

        // if ((userDetails.setting_notification && userDetails.setting_notification.chat_notification === true)
        //     || !userDetails.setting_notification) {
        //
        //     if (userDetails.device_token) {
        //         const user = {};
        //         user['appId'] = userDetails.appId
        //         user['userId'] = userDetails.userId
        //         user['device_token'] = userDetails.device_token
        //         user['name'] = userDetails.name
        //         user['surname'] = userDetails.surname
        //         user['avatar_id'] = userDetails.avatar_id
        //
        //         return new Promise((resolve, reject) => {
        //             return fetch('https://fcm.googleapis.com/fcm/send', {
        //                 method: 'POST',
        //                 headers: {
        //                     Accept: 'application/json',
        //                     'Content-Type': 'application/json',
        //                     'Authorization': 'key=AAAA7rTJ7Qs:APA91bGFy6yWMjaqJYpU9c7YP7cATN6kxIVWvLpG-gFoKttBy8GvpO48zFWhQ70lFaEwbw0cXW0l3tIqozQVYQtotLGqfvb-aVCkcDPv1xeW21HtfjelJjAfLZtZVY1G17K_3kOu1MiA'
        //                 },
        //                 body: JSON.stringify({
        //                     'to': userDetails.device_token,
        //                     'notification': {
        //                         'body': message,
        //                         'title': 'Society Mobile'
        //                     },
        //                     'data': {
        //                         'notification_type': 'chat',
        //                         'chat_id': chatId,
        //                         'user': user
        //                     }
        //                 }),
        //             }).then((response) => response.json())
        //                 .then((responseJson) => {
        //                     // API response for notification
        //                     if (responseJson.success) {
        //                         notificationChatDataUpdate(userDetails, path, id, message, type, myUserDetails, chatId)
        //                     }
        //                     resolve(true)
        //                 })
        //                 .catch((error) => {
        //                     console.error(error);
        //                     resolve(false)
        //                 });
        //         })
        //     }
        // } else {
        //     notificationChatDataUpdate(userDetails, path, id, message, type, myUserDetails, chatId)
        // }
    }
};


export const getNotification = (pageNumber, key = "", userDetails, chatId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = database().ref('beefup/notification/' + `${chatId}`)
        console.log(`API Calling : ${'beefup/notification/' + `${chatId}`} EndKey=${key}`)

        if (key === "") {
            this.refValue = ref.orderByKey().limitToLast(pageSize)
        } else {
            this.refValue = ref.orderByKey().endAt(key).limitToLast(pageSize)
        }

        this.refValue.once('value', function (snapshot) {
            const feed = []

            if (snapshot.val() !== null) {

                Object.entries(snapshot.val()).map((data, index) => {

                    if (key && (key !== data[0]) || pageNumber === 1) {
                        const originalFeedObj = data[1]
                        originalFeedObj.id = data[0]
                        try {
                            // originalFeedObj.color = AppConstant.bestColor[Math.floor(Math.random() * (AppConstant.bestColor.length - 1))];
                        }catch (e) {
                        }
                        feed.push(originalFeedObj)
                    }
                })
                feed.sort((a, b) => {
                    return b.date - a.date
                })

                // end pagination
                if (feed.length + 1 !== pageSize && feed.length !== pageSize) {
                    resolve({
                        payload: feed,
                        listPage: pageNumber,
                        getFeedStatus: 'fail'
                    })
                } else {
                    resolve({
                        payload: feed,
                        listPage: pageNumber,
                        getFeedStatus: 'success'
                    })

                }
            } else {
                reject({
                    status: 100,
                    value: "nodata"
                })
            }
        }, (err) => {

            dispatch({
                type: NOTIFICATION_LIST,
                payload: []
            })

            return Promise.reject(false);
            //
            // reject({
            //     status: 400,
            //     error
            // })
        })
    });
};

export const editNotificationFeed = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: NOTIFICATION_LIST,
            payload: feed,
        });
        return Promise.resolve('');
    }
}

export const themeUpdate = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: SELECT_THEME,
            payload: feed,
        });
        return Promise.resolve('');
    }
}

export const themeUpdateSave = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: SELECT_THEME2,
            payload: feed,
        });
        return Promise.resolve('');
    }
}

export const filterStateChange = (value= false) => {
    return (dispatch, getState) => {
        dispatch({
            type: INTERNET_FILTERSTATE,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const updaterevenuecatID = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: REVENUECAYID,
            payload: detail
        });
    };
};

export const updateRemainingPassword = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: REMEMBERPASSWORD,
            payload: detail
        });
    };
};

export const updateUserDataForPurchase = (detail) => {
    return (dispatch, getState) => {
        return dispatch({
            type: PURCHASE_REGISTATION_DATA,
            payload: detail
        });
    };
};
