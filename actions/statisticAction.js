import {
    AsyncStorage,
} from 'react-native';
import {
    STATISTIC_J_DATE_ARRAY,
    STATISTIC_JOURNAL_DETAIL,
    STATISTIC_JOURNAL_DETAIL_EDIT,
    STATISTIC_P_CALCULATION,
    STATISTIC_M_CALCULATION,
    STATISTIC_OTHER_DETAIL,
    STATISTIC_ALL_BACKUP_EDIT,
    STATISTIC_ALL_BACKUP,
    META_DATA_BACKUP,
    SET_GOAL_DATA, SET_PORN_DAYS, SET_M_DAYS, STATISTIC_JOURNAL_TOTAL,
    MEDITATION_MINUTE, MEDITATION_M_CALCULATION, SET_USER_DETAIL
} from './types';
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import moment from 'moment';
import _, {find, filter, groupBy, indexOf, cloneDeep, remove, findIndex} from 'lodash';
import {getTeamChat} from './teamAction';
import {
    calculateImprovementByActivity,
    calculateMasturbationWhenIRelapse,
    calculatePornWhenIRelapse,
    calculatePornWhyIRelapse,
    calculateRewiringProgress,
    updateMetaData
} from './metadataActions';
import {setUpLocalNotificationAlerts, manageStreakAchievedPopup, apiErrorHandler} from './userActions';
import AppContant from '../helper/constant';
import {strLocale} from "locale";
// import {app} from "../helper/firebaseConfig";
import database from '@react-native-firebase/database';
const userGoals = AppContant.userGoals;
const userGoalsTitle = AppContant.userGoalsTitle;

const keys = ["progress_desensitation", "progress_hypofrontality", "progress_wisdom", "progress_dopamine_rewiring", "progress_stress_control",
    "relapse_porn_bored", "relapse_porn_stress", "relapse_porn_anxiety", "relapse_porn_tired", "relapse_porn_alone", "relapse_porn_pain",
    "relapse_porn_horny", "relapse_porn_morning", "relapse_porn_afternoon", "relapse_porn_evening", "relapse_porn_night", "relapse_masturbation_morning",
    "relapse_masturbation_afternoon", "relapse_masturbation_evening", "relapse_masturbation_night", "tempted_porn_morning", "tempted_porn_afternoon",
    "tempted_porn_evening", "tempted_porn_night", "tempted_masturbation_morning", "tempted_masturbation_afternoon", "tempted_masturbation_evening",
    "tempted_masturbation_night",
    "exercise_number_activity", "exercise_number_audio", "exercise_number_breathing", "exercise_number_choose",
    "exercise_number_emotion", "exercise_number_escape", "exercise_number_faith", "exercise_number_kegals", "exercise_number_learn",
    "exercise_number_letters", "exercise_number_meditation", "exercise_number_slideshow", "exercise_number_story", "exercise_number_stress_relief",
    "exercise_number_thought_control", "exercise_number_brain_training", "exercise_number_video", "exercise_number_visualization",
    "improvement_mind",
    "improvement_energy", "improvement_attraction", "improvement_sleep", "improvement_voice",
    "improvement_health", "improvement_confidence", "improvement_alive",
    "stressed_morning", "stressed_afternoon", "stressed_evening", "stressed_night", "registered_at", "last_checkup_at"];
const objDefaultMetaData = {};
keys.forEach((key) => objDefaultMetaData[key] = key.includes('exercise') ? 1 : 0);

function reverseObject(tmpObj) {
    let keys = Object.keys(tmpObj).reverse();
    let obj = {};
    keys.map(key => {
        obj[key] = tmpObj[key];
    });
    return obj;
}

export const getPornDaysNew = (isCallDelete = true, isCallJournal = true, reqIdentifier = null, valueData = null) => {
    return (dispatch, getState) => {

        if (valueData === null){
            dispatch({
                type: SET_PORN_DAYS,
                payload: {data: []},
            })
        }else {
            dispatch({
                type: SET_PORN_DAYS,
                payload: valueData["porn-days"],
            })
        }

        dispatch({
            type: MEDITATION_MINUTE,
            payload: valueData["meditation"] || {data: []},
        })

        dispatch(calculatePornDay(valueData["porn-days"], true));
        dispatch(calculateMeditation(valueData["meditation"], true));
        if (isCallDelete) {
            // dispatch(deleteFuturePornDates(response.data));
        }
        if (isCallJournal) {
            // return dispatch(getJournalDays());
        }
    };
};

export const addPornDays = (objPorn, pData = null, reqIdentifier = null, type = 1) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/porn-days/`);
            let arrData = {data: []}
            let boolValue = true;
            if (getState().user.userDetails['porn-days']) {
                arrData = getState().user.userDetails['porn-days'];
                boolValue = false;
            }
            objPorn.type = type
            arrData.data.push(objPorn)
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {

                debugger
                Promise.all([
                    dispatch(getPornDaysNew(false, true, null, arrData))
                ]).then(res => {
                    dispatch(calculatePornDay(arrData));
                });

                // setTimeout(() => {
                //     dispatch(calculatePornDay(arrData));
                // }, 100)
                resolve(boolValue)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

export const updatePornDay = (objPorn, pData = null, reqIdentifier = null, type = 1) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/porn-days/`);
            let arrData = getState().user.userDetails['porn-days']

            let selectedQue = find(arrData.data, {occurred_at: objPorn.occurred_at});
            let indexofQue = findIndex(arrData.data, selectedQue);

            if (objPorn.is_relapse === false) {
                objPorn.is_resolved = false
            } else {
                objPorn.is_resolved = true
            }

            objPorn.type = type
            arrData.data[indexofQue] = objPorn;
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {
                Promise.all([
                    dispatch(getPornDaysNew(false, true, null, arrData))
                ]).then(res => {
                    dispatch(calculatePornDay(arrData));
                });
                resolve(true)
            }).catch(err => {
                resolve(false)
            })
        })
    }
};

export const deletePornDay = (objPorn, pData = null, reqIdentifier = null) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/porn-days/`);
            let arrData = getState().user.userDetails['porn-days']

            let selectedQue = find(arrData.data, {occurred_at: objPorn.occurred_at});
            let indexofQue = findIndex(arrData.data, selectedQue);
            let indexofQue2 = arrData.data.findIndex(x => x.occurred_at === objPorn.occurred_at);

            let arryMain = cloneDeep(arrData.data);
            arryMain.splice(indexofQue, 1);
            arrData.data = cloneDeep(arryMain);
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {
                Promise.all([
                    dispatch(getPornDaysNew(false, true, null, arrData))
                ]).then(res => {
                    dispatch(calculatePornDay(arrData));
                });
                resolve(true)
            }).catch(err => {
                resolve(false)
            })
        })
    }
};

export const addPornDaysWelcomeBack = (arr) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/porn-days/`);
            let arrData = {data: []}
            let boolValue = true;
            if (getState().user.userDetails['porn-days']) {
                arrData = getState().user.userDetails['porn-days'];
                boolValue = false;
            }

            for (let i = 0; i < arr.length; i++){
                arrData.data.push(arr[i]);
            }
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {
                setTimeout(() => {
                    dispatch(calculatePornDay(arrData));
                }, 100)
                resolve(boolValue)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

//Resolve porn day entry
export const resolvePornDay = (pornObj, arrPornData, reqIdentifier = null) => {
    return (dispatch, getState) => {
        let pornData = arrPornData;
        let pornOldObj = find(pornData, {id: pornObj.id});
        let index = indexOf(pornData, pornOldObj);
        pornData[index].is_resolved = true;
        pornData[index].is_relapse = true;
        dispatch(calculatePornDay(pornData));
    }
};

//All Calculation
/*
export  const calculatePornDay = (pornData, isAPICall = false) =>{

    console.log("========Cal Porn Days==========");
    return (dispatch, getState) => {
        let arrN_NO = [],arrN_YES=[], arrN=[];
        let full_array = cloneDeep(pornData);
        let todayDate = moment().format("YYYY-MM-DD");
        //let yesterdayDate = moment().subtract(1,'days').format("YYYY-MM-DD");
        //let last_checkup_at = getState().metaData.metaData.last_checkup_at || "";
        let remove_futureDate_array = [];

        // if(last_checkup_at == todayDate || last_checkup_at == yesterdayDate) {
        //     remove_futureDate_array  = remove(full_array,item => (!moment(item.occurred_at).isSame(moment(), 'd'))
        //         ? moment(item.occurred_at).isBefore(moment(), "day"):true);
        // }else {
        //     remove_futureDate_array  = remove(full_array,item => (!moment(item.occurred_at)
        //         .isSame(moment().subtract(1, 'days'), 'd'))
        //         ? moment(item.occurred_at).isBefore(moment().subtract(1, 'days'), "day"):true);
        // }

        remove_futureDate_array  = remove(full_array,item => (!moment(item.occurred_at).isSame(moment(), 'd'))
            ? moment(item.occurred_at).isBefore(moment(), "day"):true);

        arrN_YES = filter(remove_futureDate_array,{ is_relapse: false, is_resolved: true});
        arrN_NO = filter(remove_futureDate_array,{ is_relapse: true, is_resolved: true});

        let arrPornFreeObj = filter(remove_futureDate_array,{ is_relapse: false, is_resolved: false});

        arrPornFreeObj.forEach(obj=>{
            if(obj.occurred_at !== todayDate) {
                obj.is_resolved = true;
                arrN_YES.push(obj);
            }
        })

        arrN_YES.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let aDAte = moment(a.occurred_at, 'YYYY-MM-DD').toDate();
            let bDAte = moment(b.occurred_at, 'YYYY-MM-DD').toDate();
            return new Date(aDAte) - new Date(bDAte);
        });

        let todayObject = find(arrN_YES, {occurred_at: todayDate});
        if(todayObject != undefined){
            let todayIndex = arrN_YES.indexOf(todayObject);
            arrN_YES.splice(todayIndex, 1);
        }

        arrN_NO.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let aDAte = moment(a.occurred_at, 'YYYY-MM-DD').toDate();
            let bDAte = moment(b.occurred_at, 'YYYY-MM-DD').toDate();
            return new Date(aDAte) - new Date(bDAte);
        });

        arrN = pornData;
        arrN_YES = arrN_YES.map(function(a) {return a.occurred_at;});
        arrN_NO = arrN_NO.map(function(a) {return a.occurred_at;});

        // PORN Calculation
        //Total Clean Days P
        let totalPCleanDays = arrN_YES.length;
        //END Clean Days P
        //current streak calculation
        let i = 1, current_clean_streak_p =0,streakarrayp=[],counterp=0, best_streak_p = 0;

        if(find(remove_futureDate_array,{occurred_at: todayDate, is_resolved: true}) !== undefined){
            console.log("take i = 0")
            i = 0
        }

        while (true){
            let res = arrN_YES.indexOf(moment(moment().subtract(i, 'days').
            format('YYYY-MM-DD'),'YYYY-MM-DD').format('YYYY-MM-DD'));
            if(res!=-1) {
                current_clean_streak_p++;
                i++;
            }else break;
        }

        //End current streak calculation
        // Best Streak calculation
        let ii = 1;
        arrN_YES.map((obj)=>{
            let a = moment(obj, 'YYYY-MM-DD').toDate();
            let dayafter = moment(a).add(1,'days').toDate();
            let res = arrN_YES.indexOf(moment(dayafter).format('YYYY-MM-DD'));
            if(res!=-1) {
                counterp++;
                ii++;
            }else {
                streakarrayp.push(counterp+1);
                ii=1;
                counterp=0;
            }
        });

        if(streakarrayp.length>0) {
            best_streak_p  = streakarrayp.reduce(function (previous, current) {
                return previous > current ? previous : current
            });
        }
        //END Best Streak calculation

        //clean days per year mapping blue chart on statistic
        let groupbyYear = groupBy(arrN_YES, function (el) {
            return (moment(el, 'YYYY-MM-DD').toDate().getFullYear());
        });

        let finalYearMonthMapP = {};
        let currentYear = moment().toDate().getFullYear();
        Object.keys(groupbyYear).map((year)=> {
            let temp = groupBy(groupbyYear[year], function (el) {
                return (moment(el, 'YYYY-MM-DD').toDate().getMonth());
            });
            let monthArr = [0,0,0,0,0,0,0,0,0,0,0,0];

            Object.keys(temp).map((month)=>{
                let totalDays = moment((parseInt(month)+1).toString()+"-"+year.toString(), 'M-YYYY').daysInMonth();
                monthArr[month] = parseInt((temp[month].length/totalDays)*100);

            });
            finalYearMonthMapP[year] = {
                isCurrentYear:(year==currentYear),
                hasPrev:(Object.keys(groupbyYear).indexOf((parseInt(year)-1).toString()) > -1 ),
                hasNext:(Object.keys(groupbyYear).indexOf((parseInt(year)+1).toString()) > -1 ),
                monthArr:monthArr
            };
        });
        let strCurrentYear = currentYear.toString();
        if((Object.keys(finalYearMonthMapP).indexOf(strCurrentYear)) < 0){
            let prev = (currentYear - 1).toString();
            if((Object.keys(finalYearMonthMapP).indexOf(prev)) >= 0){
                finalYearMonthMapP[prev].hasNext = true;
                finalYearMonthMapP[strCurrentYear] = {isCurrentYear: true, hasPrev: true, hasNext: false, monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]}
            }else{
                if(Object.keys(finalYearMonthMapP).length == 0){
                    finalYearMonthMapP[strCurrentYear] = {isCurrentYear: true, hasPrev: false, hasNext: false, monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]}
                }else{
                    Object.keys(finalYearMonthMapP).forEach(key=>{
                        finalYearMonthMapP[key].hasNext = true
                    });
                    finalYearMonthMapP[strCurrentYear] = {isCurrentYear: true, hasPrev: true, hasNext: false, monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]}
                }

            }
        }
        // END clean days per year mapping blue chart on statistic

        // START what day I relapsed

        let total = arrN_NO.length;
        let arrOfWeekDays=[0,0,0,0,0,0,0];
        arrN_NO.map((obj)=>{
            let day = moment(obj,'YYYY-MM-DD').toDate().getDay();
            let value = arrOfWeekDays[day];
            arrOfWeekDays[day]=(value+1);
        });

        let newArrOfWeekDaysP = [];
        arrOfWeekDays.map((obj)=> {
            let a = parseInt((obj/total)*100);
            if(isNaN(a)){
                newArrOfWeekDaysP.push(0);
            }else{
                newArrOfWeekDaysP.push(a);
            }
        });
        newArrOfWeekDaysP.push(newArrOfWeekDaysP.shift());
        // END what day I relapsed

        //End PORN Calculation

        console.log("------------Val-------"+current_clean_streak_p)

        //For Streak goal popup
        if(current_clean_streak_p === 0) {
            dispatch(manageStreakAchievedPopup({
                isShow: false,
                achivedGoal: 0,
                displayDate: getState().user.showStreakGoalPopUp.displayDate || "",
                whileGoal: getState().user.showStreakGoalPopUp.whileGoal || 0,
                inProcess: false
            }));
        }
        return Promise.all([
            dispatch({
                type: STATISTIC_P_CALCULATION,
                payload: {
                    p_array: arrN,
                    p_no_array: arrN_NO,
                    p_yes_array: arrN_YES,
                    clean_p_days_per_month: finalYearMonthMapP,
                    relapsed_p_days_per_weekdays: newArrOfWeekDaysP,
                    total_p_clean_days: totalPCleanDays,
                    current_p_clean_days: current_clean_streak_p,
                    best_p_clean_days: best_streak_p
                }
            })
        ]).then(res => {
            dispatch(goalCalculation());
            if(!isAPICall){
                dispatch(calculateJournal(getState().statistic.j_array));
            }
        });

        //});

    }
};

export  const calculateMosturbationDay = (masturbationData) =>{
    return (dispatch, getState) => {
        let arrM=[],arrM_NO=[],arrM_YES=[];
        let full_array = cloneDeep(masturbationData);
        let yesterdayDate = moment().subtract(1,'days').format("YYYY-MM-DD");
        let last_checkup_at = (getState().metaData.metaData.last_checkup_at != undefined) &&
            getState().metaData.metaData.last_checkup_at || "";
        let todayDate = moment().format("YYYY-MM-DD");

        let remove_futureDate_array = [];
        remove_futureDate_array  = remove(full_array,item => (!moment(item.occurred_at).isSame(moment(), 'd'))
            ? moment(item.occurred_at).isBefore(moment(), "day"):true);

        arrM_YES = filter(remove_futureDate_array,{ is_relapse: false, is_resolved: true});
        arrM_NO = filter(remove_futureDate_array,{ is_relapse: true, is_resolved: true});

        arrM_NO.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let aDAte = moment(a.occurred_at, 'YYYY-MM-DD').toDate();
            let bDAte = moment(b.occurred_at, 'YYYY-MM-DD').toDate();
            return new Date(aDAte) - new Date(bDAte);
        });

        arrM_YES.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let aDAte = moment(a.occurred_at, 'YYYY-MM-DD').toDate();
            let bDAte = moment(b.occurred_at, 'YYYY-MM-DD').toDate();
            return new Date(aDAte) - new Date(bDAte);
        });

        arrM_YES = arrM_YES.map(function(a) {return a.occurred_at;});
        arrM_NO = arrM_NO.map(function(a) {return a.occurred_at;});

        arrM = masturbationData;

        //Mosturbation calculation
        //Total Clean Days M
        let totalMCleanDays=arrM_YES.length;
        //END Clean Days M
        //M current streak calculation

        let i= 1, current_clean_streak_m = 0, streakarraym=[],counterm=0;
        if(find(remove_futureDate_array,{occurred_at: todayDate, is_resolved: true }) !== undefined){
            i = 0
        }
        while (true){
            let res = arrM_YES.indexOf(moment(moment().subtract(i, 'days').format('YYYY-MM-DD'),'YYYY-MM-DD').format('YYYY-MM-DD'));
            if(res!==-1) {
                current_clean_streak_m++;
                i++;
            }else break;
        }
        //End current streak calculation

        // Best Streak calculation
        let best_streak_m = 0;

        let ij = 1;
        arrM_YES.map((obj)=>{

            let a = moment(obj, 'YYYY-MM-DD').toDate();
            let dayafter = moment(a).add(1,'days').toDate();
            let res = arrM_YES.indexOf(moment(dayafter).format('YYYY-MM-DD'));
            if(res!=-1) {
                counterm++;
                ij++;
            }else {
                streakarraym.push(counterm+1);
                ij=1;
                counterm=0;
            }
        });

        if(streakarraym.length>0) {
            best_streak_m = streakarraym.reduce(function (previous, current) {
                return previous > current ? previous : current
            });
        }
        //END Best Streak calculation

        //M clean days per year mapping blue chart on statistic

        let groupbyYearM = groupBy(arrM_YES, function (el) {
            return (moment(el, 'YYYY-MM-DD').toDate().getFullYear());
        });
        let currentYear = moment().toDate().getFullYear();
        let finalYearMonthMapM = {};
        Object.keys(groupbyYearM).map((year)=> {
            let temp = groupBy(groupbyYearM[year], function (el) {
                return (moment(el, 'YYYY-MM-DD').toDate().getMonth());
            });
            let monthArrM = [0,0,0,0,0,0,0,0,0,0,0,0];

            Object.keys(temp).map((month)=>{
                let totalDays = moment((parseInt(month)+1).toString()+"-"+year.toString(), 'MM-YYYY').daysInMonth();
                monthArrM[month] = parseInt((temp[month].length/totalDays)*100);

            });
            finalYearMonthMapM[year] = {
                isCurrentYear:(year==currentYear),
                hasPrev:(Object.keys(groupbyYearM).indexOf((parseInt(year)-1).toString()) > -1 ),
                hasNext:(Object.keys(groupbyYearM).indexOf((parseInt(year)+1).toString()) > -1 ),
                monthArr:monthArrM
            };
        });
        let strCurrentYear = currentYear.toString();
        if((Object.keys(finalYearMonthMapM).indexOf(strCurrentYear)) < 0){
            let prev = (currentYear - 1).toString();
            if((Object.keys(finalYearMonthMapM).indexOf(prev)) >= 0) {
                finalYearMonthMapM[prev].hasNext = true;
                finalYearMonthMapM[strCurrentYear] = {isCurrentYear: true, hasPrev: true, hasNext: false,
                    monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]}
            }else{
                if(Object.keys(finalYearMonthMapM).length == 0){
                    finalYearMonthMapM[strCurrentYear] = {isCurrentYear: true, hasPrev: false, hasNext: false,
                        monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]};
                }else{
                    Object.keys(finalYearMonthMapM).forEach(key=>{
                        finalYearMonthMapM[key].hasNext = true
                    });
                    finalYearMonthMapM[strCurrentYear] = {isCurrentYear: true, hasPrev: true, hasNext: false, monthArr: [0,0,0,0,0,0,0,0,0,0,0,0]}
                }


            }
        }

        //M END clean days per year mapping blue chart on statistic


        //M START what day I relapsed
        let totalM = arrM_NO.length;
        let arrOfWeekDaysM=[0,0,0,0,0,0,0];
        arrM_NO.map((obj)=>{
            let day = moment(obj,'YYYY-MM-DD').toDate().getDay();
            let value = arrOfWeekDaysM[day];
            arrOfWeekDaysM[day]=(value+1);
        });
        let newArrOfWeekDaysM = [];
        arrOfWeekDaysM.map((obj)=> {
            let a = parseInt((obj/totalM)*100);
            if(isNaN(a)){
                newArrOfWeekDaysM.push(0);
            }else{
                newArrOfWeekDaysM.push(a);
            }
        });
        newArrOfWeekDaysM.push(newArrOfWeekDaysM.shift());
        //M END what day I relapsed
        //End Mosturbation calculation
        dispatch({
            type: STATISTIC_M_CALCULATION,
            payload: {
                m_array: arrM,
                m_no_array: arrM_NO,
                m_yes_array: arrM_YES,
                clean_m_days_per_month: finalYearMonthMapM,
                relapsed_m_days_per_weekdays: newArrOfWeekDaysM,
                total_m_clean_days: totalMCleanDays,
                current_m_clean_days: current_clean_streak_m,
                best_m_clean_days: best_streak_m
            }
        });
        return Promise.resolve(true);
        //});
    }
};
*/

export const calculateCurrentWhileCheckup = (isYesterday) => {
    return (dispatch, getState) => {
        try {
            let arrN_YES = [];
            arrN_YES = getState().statistic.pornDetail.p_yes_array;
            let todayDate = moment().format("YYYY-MM-DD");
            let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
            if (!isYesterday && !arrN_YES.includes(todayDate)) {
                arrN_YES = [...arrN_YES, todayDate];
            }
            if (isYesterday && !arrN_YES.includes(yesterdayDate)) {
                arrN_YES = [...arrN_YES, yesterdayDate];
            }
            arrN_YES.sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
            arrN_YES.reverse();
            let startIndex = 1;
            let i = 0, current_clean_streak_p = 0;
            if (isYesterday) {
                i = 1;
                startIndex = arrN_YES.indexOf(yesterdayDate);
            } else {
                startIndex = arrN_YES.indexOf(todayDate);
            }
            if (startIndex > 0) {
                arrN_YES = arrN_YES.slice(startIndex, arrN_YES.length);
            }
            while (true) {
                let res = arrN_YES.indexOf(moment(moment().subtract(i, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD').format('YYYY-MM-DD'));
                if (res != -1) {
                    current_clean_streak_p++;
                    i++;
                } else break;
            }
            return Promise.resolve(current_clean_streak_p);
        } catch (e) {
            if (__DEV__) {
                alert(e);
            }
        }
    }
};

export const getCurrentClean = () => {
    return (dispatch, getState) => {
        try {
            //dispatch(calculatePornDay(getState().statistic.pornDetail.p_array));
            dispatch(calculateRewiringProgress());
            let arrN_YES = [];
            let full_array = cloneDeep(getState().statistic.pornDetail.p_array && getState().statistic.pornDetail.p_array.data || {data: []});
            let todayDate = moment().format("YYYY-MM-DD");
            let remove_futureDate_array = [];

            full_array.map(obj => {
                if (moment(obj.occurred_at, 'YYYY-MM-DD').toDate() <= new Date()) {
                    remove_futureDate_array.push(obj)
                }
            })
            arrN_YES = filter(remove_futureDate_array, {is_relapse: false, is_resolved: true});

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

            let todayObject = find(arrN_YES, {occurred_at: todayDate});
            if (todayObject != undefined) {
                let todayIndex = arrN_YES.indexOf(todayObject);
                arrN_YES.splice(todayIndex, 1);
            }
            arrN_YES = arrN_YES.map(a => a.occurred_at);
            // PORN Calculation
            //END Clean Days P
            //current streak calculation
            let i = 1, current_clean_streak_p = 0;
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
            let goal = 1;
            if (current_clean_streak_p < 1) {
                goal = 1;
            } else if (current_clean_streak_p < 3) {
                goal = 3;
            } else if (current_clean_streak_p < 7) {
                goal = 7;
            } else if (current_clean_streak_p < 14) {
                goal = 14;
            } else if (current_clean_streak_p < 30) {
                goal = 30;
            } else if (current_clean_streak_p < 90) {
                goal = 90;
            } else if (current_clean_streak_p < 180) {
                goal = 180;
            } else if (current_clean_streak_p < 365) {
                goal = 365;
            } else if (current_clean_streak_p < 400) {
                goal = 400;
            } else if (current_clean_streak_p < 500) {
                goal = 500;
            } else if (current_clean_streak_p < 600) {
                goal = 600;
            } else if (current_clean_streak_p < 700) {
                goal = 700;
            } else if (current_clean_streak_p < 730) {
                goal = 730;
            } else if (current_clean_streak_p < 800) {
                goal = 800;
            } else if (current_clean_streak_p < 900) {
                goal = 900;
            } else {
                goal = 1000;
            }
            const pornDetail = cloneDeep(getState().statistic.pornDetail);
            pornDetail.current_p_clean_days = current_clean_streak_p;
            dispatch({
                type: STATISTIC_P_CALCULATION,
                payload: pornDetail
            })
            dispatch(goalCalculation(false, current_clean_streak_p));
            return Promise.resolve({cleanDays: current_clean_streak_p, goal});

        } catch (e) {
            return Promise.reject(e);
        }
    }
};

export const calculatePornDay = (pornData, isAPICall = false) => {
    return (dispatch, getState) => {
        try {
            let arrN_NO = [], arrN_YES = [], arrN = [];
            let full_array = cloneDeep(pornData.data);
            let todayDate = moment().format("YYYY-MM-DD");
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

            let todayObject = find(arrN_YES, {occurred_at: todayDate});

            // If is_resolved false for today -> remove that
            if (todayObject != undefined) {
                let todayIndex = arrN_YES.indexOf(todayObject);
                arrN_YES.splice(todayIndex, 1);
            }

            arrN = pornData;
            arrN_YES = arrN_YES.map(a => a.occurred_at);
            arrN_NO = arrN_NO.map(a => a.occurred_at);

            // PORN Calculation
            //Total Clean Days P
            let totalPCleanDays = arrN_YES.length;
            let totalPC2leanDays = arrN_NO.length;
            //END Clean Days P

            //current streak calculation
            let i = 1, current_clean_streak_p = 0, streakarrayp = [], counterp = 0, best_streak_p = 0;
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

            // while (true){
            //     let prevDate = new Date().subDays(i).toISOString().substring(0,10);
            //     let res = arrN_YES.indexOf(prevDate);
            //     if(res!=-1) {
            //         current_clean_streak_p++;
            //         i++;
            //     }else break;
            // }

            //End current streak calculation
            // Best Streak calculation
            // let ii = 1;
            // arrN_YES.map((obj)=>{
            //     let a = moment(obj, 'YYYY-MM-DD').toDate();
            //     let dayafter = moment(a).add(1,'days').toDate();
            //     let res = arrN_YES.indexOf(moment(dayafter).format('YYYY-MM-DD'));
            //     if(res!=-1) {
            //         counterp++;
            //         ii++;
            //     }else {
            //         streakarrayp.push(counterp+1);
            //         ii=1;
            //         counterp=0;
            //     }
            // });

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

            //clean days per year mapping blue chart on statistic
            let groupbyYear = groupBy(arrN_YES, function (el) {
                return (moment(el).toDate().getFullYear());
            });

            let finalYearMonthMapP = {};
            let currentYear = new Date().getFullYear()
            let currentMonth = new Date().getMonth()

            Object.keys(groupbyYear).map((year) => {
                let temp = groupBy(groupbyYear[year], function (el) {
                    return (moment(el).toDate().getMonth());
                });
                let monthArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let monthlyObj = {};
                Object.keys(temp).map((month) => {
                    let totalDays = moment((parseInt(month) + 1).toString() + "-" + year.toString(), 'M-YYYY').daysInMonth();
                    monthArr[month] = parseInt((temp[month].length / totalDays) * 100);
                    monthlyObj[month] = {
                        totalClean: temp[month].length,
                        totalDays: totalDays,
                        percentage: parseInt((temp[month].length / totalDays) * 100),
                        isAchieved: (parseInt((temp[month].length / totalDays) * 100) == 100),
                        isCurrentMonth: (year == currentYear && month == currentMonth),
                        month: month,
                    }
                });
                finalYearMonthMapP[year] = {
                    isCurrentYear: (year == currentYear),
                    hasPrev: (Object.keys(groupbyYear).indexOf((parseInt(year) - 1).toString()) > -1),
                    hasNext: (Object.keys(groupbyYear).indexOf((parseInt(year) + 1).toString()) > -1),
                    monthArr: monthArr,
                    monthlyProgress: monthlyObj
                };
            });
            let strCurrentYear = currentYear.toString();
            if ((Object.keys(finalYearMonthMapP).indexOf(strCurrentYear)) < 0) {
                let prev = (currentYear - 1).toString();
                if ((Object.keys(finalYearMonthMapP).indexOf(prev)) >= 0) {
                    finalYearMonthMapP[prev].hasNext = true;
                    finalYearMonthMapP[strCurrentYear] = {
                        isCurrentYear: true, hasPrev: true, hasNext: false,
                        monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                } else {
                    if (Object.keys(finalYearMonthMapP).length == 0) {
                        finalYearMonthMapP[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: false, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    } else {
                        Object.keys(finalYearMonthMapP).forEach(key => {
                            finalYearMonthMapP[key].hasNext = true
                        });
                        finalYearMonthMapP[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: true, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    }
                }
            }

            let groupbyYear2 = groupBy(arrN_NO, function (el) {
                return (moment(el).toDate().getFullYear());
            });

            let finalYearMonthMapP2 = {};

            Object.keys(groupbyYear2).map((year) => {
                let temp = groupBy(groupbyYear2[year], function (el) {
                    return (moment(el).toDate().getMonth());
                });
                let monthArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let monthlyObj = {};
                Object.keys(temp).map((month) => {
                    let totalDays = moment((parseInt(month) + 1).toString() + "-" + year.toString(), 'M-YYYY').daysInMonth();
                    monthArr[month] = parseInt((temp[month].length / totalDays) * 100);
                    monthlyObj[month] = {
                        totalClean: temp[month].length,
                        totalDays: totalDays,
                        percentage: parseInt((temp[month].length / totalDays) * 100),
                        isAchieved: (parseInt((temp[month].length / totalDays) * 100) == 100),
                        isCurrentMonth: (year == currentYear && month == currentMonth),
                        month: month,
                    }
                });
                finalYearMonthMapP2[year] = {
                    isCurrentYear: (year == currentYear),
                    hasPrev: (Object.keys(groupbyYear2).indexOf((parseInt(year) - 1).toString()) > -1),
                    hasNext: (Object.keys(groupbyYear2).indexOf((parseInt(year) + 1).toString()) > -1),
                    monthArr: monthArr,
                    monthlyProgress: monthlyObj
                };
            });
            if ((Object.keys(finalYearMonthMapP2).indexOf(strCurrentYear)) < 0) {
                let prev = (currentYear - 1).toString();
                if ((Object.keys(finalYearMonthMapP2).indexOf(prev)) >= 0) {
                    finalYearMonthMapP2[prev].hasNext = true;
                    finalYearMonthMapP2[strCurrentYear] = {
                        isCurrentYear: true, hasPrev: true, hasNext: false,
                        monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                } else {
                    if (Object.keys(finalYearMonthMapP2).length == 0) {
                        finalYearMonthMapP2[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: false, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    } else {
                        Object.keys(finalYearMonthMapP2).forEach(key => {
                            finalYearMonthMapP2[key].hasNext = true
                        });
                        finalYearMonthMapP2[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: true, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    }
                }
            }

            // END clean days per year mapping blue chart on statistic

            // START what day I relapsed

            let total = arrN_NO.length;
            let arrOfWeekDays = [0, 0, 0, 0, 0, 0, 0];
            arrN_NO.map((obj) => {
                let day = moment(obj).toDate().getDay();
                let value = arrOfWeekDays[day];
                arrOfWeekDays[day] = (value + 1);
            });

            let newArrOfWeekDaysP = [];
            arrOfWeekDays.map((obj) => {
                let a = parseInt((obj / total) * 100);
                if (isNaN(a)) {
                    newArrOfWeekDaysP.push(0);
                } else {
                    newArrOfWeekDaysP.push(a);
                }
            });
            newArrOfWeekDaysP.push(newArrOfWeekDaysP.shift());
            // END what day I relapsed

            //End PORN Calculation

            //For Streak goal popup
            if (current_clean_streak_p === 0) {
                dispatch(manageStreakAchievedPopup({
                    isShow: false,
                    achivedGoal: 0,
                    displayDate: getState().user.showStreakGoalPopUp.displayDate || "",
                    whileGoal: getState().user.showStreakGoalPopUp.whileGoal || 0,
                    inProcess: false
                }));
            }
            Promise.all([
                dispatch({
                    type: STATISTIC_P_CALCULATION,
                    payload: {
                        p_array: arrN || {data: []},
                        p_no_array: arrN_NO || [],
                        p_yes_array: arrN_YES || [],
                        clean_p_days_per_month: finalYearMonthMapP || {},
                        clean_p_days_per_month_relapsed: finalYearMonthMapP2 || {},
                        relapsed_p_days_per_weekdays: newArrOfWeekDaysP || [],
                        total_p_clean_days: totalPCleanDays || 0,
                        total_p_setBack_days: totalPC2leanDays || 0,
                        current_p_clean_days: current_clean_streak_p || 0,
                        best_p_clean_days: best_streak_p || 0,
                        total_vicory_rate: arrN_YES && ((arrN_YES.length * 100) / (arrN_YES.length + arrN_NO.length)) || 0
                    }
                })
            ]).then(res => {
                dispatch(goalCalculation(false, current_clean_streak_p));
                if (!isAPICall) {
                    dispatch(calculateJournal(getState().statistic.j_array));
                }
            });
        } catch (e) {
            console.log(e);
            if (pornData === undefined) {
                Promise.all([
                    dispatch({
                        type: STATISTIC_P_CALCULATION,
                        payload: {
                            p_array: {data: []},
                            p_no_array: [],
                            p_yes_array: [],
                            clean_p_days_per_month: {},
                            clean_p_days_per_month_relapsed: {},
                            relapsed_p_days_per_weekdays: [],
                            total_p_clean_days: 0,
                            total_p_setBack_days: 0,
                            current_p_clean_days: 0,
                            best_p_clean_days: 0,
                            total_vicory_rate: 0
                        }
                    })
                ]).then(res => {
                    dispatch(goalCalculation(false, 0));
                    if (!isAPICall) {
                        dispatch(calculateJournal(getState().statistic.j_array));
                    }
                });
            }
        }
        return Promise.resolve(true);
    }
};

export const calculateMosturbationDay = (pornData) => {
    return (dispatch, getState) => {
        try {

            let arrM = [], arrM_NO = [], arrM_YES = [];
            let full_array = cloneDeep(pornData.data);
            let yesterdayDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
            let last_checkup_at = (getState().metaData.metaData.last_checkup_at != undefined) &&
                getState().metaData.metaData.last_checkup_at || "";
            let todayDate = moment().format("YYYY-MM-DD");

            let remove_futureDate_array = [];

            full_array.map(obj => {
                if (moment(obj.occurred_at, 'YYYY-MM-DD').toDate() <= new Date()) {
                    remove_futureDate_array.push(obj)
                }
            })
            arrM_YES = filter(remove_futureDate_array, {is_relapse: false, is_resolved: true});
            arrM_NO = filter(remove_futureDate_array, {is_relapse: true, is_resolved: true});

            let arrMosturbationFreeObj = filter(remove_futureDate_array, {is_relapse: false, is_resolved: false});

            arrMosturbationFreeObj.forEach(obj => {
                if (obj.occurred_at !== todayDate) {
                    obj.is_resolved = true;
                    arrM_YES.push(obj);
                }
            })

            arrM_NO.sort(function (a, b) {
                return new Date(a.occurred_at) - new Date(b.occurred_at);
            });

            arrM_YES.sort(function (a, b) {
                return new Date(a.occurred_at) - new Date(b.occurred_at);
            });

            arrM_YES = arrM_YES.map(a => a.occurred_at);
            arrM_NO = arrM_NO.map(a => a.occurred_at);

            //Mosturbation calculation
            //Total Clean Days M
            let totalMCleanDays = arrM_YES.length;
            //END Clean Days M
            //M current streak calculation

            let i = 1, current_clean_streak_m = 0, streakarraym = [], counterm = 0;
            if (find(remove_futureDate_array, {occurred_at: todayDate, is_resolved: true}) !== undefined) {
                i = 0
            }

            //
            // Date.prototype.subDays = function(days) {
            //     var dat = new Date(this.valueOf());
            //     dat.setDate(dat.getDate() - days);
            //     return dat;
            // }
            // while (true){
            //     let prevDate = new Date().subDays(i).toISOString().substring(0,10);
            //     let res = arrM_YES.indexOf(prevDate);
            //     if(res!==-1) {
            //         current_clean_streak_m++;
            //         i++;
            //     }else break;
            // }
            while (true) {
                let res = arrM_YES.indexOf(moment(moment().subtract(i, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD').format('YYYY-MM-DD'));
                if (res !== -1) {
                    current_clean_streak_m++;
                    i++;
                } else break;
            }
            //End current streak calculation

            // Best Streak calculation
            let best_streak_m = 0;

            let ij = 1;
            arrM_YES.map((obj) => {
                let a = moment(obj).toDate();
                let dayafter = moment(a).add(1, 'days').toDate();
                let res = arrM_YES.indexOf(moment(dayafter).format('YYYY-MM-DD'));
                if (res != -1) {
                    counterm++;
                    ij++;
                } else {
                    streakarraym.push(counterm + 1);
                    ij = 1;
                    counterm = 0;
                }
            });

            if (streakarraym.length > 0) {
                best_streak_m = streakarraym.reduce(function (previous, current) {
                    return previous > current ? previous : current
                });
            }
            //END Best Streak calculation

            //M clean days per year mapping blue chart on statistic

            let groupbyYearM = groupBy(arrM_YES, function (el) {
                return (moment(el).toDate().getFullYear());
            });
            let currentYear = new Date().getFullYear();
            let finalYearMonthMapM = {};
            Object.keys(groupbyYearM).map((year) => {
                let temp = groupBy(groupbyYearM[year], function (el) {
                    return (moment(el).toDate().getMonth());
                });
                let monthArrM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                Object.keys(temp).map((month) => {
                    let totalDays = moment((parseInt(month) + 1).toString() + "-" + year.toString(), 'MM-YYYY').daysInMonth();
                    monthArrM[month] = parseInt((temp[month].length / totalDays) * 100);

                });
                finalYearMonthMapM[year] = {
                    isCurrentYear: (year == currentYear),
                    hasPrev: (Object.keys(groupbyYearM).indexOf((parseInt(year) - 1).toString()) > -1),
                    hasNext: (Object.keys(groupbyYearM).indexOf((parseInt(year) + 1).toString()) > -1),
                    monthArr: monthArrM
                };
            });
            let strCurrentYear = currentYear.toString();
            if ((Object.keys(finalYearMonthMapM).indexOf(strCurrentYear)) < 0) {
                let prev = (currentYear - 1).toString();
                if ((Object.keys(finalYearMonthMapM).indexOf(prev)) >= 0) {
                    finalYearMonthMapM[prev].hasNext = true;
                    finalYearMonthMapM[strCurrentYear] = {
                        isCurrentYear: true, hasPrev: true, hasNext: false,
                        monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                } else {
                    if (Object.keys(finalYearMonthMapM).length == 0) {
                        finalYearMonthMapM[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: false, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        };
                    } else {
                        Object.keys(finalYearMonthMapM).forEach(key => {
                            finalYearMonthMapM[key].hasNext = true
                        });
                        finalYearMonthMapM[strCurrentYear] = {
                            isCurrentYear: true,
                            hasPrev: true,
                            hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    }
                }
            }

            //M END clean days per year mapping blue chart on statistic

            //M START what day I relapsed
            let totalM = arrM_NO.length;
            let arrOfWeekDaysM = [0, 0, 0, 0, 0, 0, 0];
            arrM_NO.map((obj) => {
                let day = moment(obj).toDate().getDay();
                let value = arrOfWeekDaysM[day];
                arrOfWeekDaysM[day] = (value + 1);
            });
            let newArrOfWeekDaysM = [];
            arrOfWeekDaysM.map((obj) => {
                let a = parseInt((obj / totalM) * 100);
                if (isNaN(a)) {
                    newArrOfWeekDaysM.push(0);
                } else {
                    newArrOfWeekDaysM.push(a);
                }
            });
            newArrOfWeekDaysM.push(newArrOfWeekDaysM.shift());
            //M END what day I relapsed
            //End Mosturbation calculation

            const mDetail = {
                m_array: pornData.data,
                m_no_array: arrM_NO,
                m_yes_array: arrM_YES,
                clean_m_days_per_month: finalYearMonthMapM,
                relapsed_m_days_per_weekdays: newArrOfWeekDaysM,
                total_m_clean_days: totalMCleanDays,
                current_m_clean_days: current_clean_streak_m,
                best_m_clean_days: best_streak_m
            };
            if (JSON.stringify(getState().statistic.mosturbutionDetail) != JSON.stringify(mDetail)) {
                dispatch({
                    type: STATISTIC_M_CALCULATION,
                    payload: mDetail
                });
            }
        } catch (e) {
            console.log(e);
        }
        return Promise.resolve(true);
        //});
    }
};

export const calculateJournal = (journalDays) => {
    return (dispatch, getState) => {


        let arrJTmp = [];
        let today = moment();

        if (getState().user.userDetails['journal']) {
            journalDays = getState().user.userDetails['journal'].data
        }

        let arrNTmp = getState().statistic.pornDetail.p_array && getState().statistic.pornDetail.p_array.data || [];//[];
        // let arrObjectCurrect = _.filter(journalDays, {type: 1});
        // let arrObjectWrong = _.filter(journalDays, {type: 2});
        let arrObjectCurrect = 0;
        let arrObjectWrong = 0;

        //Journal list calculation
        if (journalDays) {
            journalDays.map(obj => {
                let formatedDate = moment(obj.entered_at, 'YYYY-MM-DD').format('MMMM DD, YYYY');
                if (moment().diff(moment(formatedDate, 'MMMM DD, YYYY'), 'hours') > 0) {
                    if (obj.type === 1) {
                        arrObjectCurrect = arrObjectCurrect + 1;
                    } else if (obj.type === 2) {
                        arrObjectWrong = arrObjectWrong + 1;
                    }

                    arrJTmp[obj.entered_at] = {
                        data: obj.content,
                        color: obj.type,
                        formatedDate: (moment().diff(moment(formatedDate, 'MMMM DD, YYYY'), 'days') == 0) ? "Today"
                            : formatedDate,
                        day: moment(obj.entered_at, 'YYYY-MM-DD').format('DD'),
                        key: obj.entered_at,
                        id: obj.id
                    }
                }

            });
        }

        let todayformated = moment(today).format("YYYY-MM-DD");

        let todayJournalObj = find(journalDays, {entered_at: todayformated});

        if (todayJournalObj == undefined) {
            arrJTmp[todayformated] = {
                data: "",
                color: "rgb(239,239,244)",
                formatedDate: "Today",
                day: moment(todayformated, 'YYYY-MM-DD').format('DD'),
                key: todayformated,
                id: 0
            }
        }

        let mapObject = {};
        Object.keys(arrJTmp).map((obj) => {
            let a = moment(obj, 'YYYY-MM-DD').format("MMMM");
            let year = moment(obj, 'YYYY-MM-DD').format("YYYY");
            let key = a + "-" + year;
            if (Object.keys(mapObject).indexOf(key) > -1) {
                mapObject[key][obj] = arrJTmp[obj];
            } else {
                mapObject[key] = {};
                mapObject[key][obj] = arrJTmp[obj];
                mapObject[key][obj] = arrJTmp[obj];
            }
        });

        const journalOrderedDates = {};
        Object.keys(mapObject).sort(function (a, b) {
            return moment(b, 'MMMM-YYYY').toDate() - moment(a, 'MMMM-YYYY').toDate();
        }).forEach(function (key) {
            journalOrderedDates[key] = reverseObject(mapObject[key]);
        });
        Object.keys(journalOrderedDates).forEach(function (date) {
        });

        dispatch({
            type: STATISTIC_J_DATE_ARRAY,
            payload: journalDays,
        });

        dispatch({
            type: STATISTIC_JOURNAL_DETAIL,
            payload: journalOrderedDates,
        });

        dispatch({
            type: STATISTIC_JOURNAL_TOTAL,
            payload: {
                right: arrObjectCurrect,
                wrong: arrObjectWrong
            },
        })
        return Promise.resolve(true);
        //End Journal List
    }
};

//Goal Calculation
export const goalCalculation = (isFromToday = false, currentCleanStreak = null) => {
    return (dispatch, getState) => {
        try {
            let currentClean = getState().statistic.pornDetail.current_p_clean_days;
            if (currentCleanStreak != null) {
                currentClean = currentCleanStreak;
            }
            if (isFromToday) {
                dispatch(calculatePornDay(getState().statistic.pornDetail.p_array.data || []));
            }
            // setTimeout(() => {
            //     dispatch(setUpLocalNotificationAlerts());
            // }, 10000);
            if (currentClean === 0) {
                let res = getState().statistic.pornDetail.p_no_array.indexOf(moment().format('YYYY-MM-DD'));
                let todayDate = moment().format("YYYY-MM-DD");
                let registerDate = (getState().metaData && getState().metaData.metaData &&
                    getState().metaData.metaData.registered_at !== undefined) &&
                    getState().metaData.metaData.registered_at || "";
                if (res !== -1 || registerDate === todayDate) {
                    return dispatch({
                        type: SET_GOAL_DATA,
                        payload: {
                            Heading: "1 - 24 hours clean",
                            Description: "Goal begins at midnight",//"Goal starts at midnight",
                            per: 4, //0 means 4%
                            goalDays: 1,
                            previousAchieved: 0,
                            previousMessage: "",
                            goalName: '1 day',
                            goalIndex: 0
                        },
                    });
                } else {
                    //X hours remaining
                    let remHours = moment().toDate().getHours();
                    return dispatch({
                        type: SET_GOAL_DATA,
                        payload: {
                            Heading: "1 - 24 hours clean",
                            Description: (remHours === 1) && strLocale("today.hour", {hour: remHours})
                                || strLocale("today.hours", {hour: remHours}),
                            per: Math.floor(4 + (new Date().getHours() / 24) * 96),
                            goalDays: 1,
                            previousAchieved: 0,
                            previousMessage: "",
                            goalName: '1 day',
                            goalIndex: 0
                        },
                    });
                }
                return;
            }

            let caseVal = 0;
            for (let i = 1; i < userGoals.length; i++) {
                if (currentClean < userGoals[i]) {
                    caseVal = userGoals[i];
                    return dispatch({
                        type: SET_GOAL_DATA,
                        payload: getGoalData(currentClean, i + 2, userGoals[i], i === 0 ? 1 : userGoals[i - 1], userGoalsTitle[i], i)
                    });
                    break;
                }
            }

            // (currentClean < 3) ?
            //     caseVal = 1 :
            //     (currentClean < 7) ?
            //         caseVal = 2 :
            //         (currentClean < 10) ?
            //             caseVal = 3 :
            //             (currentClean < 14) ?
            //                 caseVal = 4 :
            //                 (currentClean < 21) ?
            //                     caseVal = 5 :
            //                     (currentClean < 30) ?
            //                         caseVal = 6 :
            //                         (currentClean < 45) ?
            //                             caseVal = 7 :
            //                             (currentClean < 60) ?
            //                                 caseVal = 8 :
            //                                 (currentClean < 75) ?
            //                                     caseVal = 9 :
            //                                     (currentClean < 90) ?
            //                                         caseVal = 10 :
            //                                         (currentClean < 120) ?
            //                                             caseVal = 11 :
            //                                             (currentClean < 180) ?
            //                                                 caseVal = 12 :
            //                                                 (currentClean < 270) ?
            //                                                     caseVal = 13 :
            //                                                     (currentClean < 365) ?
            //                                                         caseVal = 14 :
            //                                                         (currentClean < 400) ?
            //                                                             caseVal = 15 :
            //                                                             (currentClean < 500) ?
            //                                                                 caseVal = 16 :
            //                                                                 (currentClean < 600) ?
            //                                                                     caseVal = 17 :
            //                                                                     (currentClean < 700) ?
            //                                                                         caseVal = 18 :
            //                                                                         (currentClean < 800) ?
            //                                                                             caseVal = 19 :
            //                                                                             (currentClean < 900) ?
            //                                                                                 caseVal = 20 :
            //                                                                                 (currentClean < 1000) ?
            //                                                                                     caseVal = 21 :
            //                                                                                     caseVal = 1;
            //
            //
            // switch (caseVal) {
            //     case 1:
            //         //getGoalData(currentClean, goalNo, goalDays, prevGoal)
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 2, 3, 1)
            //         });
            //         break;
            //     case 2:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 3, 7, 3)
            //         });
            //         break;
            //     case 3:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 4, 10, 7)
            //         });
            //         break;
            //     case 4:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 5, 14, 10)
            //         });
            //         break;
            //     case 5:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 6, 21, 14)
            //         });
            //         break;
            //     case 6:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 7, 30, 21)
            //         });
            //         break;
            //     case 7:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 8, 45, 30)
            //         });
            //         break;
            //     case 8:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 9, 60, 45)
            //         });
            //         break;
            //     case 9:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 10, 75, 60)
            //         });
            //         break;
            //     case 10:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 11, 90, 75)
            //         });
            //         break;
            //     case 11:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 12, 120, 90)
            //         });
            //         break;
            //     case 12:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 13, 180, 120)
            //         });
            //         break;
            //     case 13:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 14, 270, 180)
            //         });
            //         break;
            //     case 14:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 15, 365, 270)
            //         });
            //         break;
            //     case 15:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 400, 365)
            //         });
            //         break;
            //     case 16:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 500, 400)
            //         });
            //         break;
            //     case 17:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 600, 500)
            //         });
            //         break;
            //     case 18:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 700, 600)
            //         });
            //         break;
            //     case 19:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 800, 700)
            //         });
            //         break;
            //     case 20:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 900, 800)
            //         });
            //         break;
            //     case 21:
            //         return dispatch({
            //             type: SET_GOAL_DATA,
            //             payload: getGoalData(currentClean, 16, 1000, 900)
            //         });
            //         break;
            // }
        } catch (e) {
            console.log(e);
        }
    }
};

//Goal Details
getGoalData = (currentClean, goalNo, goalDays, prevGoal, goalName, goalIndex) => {
    let heading = goalNo + " - " + goalDays + " days clean";
    let des = getCurrentStreak(goalDays, currentClean);

    let per = Math.round((4 + (Math.round(((currentClean * 24 + new Date().getHours()) /
        (goalDays * 24)) * 100) * 0.96)) * 100) / 100;

    let prevMsg = (goalNo - 1) + " - " + prevGoal + " days clean";
    if (prevGoal == 1) {
        prevMsg = "1 - 24 hours clean";
    }
    let obj = {
        Heading: heading,
        Description: des,
        per: per,
        goalDays: goalDays,
        previousAchieved: prevGoal,
        previousMessage: prevMsg,
        goalName: goalName,
        goalIndex: goalIndex
    };
    return obj;
}

getCurrentStreak = (day, currentClean) => {
    let hour = new Date().getHours();
    let hourString = "";
    if (hour != 0) {
        if (hour == 1) {
            hourString = ", " + strLocale("today.hour", {hour});
        } else {
            hourString = ", " + strLocale("today.hours", {hour});
        }
    }
    let message = strLocale("today.goalDesc days", {currentClean, hourString});
    if (currentClean == 1) {
        return strLocale("today.goalDesc day", {currentClean, hourString});
    }
    return message;
};

//// 1. If achievement/goal never reached - 'In progress'
// 2. If achievement previously reached - 'Achievement previously unlocked'
// 3. If achievement currently reached - 'Achievement unlocked'
// 1. Percentage of goal achieved, then hours (or days) remaining to achieve goal
// 2. If more than 100%, text should be '100%' (do not display time remaining)

export const calculationYellowAchievements = () => {
    return (dispatch, getState) => {
        let currentClean = getState().statistic.pornDetail.current_p_clean_days;
        let bestStreak = getState().statistic.pornDetail.best_p_clean_days;
        let achievements = [
            {
                icon: "B",
                val: "1",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - goal starts at midnight"
            },
            {
                icon: "B",
                val: "3",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 3 days remaining"
            },
            {
                icon: "B",
                val: "5",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 5 days remaining"
            },
            {
                icon: "B",
                val: "7",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 7 days remaining"
            },
            {
                icon: "B",
                val: "10",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 10 days remaining"
            },
            {
                icon: "B",
                val: "14",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 14 days remaining"
            },
            {
                icon: "B",
                val: "21",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 21 days remaining"
            },
            {
                icon: "B",
                val: "30",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 30 days remaining"
            },
            {
                icon: "B",
                val: "45",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 45 days remaining"
            },
            {
                icon: "B",
                val: "60",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 60 days remaining"
            },
            {
                icon: "B",
                val: "75",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 75 days remaining"
            },
            {
                icon: "B",
                val: "90",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 90 days remaining"
            },
            {
                icon: "B",
                val: "120",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 120 days remaining"
            },
            {
                icon: "B",
                val: "180",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 180 days remaining"
            },
            {
                icon: "B",
                val: "270",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 270 days remaining"
            },
            {
                icon: "B",
                val: "365",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 365 days remaining"
            },
        ];

        let moreThan700 = [
            {
                icon: "B",
                val: "1",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - goal starts at midnight"
            },
            {
                icon: "B",
                val: "3",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 3 days remaining"
            },
            {
                icon: "B",
                val: "5",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 5 days remaining"
            },
            {
                icon: "B",
                val: "7",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 7 days remaining"
            },
            {
                icon: "B",
                val: "10",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 10 days remaining"
            },
            {
                icon: "B",
                val: "14",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 14 days remaining"
            },
            {
                icon: "B",
                val: "21",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 21 days remaining"
            },
            {
                icon: "B",
                val: "30",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 30 days remaining"
            },
            {
                icon: "B",
                val: "45",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 45 days remaining"
            },
            {
                icon: "B",
                val: "60",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 60 days remaining"
            },
            {
                icon: "B",
                val: "75",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 75 days remaining"
            },
            {
                icon: "B",
                val: "90",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 90 days remaining"
            },
            {
                icon: "B",
                val: "120",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 120 days remaining"
            },
            {
                icon: "B",
                val: "180",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 180 days remaining"
            },
            {
                icon: "B",
                val: "270",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 270 days remaining"
            },
            {
                icon: "B",
                val: "365",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 365 days remaining"
            },
            {
                icon: "B",
                val: "450",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 450 days remaining"
            },
            {
                icon: "B",
                val: "520",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 520 days remaining"
            },
            {
                icon: "B",
                val: "600",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 600 days remaining"
            },
            {
                icon: "B",
                val: "730",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 750 days remaining"
            },
            {
                icon: "B",
                val: "800",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 750 days remaining"
            },
            {
                icon: "B",
                val: "920",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 920 days remaining"
            },
            {
                icon: "B",
                val: "1000",
                progressPer: "4%",
                actualProgress: "0%",
                remainingProgress: "0% - 1000 days remaining"
            }];

        if (bestStreak >= 365) {
            achievements = [...achievements, ...moreThan700];
        }

        let goalDays = AppContant.userGoals;
        for (let i = 0; i < achievements.length; i++) {
            achievements[i]["icon"] = (parseInt(achievements[i].val) <= bestStreak) && "L" || "B";
            achievements[i]["icon"] = (parseInt(achievements[i].val) <= currentClean) && "Y" || achievements[i]["icon"];
            achievements[i].progressPer = getProgressBarVal(goalDays[i], currentClean);
            achievements[i].remainingProgress = getRemainingTextAndPer(goalDays[i], currentClean);
            achievements[i].remainingDay = getRemainingTextAndPer2(goalDays[i], currentClean);
            achievements[i].actualProgress = getActualProgressBarVal(goalDays[i], currentClean);
        }
        return Promise.resolve({
            achievements
        });
    }
};

getProgressBarVal = (days, currentClean) => {
    if (currentClean >= days) {
        return "100%";
    } else {
        return Math.floor(4 + ((currentClean * 24) + new Date().getHours()) / (days * 24) * 96) + "%";
    }
};

getActualProgressBarVal = (days, currentClean) => {
    if (currentClean >= days) {
        return "100%";
    } else {
        return Math.floor(((currentClean * 24) + new Date().getHours()) / (days * 24) * 100) + "%";
    }
};

getRemainingTextAndPer = (days, currentClean) => {
    if (currentClean >= days) {
        return "100%";
    } else {
        let per = "";
        // let perVal = Math.floor(4 + ((currentClean * 24) + new Date().getHours()) / (days*24) * 96);
        let perVal = Math.floor(((currentClean * 24) + new Date().getHours()) / (days * 24) * 100);
        if (perVal >= 100) {
            return "100%"
        }
        per = perVal;
        let remainingHours = 24 - new Date().getHours();
        let str = "";
        let remainingDays = days - currentClean;
        str = strLocale("team.days remaining", {per, remainingDays}) // per + " - " + remainingDays + " days remaining";
        if (remainingDays <= 1) {
            str = strLocale("team.hours remaining", {per, remainingHours}) //per + " - " + remainingHours + " hours remaining";
        }
        return str;
    }
};

getRemainingTextAndPer2 = (days, currentClean) => {
    if (currentClean >= days) {
        return "100%";
    } else {
        let per = "";
        // let perVal = Math.floor(4 + ((currentClean * 24) + new Date().getHours()) / (days*24) * 96);
        let perVal = Math.floor(((currentClean * 24) + new Date().getHours()) / (days * 24) * 100);
        if (perVal >= 100) {
            return "100%"
        }
        per = perVal;
        let remainingHours = 24 - new Date().getHours();
        let str = "";
        let remainingDays = days - currentClean;
        str = strLocale("team.days remaining title", {remainingDays}) // per + " - " + remainingDays + " days remaining";
        if (remainingDays <= 1) {
            str = strLocale("team.It will be achieved today") //per + " - " + remainingHours + " hours remaining";
        }
        return str;
    }
};

//Set porn free days
export const setBeforeBeginPornFreeDays = (pornArr, index = 0) => {
    return (dispatch, getState) => {

        let totalElement = (pornArr) && pornArr.length || 0;
        if (index == 0) {
            //Remove today object from server
            let today = moment().format("YYYY-MM-DD");
            let toDayObj = find(pornArr, {occurred_at: today});
            if (toDayObj == undefined) {
                let oldObj = find(getState().statistic.pornDetail.p_array.data || [], {occurred_at: today});
                if (oldObj !== undefined) {
                    if (oldObj.id) {
                        dispatch(deletePornDay(oldObj.id, null, Constant.requestIdentifier.BEFORE_BEGIN));
                    }
                }
            }
        }
        if (index < totalElement) {
            let obj = pornArr[index];
            let pornData = getState().statistic.pornDetail.p_array.data || [];

            let oldPornObj = find(pornData, {occurred_at: obj.occurred_at});
            if (oldPornObj == undefined) {
                // return dispatch(addUpdatePornDay(pornArr, obj, true, index));
            } else {
                obj.id = oldPornObj.id;
                // return dispatch(addUpdatePornDay(pornArr, obj, false, index));
            }
        } else {
            // dispatch(getPornDays(false, false));
            // dispatch(getTeamDetail());
            // dispatch(getleaderboardTeamList());
            return Promise.resolve(true);
        }
    }
};

/*
 Reset porn statistics -
 1. Clear all marked dates from porn calendar
 2. Set all relapse_porn reasons to 0
 3. Delete any custom porn relapse reasons
 4. Set relapse_porn_morning, relapse_porn_afternoon, relapse_porn_evening, relapse_porn_night to 0
 5. Reset stressed_morning, stressed_afternoon, stressed_evening, stressed_night to 0
 temp
 */

/*

 Reset masturbation statistics -
 1. Clear all marked dates from masturbation calendar
 2. Set relapse_masturbation_morning, relapse_masturbation_afternoon,
 relapse_masturbation_evening, relapse_masturbation_night to 0
 tempted_masturbation
 * */
/*
 Reset rewiring progress -
 1. Set progress_desensitation to 0
 2. Set progress_hypofrontality to 0
 3. Set progress_wisdom to 0
 4. Set progress_dopamine_rewiring to 0
 5. Set progress_stress_control to 0
 6. Set all improvement_X to 0
 */
export const resetRewiringProgress = () => {
    return (dispatch, getState) => {
        let metaData = cloneDeep(getState().metaData.metaData);
        Object.keys(metaData).map(key => {
            if (key.includes("progress_") || key.includes("improvement_")) {
                metaData[key] = 0;
            }
        });
        let oldBackup = cloneDeep(getState().metaData.metaDataBackup.data);

        if (oldBackup == undefined || Object.keys(oldBackup).length == 0) {
            if (getState().metaData.metaData && Object.keys(getState().metaData.metaData).length > 0) {
                oldBackup = cloneDeep(getState().metaData.metaData);
            } else {
                oldBackup = cloneDeep(objDefaultMetaData);
            }
        }
        Object.keys(oldBackup).map(key => {
            if (key.includes("progress_") || key.includes("improvement_")) {
                oldBackup[key] = 0;
            }
        });
        dispatch({
            type: META_DATA_BACKUP,
            payload: {
                date: new Date().toDateString(),
                data: oldBackup
            }
        });
        return Promise.all([
            dispatch(updateMetaData(metaData))
        ]).then(res => {
            return Promise.resolve(true);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
};

/*
 Reset rewiring exercises -
 1. Set all exercise_number_X to 1
 */

export const resetRewiringExercises = () => {
    return (dispatch, getState) => {
        let metaData = cloneDeep(getState().metaData.metaData);
        Object.keys(metaData).map(key => {
            if (key.includes("exercise_")) {
                metaData[key] = 1;
            }
        });
        let oldBackup = cloneDeep(getState().metaData.metaDataBackup.data);

        if (oldBackup == undefined || Object.keys(oldBackup).length == 0) {
            if (getState().metaData.metaData && Object.keys(getState().metaData.metaData).length > 0) {
                oldBackup = cloneDeep(getState().metaData.metaData);
            } else {
                oldBackup = cloneDeep(objDefaultMetaData);
            }
        }
        Object.keys(oldBackup).map(key => {
            if (key.includes("exercise_")) {
                oldBackup[key] = 1;
            }
        });
        dispatch({
            type: META_DATA_BACKUP,
            payload: {
                date: new Date().toDateString(),
                data: oldBackup
            }
        });
        return Promise.all([
            dispatch(updateMetaData(metaData))
        ]).then(res => {
            return Promise.resolve(true);
        }).catch(err => {
            // return Promise.reject(err);
            return dispatch(apiErrorHandler(err));
        });
    }
};

export const addJournal = (objPorn) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/journal/`);
            let arrData = {data: []}
            let boolValue = true;
            if (getState().user.userDetails['journal']) {
                arrData = getState().user.userDetails['journal'];
                boolValue = false;
            }
            objPorn.entered_at = moment().format("YYYY-MM-DD");
            arrData.data.push(objPorn);
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {
                // setTimeout(() => {
                //     dispatch(calculatePornDay(arrData));
                // }, 100)
                let userObj = cloneDeep(getState().user.userDetails);
                userObj.journal = arrData;

                Promise.all([
                    dispatch({
                        type: SET_USER_DETAIL,
                        payload: userObj,
                    })
                ]).then(res => {
                    dispatch(calculateJournal());
                });

                resolve(boolValue)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

export const editJournal = (objPorn, index = 0) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/journal/`);
            let arrData = {data: []}
            let boolValue = true;
            if (getState().user.userDetails['journal']) {
                arrData = getState().user.userDetails['journal'];
                boolValue = false;
            }
            objPorn.entered_at = moment().format("YYYY-MM-DD");
            arrData.data[index] = objPorn;
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {

                let userObj = cloneDeep(getState().user.userDetails);
                userObj.journal = arrData;

                Promise.all([
                    dispatch({
                        type: SET_USER_DETAIL,
                        payload: userObj,
                    })
                ]).then(res => {
                    dispatch(calculateJournal());
                });

                resolve(boolValue)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

export const editStatusJournal = (index = 0, status = 0) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/journal/`);
            let arrData = {data: []}
            let boolValue = true;
            if (getState().user.userDetails['journal']) {
                arrData = getState().user.userDetails['journal'];
                boolValue = false;
            }
            arrData.data[index].type = status;
            let aryUpdate = cloneDeep(arrData);

            db.update(aryUpdate).then(responseData => {

                let userObj = cloneDeep(getState().user.userDetails);
                userObj.journal = arrData;

                Promise.all([
                    dispatch({
                        type: SET_USER_DETAIL,
                        payload: userObj,
                    })
                ]).then(res => {
                    dispatch(calculateJournal());
                });
                resolve(boolValue)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

export const calculateMeditation = (pornData, isAPICall = false) => {
    return (dispatch, getState) => {
        try {
            let mainArray = cloneDeep(pornData.data);

            let full_array = mainArray.sort(function (a, b) {
                return new Date(a.occurred_at) - new Date(b.occurred_at);
            });

            full_array = full_array.map(a => a.occurred_at);

            //clean days per year mapping blue chart on statistic
            let groupbyYear = groupBy(full_array, function (el) {
                return (moment(el).toDate().getFullYear());
            });

            let finalYearMonthMapP = {};
            let currentYear = new Date().getFullYear()
            let currentMonth = new Date().getMonth()

            Object.keys(groupbyYear).map((year) => {
                let temp = groupBy(groupbyYear[year], function (el) {
                    return (moment(el).toDate().getMonth());
                });
                let monthArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let monthlyObj = {};
                Object.keys(temp).map((month) => {

                    let count = 0;
                    for (let i = 0; i < temp[month].length; i++){
                        let selectedQue = find(mainArray, {occurred_at: temp[month][i]});
                        count = count + selectedQue.millisecond;
                    }
                    monthArr[month] = parseInt(count);
                });
                finalYearMonthMapP[year] = {
                    isCurrentYear: (year == currentYear),
                    hasPrev: (Object.keys(groupbyYear).indexOf((parseInt(year) - 1).toString()) > -1),
                    hasNext: (Object.keys(groupbyYear).indexOf((parseInt(year) + 1).toString()) > -1),
                    monthArr: monthArr,
                    monthlyProgress: monthlyObj
                };
            });
            let strCurrentYear = currentYear.toString();
            if ((Object.keys(finalYearMonthMapP).indexOf(strCurrentYear)) < 0) {
                let prev = (currentYear - 1).toString();
                if ((Object.keys(finalYearMonthMapP).indexOf(prev)) >= 0) {
                    finalYearMonthMapP[prev].hasNext = true;
                    finalYearMonthMapP[strCurrentYear] = {
                        isCurrentYear: true, hasPrev: true, hasNext: false,
                        monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                } else {
                    if (Object.keys(finalYearMonthMapP).length == 0) {
                        finalYearMonthMapP[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: false, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    } else {
                        Object.keys(finalYearMonthMapP).forEach(key => {
                            finalYearMonthMapP[key].hasNext = true
                        });
                        finalYearMonthMapP[strCurrentYear] = {
                            isCurrentYear: true, hasPrev: true, hasNext: false,
                            monthArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    }
                }
            }

            //End PORN Calculation
            Promise.all([
                dispatch({
                    type: MEDITATION_M_CALCULATION,
                    payload: {
                        meditaionYearDetail: finalYearMonthMapP || {},
                    }
                })
            ]).then(res => {

            });
        } catch (e) {

        }
        return Promise.resolve(true);
    }
};
