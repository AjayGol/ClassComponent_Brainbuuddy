import {
    SET_META_DATA,
    TOTAL_REWIRING_PERCENTAGE,
    PORN_WHY_RELAPSE,
    PORN_WHEN_RELAPSE,
    M_WHEN_RELAPSE,
    IMPROVEMEMT_PERCENTAGE,
    ADD_NEW_CHECKUP_QUESTION,
    SET_MORNING_ROUTINE,
    SET_DONE_MORNING_ROUTINE,
    SET_REWIRING_BARS,
    PORN_WHEN_STRESSED,
    SET_SELECTED_OPTIONAL_EXERCISES,
    META_DATA_BACKUP,
    MEDITATION_TIME,
    TODAY_SCREEN_EXERCISES,
    SHOW_REWIRING_PROGRESS_POPUP,
    SET_DO_NOT_DISTURB,
    PORN_WHEN_TEMPTED,
    M_WHEN_TEMPTED,
    PORN_WHY_TEMPTED,
    APP_SET_USER_DATA,
    SET_LEVEL_DATA,
    LEVEL_LIST, LEVEL_NUMBER,
    AWARD_LIST, TODAY_EXERCISE,
    AWARD_TODAY, SET_USER_DETAIL
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import ConstantValue from '../helper/constant';
import {findIndex, find, filter, indexOf, cloneDeep, sortBy} from 'lodash';
import moment from 'moment';
import {
    deletePornDay,
    addPornDays,
    updatePornDay,
    resolvePornDay,
    deleteFuturePornDates,
    calculatePornDay, getPornDaysNew
} from './statisticAction';
import {
    manageRewiredProgressPopup, manageLifeTreeOnToday,
    apiErrorHandler, setAppTheme, loadDataAfterLoginNew,
    UpdateFullData
} from './userActions';
import {
    getTeamDetail,

} from './teamAction';
import AppConstant from '../helper/constant';
import {getValidMetadata, manageSingleWord, showThemeAlert, undefineObject} from "../helper/appHelper";
import {AsyncStorage, NativeModules} from "react-native";
import {EventRegister} from "react-native-event-listeners";

const metadataAppKeys = Constant.metadataKeys;
const objDefaultMetaData = {};
metadataAppKeys.forEach((key) => objDefaultMetaData[key] = key.includes('exercise') ? 1 : 0);

// import {app} from '../helper/firebaseConfig';
import {foregroundColor} from "react-native-calendars/src/style";
import database from '@react-native-firebase/database';

const db = database();

export const getAllMetaDataNew = (userData = null, isFromInitial = false, snapshot = null, id = null) => {

    return (dispatch, getState) => {
        if (snapshot.val()) {
            const snap = Object.entries(snapshot.val())
            if (snap.length !== 0) {
                const data = snap[snap.length - 1]

                //MataData
                if (data[1].matadata && data[1].matadata.last_checkup_at) {
                    AsyncStorage.setItem("lastCheckupDate", data[1].matadata.last_checkup_at);
                }
                dispatch({
                    type: SET_META_DATA,
                    payload: data[1].matadata,
                });

                dispatch({
                    type: SET_LEVEL_DATA,
                    payload: data[1].level,
                });

                let oldBackup = getState().metaData.metaDataBackup;
                if (oldBackup == undefined || oldBackup.date != new Date().toDateString()
                    || Object.keys(oldBackup.data).length == 0) {
                    dispatch({
                        type: META_DATA_BACKUP,
                        payload: {
                            date: new Date().toDateString(),
                            data: data[1].matadata
                        }
                    });
                }

                //SetTheme
                // dispatch(setAppTheme('default', false));
                // if(data[1].matadata.colour_theme){
                //     if(data[1].matadata.colour_theme === "autodark"){
                //         dispatch(setAppTheme('autodark', false));
                //     }else if(data[1].matadata.colour_theme === "dark"){
                //         dispatch(setAppTheme('dark', false));
                //     }else{
                //         dispatch(setAppTheme('default', false));
                //     }
                // }


                // //Set Meditation Time
                // if(data[1].matadata.meditation_time){
                //     let appMeditationTime = getState().metaData.meditationTime || 10;
                //     if(appMeditationTime !== data[1].matadata.meditation_time){
                //         if(appMeditationTime != 10){
                //             //set app meditation time to server
                //             dispatch(setMeditationTime(appMeditationTime))
                //         }else{
                //             //set server time to app
                //             dispatch(setMeditationTime(data[1].matadata.meditation_time, false))
                //         }
                //     }
                // }

                //Set Timezone and last check
                // dispatch(setTimeZoneAndCheckupDate({last_checkup_at:data[1].matadata.last_checkup_at,
                //     timezone:data[1].matadata.timezone}));
                dispatch(setTimeZoneAndCheckupDateNew({
                    last_checkup_at: data[1].matadata.last_checkup_at,
                    timezone: data[1].matadata.timezone
                }, data[1].matadata, id));

                // Update MataData
                console.log(getState().metaData.metaData)
                dispatch(calculateRewiringProgress());
                dispatch(calculateAwardProcessNew());
                dispatch(calculatePornWhyIRelapse());
                dispatch(calculatePornWhenIRelapse());
                dispatch(calculateMasturbationWhenIRelapse());
                dispatch(calculateImprovementByActivity());
                return Promise.resolve(true);
            }
            return Promise.resolve(true)
        }
    }

};

export const calculateAwardProcessNew = (metadata, matadata2, id = null) => {
    return (dispatch, getState) => {
        try {
            let metaData = getState().metaData.metaData;
            let awardArray = [
                {
                    id: 'awards_community',
                    name: 'Community',
                    pointGet: '1500+ points',
                    decription: 'Post, Comment or replay 100 times on the beefup forum',
                    icon: 'img_community_badge',
                    progress: '0'
                },
                {
                    id: 'awards_launch',
                    name: 'Launch',
                    pointGet: '500+ points',
                    decription: 'Complete once all activity',
                    icon: 'img_launch_badge',
                    progress: '0'
                },
                {
                    id: 'awards_lover',
                    name: 'Lover',
                    pointGet: '700+ points',
                    decription: 'Complete 100 times today motivation',
                    icon: 'img_lover_badge',
                    progress: '0'
                },
                {
                    id: 'awards_meditation',
                    name: 'Meditation',
                    pointGet: '500+ points',
                    decription: 'Power mind and release stress',
                    icon: 'img_meditation_badge',
                    progress: '0'
                },
                {
                    id: 'awards_selfconfident',
                    name: 'Self Confident',
                    pointGet: '300+ points',
                    decription: 'Daily activity get confident',
                    icon: 'img_selfconfidence_badge',
                    progress: '0'
                },
                {
                    id: 'award_braintrain',
                    name: 'Brain Train',
                    pointGet: '600+ points',
                    decription: 'Chilling out the brain, Good news about the brain with exercise',
                    icon: 'img_selfgoalmaster_badge',
                    progress: '0'
                },
                {
                    id: 'awards_streakgoalmaster',
                    name: 'Streak Goal Master',
                    pointGet: '800+ points',
                    decription: '100 streak goal to archive',
                    icon: 'img_selfgoalmaster_badge',
                    progress: '0'
                },
            ];

            for (let i = 0; i < awardArray.length; i++) {
                if (metaData[awardArray[i].id] !== undefined) {
                    awardArray[i].progress = metaData[awardArray[i].id]
                }
            }

            dispatch({
                type: AWARD_LIST,
                payload: awardArray
            });


        } catch (e) {
            console.log(e);
        }
    }
};

//Set Timezone and last checkup if null in metadata
export const setTimeZoneAndCheckupDateNew = (metadata, matadata2, id = null) => {
    return (dispatch, getState) => {
        try {
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            let obj = {};
            if (metadata.last_checkup_at === null || metadata.last_checkup_at === "") {
                metadata.last_checkup_at = yesterday;
                matadata2.last_checkup_at = yesterday;
            }
            if (AppConstant.isIOS) {
                let NativeCallbackIOS = NativeModules.checkBundle;
                NativeCallbackIOS.getTimeZone((err, timeZone) => {
                    if (timeZone && timeZone != "NULL" && metadata.timezone == null || metadata.timezone != timeZone) {
                        metadata.timezone = timeZone;
                        matadata2.timezone = timeZone;
                    }
                    if (Object.keys(metadata).length > 0) {
                        dispatch(updateMetaDataNoCalculationNew(metadata, id));
                        dispatch({
                            type: SET_META_DATA,
                            payload: matadata2,
                        })
                    }
                });
            } else {
                let NativeCallback = NativeModules.AndroidNativeModule;
                NativeCallback.getTimeZone((timeZone) => {
                    if (timeZone && timeZone != "NULL" && metadata.timezone == null || metadata.timezone != timeZone) {
                        metadata.timezone = timeZone;
                        matadata2.timezone = timeZone;
                        if (Object.keys(metadata).length > 0) {
                            dispatch(updateMetaDataNoCalculationNew(metadata, id));
                            dispatch({
                                type: SET_META_DATA,
                                payload: matadata2,
                            })
                        }
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    }
};

export const updateMetaData = (updatedMetaData, improveData = [], awardIncrease = false) => {
    return (dispatch, getState) => {

        let updatedData = updatedMetaData;
        let metaData = getState().metaData.metaData;

        if (metaData == undefined || Object.keys(metaData).length == 0) {
            metaData = cloneDeep(objDefaultMetaData);
        }
        let oldBackup = cloneDeep(getState().metaData.metaDataBackup.data);
        if (oldBackup == undefined || Object.keys(oldBackup).length == 0) {
            if (Object.keys(getState().metaData.metaData).length > 0) {
                oldBackup = cloneDeep(getState().metaData.metaData);
            } else {
                oldBackup = cloneDeep(objDefaultMetaData);
            }
        }

        let updateAward = [];
        let todayFinishAward = [];
        if (awardIncrease === true) {
            // Award lanuch activity
            updatedData["awards_launch"] = metaData.awards_launch + 5;
            parseInt(updatedData["awards_launch"]) >= 100 && updateAward.push({
                id: 'awards_launch',
                name: 'Launch',
                point: 500
            })
            if (parseInt(oldBackup["awards_launch"]) < 100 && parseInt(updatedData["awards_launch"]) >= 100) {
                todayFinishAward.push({
                    id: 'awards_launch',
                    name: 'Launch',
                })
            }

        }


        if (improveData.length > 0) {
            improveData.forEach(obj => {
                let objKey = Object.keys(obj)[0];
                switch (objKey) {
                    case "progress_mentaldiet":
                        updatedData["progress_mentaldiet"] = metaData.progress_mentaldiet + obj[objKey];
                        oldBackup["progress_mentaldiet"] = oldBackup.progress_mentaldiet + obj[objKey];
                        break;
                    case "progress_activity":
                        updatedData["progress_activity"] = metaData.progress_activity + obj[objKey];
                        oldBackup["progress_activity"] = oldBackup.progress_activity + obj[objKey];
                        break;
                    case "progress_rest":
                        updatedData["progress_rest"] = metaData.progress_rest + obj[objKey];
                        oldBackup["progress_rest"] = oldBackup.progress_rest + obj[objKey];
                        break;
                    case "progress_nutrition":
                        updatedData["progress_nutrition"] = metaData.progress_nutrition + obj[objKey];
                        oldBackup["progress_nutrition"] = oldBackup.progress_nutrition + obj[objKey];
                        break;
                    case "awards_meditation":
                        updatedData["awards_meditation"] = metaData.awards_meditation + obj[objKey];
                        oldBackup["awards_meditation"] = oldBackup.awards_meditation + obj[objKey];
                        parseInt(updatedData["awards_meditation"]) >= 100 && updateAward.push({
                            id: 'awards_meditation',
                            name: 'Meditation',
                            point: 500
                        })
                        if (parseInt(metaData.awards_meditation) < 100 && parseInt(updatedData["awards_meditation"]) >= 100) {
                            todayFinishAward.push({
                                id: 'awards_meditation',
                                name: 'Meditation',
                            })
                        }
                        break;
                    case "awards_selfconfident":
                        updatedData["awards_selfconfident"] = metaData.awards_selfconfident + obj[objKey];
                        oldBackup["awards_selfconfident"] = oldBackup.awards_selfconfident + obj[objKey];
                        parseInt(updatedData["awards_selfconfident"]) >= 100 && updateAward.push({
                            id: 'awards_selfconfident',
                            name: 'Self Confident',
                            point: 300
                        })
                        if (parseInt(metaData.awards_selfconfident) < 100 && parseInt(updatedData["awards_selfconfident"]) >= 100) {
                            todayFinishAward.push({
                                id: 'awards_selfconfident',
                                name: 'Self Confident',
                            })
                        }
                        break;
                    case "award_braintrain":
                        updatedData["award_braintrain"] = undefineObject(metaData.award_braintrain) + obj[objKey];
                        oldBackup["award_braintrain"] = undefineObject(oldBackup.award_braintrain) + obj[objKey];
                        parseInt(updatedData["award_braintrain"]) >= 100 && updateAward.push({
                            id: 'award_braintrain',
                            name: 'Brain Train',
                            point: 600
                        })
                        if (parseInt(metaData.award_braintrain) < 100 && parseInt(updatedData["award_braintrain"]) >= 100) {
                            todayFinishAward.push({
                                id: 'award_braintrain',
                                name: 'Brain Train',
                            })
                        }
                        break;
                    case "awards_streakgoalmaster":
                        updatedData["awards_streakgoalmaster"] = metaData.awards_streakgoalmaster + obj[objKey];
                        oldBackup["awards_streakgoalmaster"] = oldBackup.awards_streakgoalmaster + obj[objKey];
                        parseInt(updatedData["awards_streakgoalmaster"]) >= 100 && updateAward.push({
                            id: 'awards_streakgoalmaster',
                            name: 'Streak Goal Master',
                            point: 800
                        })
                        if (parseInt(metaData.awards_streakgoalmaster) < 100 && parseInt(updatedData["awards_streakgoalmaster"]) >= 100) {
                            todayFinishAward.push({
                                id: 'awards_streakgoalmaster',
                                name: 'Streak Goal Master',
                            })
                        }
                        break;
                    case "awards_community":
                        updatedData["awards_community"] = undefineObject(metaData.awards_community) + obj[objKey];
                        oldBackup["awards_community"] = undefineObject(oldBackup.awards_community) + obj[objKey];
                        parseInt(updatedData["awards_community"]) >= 100 && updateAward.push({
                            id: 'awards_community',
                            name: 'Communication',
                            point: 1500
                        })
                        if (parseInt(metaData.awards_community) < 100 && parseInt(updatedData["awards_community"]) >= 100) {
                            todayFinishAward.push({
                                id: 'awards_community',
                                name: 'Communication',
                            })
                        }
                        break;

                    default:
                        break;
                }
            })
        }

        //The value never be less then 0
        Object.keys(updatedData).forEach((key) => {
            if (typeof updatedData[key] === 'number') {
                if (updatedData[key] < 0) {
                    updatedData[key] = 0;
                }
            }
        });
        Object.keys(updatedData).map(key => {
            if (key.includes("exercise") || key.includes("at") || key.includes("time")) {
                oldBackup[key] = updatedData[key];
                metaData[key] = updatedData[key];
            }
        });
        //Update old metadata backup
        const metaDataPayload = {
            date: new Date().toDateString(),
            data: oldBackup
        };
        dispatch({
            type: META_DATA_BACKUP,
            payload: metaDataPayload
        });

        dispatch({
            type: SET_META_DATA,
            payload: metaData
        });

        if (todayFinishAward.length !== 0) {
            dispatch({
                type: AWARD_TODAY,
                payload: {
                    awardToday: todayFinishAward,
                    date: moment().format("YYYY-MM-DD")
                }
            });
        }


        let finalObj = getValidMetadata(updatedData);
        let finalObj2 = cloneDeep(finalObj);

        dispatch(updateLevel('todaymotivation', 'Today Motivation', 10, updateAward));

        const path = database().ref(`beefup/user/${getState().user.userDetails.id}/matadata/`);
        return new Promise((resolve, reject) => {
            path.update(finalObj2);
            debugger
            return Promise.all([
                dispatch({
                    type: SET_META_DATA,
                    payload: metaData,
                })
            ]).then(res => {
                dispatch(calculateRewiringProgress());
                dispatch(calculatePornWhyIRelapse());
                dispatch(calculatePornWhenIRelapse());
                dispatch(calculateMasturbationWhenIRelapse());
                dispatch(calculateImprovementByActivity());
            });
            return true
        })


        // return CallApi(Constant.baseUrlV2 + Constant.metaData, 'patch', finalObj, {"Authorization": "Bearer " + getState().user.token})
        //     .then((response) => {
        //         return Promise.all([
        //             dispatch({
        //                 type: SET_META_DATA,
        //                 payload: response.data.data,
        //             })
        //         ]).then(res => {
        //             dispatch(calculateRewiringProgress());
        //             dispatch(calculatePornWhyIRelapse());
        //             dispatch(calculatePornWhenIRelapse());
        //             dispatch(calculateMasturbationWhenIRelapse());
        //             dispatch(calculateImprovementByActivity());
        //         });
        //     })
        //     .catch((error) => {
        //         dispatch(updateMetaDataNoCalculation(updatedData));
        //         return dispatch(apiErrorHandler(error));
        //         // return Promise.reject(error);
        //     })
    };
};

export const updateLevel = (type, name, increase, arr = []) => {
    return (dispatch, getState) => {

        let levelData = getState().metaData.levelData;
        let levelNumber = getState().metaData.levelNumber;

        // alert(levelData[type].point);
        if (levelData[type]) {
            levelData[type].point = parseInt(levelData[type].point) + parseInt(increase);
        } else {
            levelData[type] = {
                date: moment().format("YYYY-MM-DD"),
                point: parseInt(increase),
                title: name
            }
        }

        // IF get array then add multiple value - this value only replace not added
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];

            levelData[obj.id] = {
                date: moment().format("YYYY-MM-DD"),
                point: parseInt(obj.point),
                title: obj.name
            }
        }

        // Level Process
        if (levelData) {
            let arr = []
            let point = 0
            Object.keys(levelData).map(obj => {
                arr.push({'key': obj, date: levelData[obj].date, 'value': levelData[obj]})
                point = point + levelData[obj].point
            });
            const sortedArray = arr.sort((a, b) => new moment(a.date).format('YYYYMMDD') - new moment(b.date).format('YYYYMMDD'))
            dispatch({
                type: LEVEL_LIST,
                payload: sortedArray
            });

            let arrPoint = ConstantValue.levelArray
            let level = 0
            let nextLevel = 0
            let levelPer = 0
            for (let i = 0; i < arrPoint.length - 1; i++) {
                if (arrPoint[i] <= point && arrPoint[i + 1] > point) {
                    level = i + 1;
                    nextLevel = arrPoint[i + 1];

                    let sub = arrPoint[i + 1] - arrPoint[i];
                    let main = point - arrPoint[i];
                    levelPer = (main * 100) / sub;
                    break
                }
            }
            if (point > 4900) {
                level = arrPoint.length
            }

            dispatch({
                type: SET_LEVEL_DATA,
                payload: levelData
            });

            let date = '';
            if (level !== 0 && level !== levelNumber.level) {
                date = moment().format("YYYY-MM-DD");
            } else {
                date = levelNumber.date;
                // date = moment().format("YYYY-MM-DD");
            }

            dispatch({
                type: LEVEL_NUMBER,
                payload: {
                    current_point: point,
                    level: level,
                    next_level: nextLevel,
                    per: levelPer,
                    date: date
                }
            });
        }

        let actualMetaData = cloneDeep(levelData);
        const path = database().ref(`beefup/user/${getState().user.userDetails.id}/level/`);
        return new Promise((resolve, reject) => {
            path.update(actualMetaData)
            return true
        })

    };
};

export const updateOtherUserProfile = (userDetails, data, index = '') => {
    let ref;
    if (index === '') {
        ref = `/apps/${userDetails.appId}/users/${userDetails.userId}/`;
    } else {
        ref = `/apps/${userDetails.appId}/users/${userDetails.userId}/othermember/${index}`;
    }

    // If user not register then
    if (userDetails && userDetails.status && userDetails.status === 'new') {
        ref = `/apps/${userDetails.appId}/notregisteredusers/${userDetails.userId}/`;
    }

    const db = database().ref(ref);
    let dataTemp = cloneDeep(data);

    return new Promise((resolve, reject) => {
        db.update(dataTemp)
        resolve(true)
    })
};

export const addTimeMeditation = (finalArray) => {
    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {
            const db = database().ref(`beefup/user/${getState().user.userDetails.id}/meditation/`);
            let arrData = {data: finalArray}
            let dataTemp = cloneDeep(arrData);

            db.update(dataTemp).then(responseData => {
                // setTimeout(() => {
                //     dispatch(calculatePornDay(arrData));
                // }, 100)
                resolve(true)
            }).catch(err => {
                resolve(false)
            })
        })
    };
};

export const updateMetaDataNoCalculationNew = (metadata, id = null) => {
    return (dispatch, getState) => {
        // let finalObj = getValidMetadata(updatedData);
        const path = database().ref(`beefup/user/${id}/matadata`);

        path.update(cloneDeep(metadata)).then(responseData => {

        }).catch(err => {
            alert(err)
        })
    };
}

export const setCheckupPornDayNew = (checkupDate, isRelapse, isYesterday, email, type) => async (dispatch, getState) => {
    const reqIdentifier = Constant.requestIdentifier.CHECKUP;

    return new Promise((resolve, reject) => {
        let response = getState().user.userDetails["porn-days"] || {data: []}
        let pornData = cloneDeep(response.data);
        let userObj = cloneDeep(getState().user.userDetails);
        if (userObj["porn-days"] === undefined) {
            userObj["porn-days"] = {data: []};
        }
        let arryPorn = pornData;
        let pornObj = {
            is_relapse: isRelapse,
            occurred_at: checkupDate
        };

        let oldPornObject = find(pornData, {occurred_at: checkupDate});
        let objIndex = pornData.indexOf(oldPornObject);
        if (isYesterday) {
            if (oldPornObject) {
                //Found
                oldPornObject.is_relapse = isRelapse;
                oldPornObject.is_resolved = true;

                arryPorn.push(pornObj);
                userObj["porn-days"].data = arryPorn;

                return dispatch(updatePornDay(pornObj, pornData, reqIdentifier, type)).then(res => {

                    dispatch({
                        type: SET_USER_DETAIL,
                        payload: userObj,
                    })
                    resolve(true)
                }).catch(err => {
                    resolve(false)
                });
            } else {
                //not found
                pornObj.is_resolved = true;

                arryPorn.push(pornObj);
                userObj["porn-days"].data = arryPorn;

                return dispatch(addPornDays(pornObj, pornData, reqIdentifier, type)).then(res => {

                    dispatch({
                        type: SET_USER_DETAIL,
                        payload: userObj,
                    })
                    resolve(true)
                }).catch(err => {
                    resolve(false)
                });
                // return dispatch(addPornDays(pornObj, pornData, reqIdentifier, type));
            }
        } else {
            //Manage For today checkup
            //Remaining second to midNight
            let resolvedDelay = ((24 * 3600) - ((new Date().getHours() * 3600) + (new Date().getMinutes() * 60) + new Date().getSeconds()));
            if (resolvedDelay < 0) {
                resolvedDelay = 0;
            }
            if (oldPornObject) {
                //Found
                if (isRelapse) {
                    debugger // remove after only use this
                    pornObj.is_resolved = true;
                    pornObj.is_relapse = true;

                    arryPorn[objIndex] = pornObj;
                    userObj["porn-days"].data = arryPorn;

                    // pornData[index].is_relapse = true;
                    // dispatch(updatePornDay(pornObj, arrPornData, reqIdentifier));
                    return dispatch(updatePornDay(pornObj, pornData, reqIdentifier, type)).then(res => {

                        dispatch({
                            type: SET_USER_DETAIL,
                            payload: userObj,
                        })
                        resolve(true)
                    }).catch(err => {
                        resolve(false)
                    });

                } else {
                    pornObj.resolve_delay = resolvedDelay;
                    pornData.is_resolved = false;

                    arryPorn[objIndex] = pornObj;
                    userObj["porn-days"].data = arryPorn;

                    if (oldPornObject.is_resolved) {
                        // return dispatch(deletePornDay(oldPornObject.id, pornData, reqIdentifier)).then(res => {
                        return dispatch(updatePornDay(pornObj, pornData, reqIdentifier, type)).then(res => {

                            dispatch({
                                type: SET_USER_DETAIL,
                                payload: userObj,
                            })
                            resolve(true)
                        }).catch(err => {
                            resolve(false)
                        });
                        // });
                    } else {
                        oldPornObject.resolve_delay = resolvedDelay;
                        oldPornObject.is_relapse = isRelapse;
                        return dispatch(updatePornDay(oldPornObject, pornData, reqIdentifier, type)).then(res => {

                            dispatch({
                                type: SET_USER_DETAIL,
                                payload: userObj,
                            })

                            resolve(true)
                        }).catch(err => {
                            resolve(false)
                        });
                    }
                }
            } else {
                //getState().user.userDetails
                //not found

                if (isRelapse) {
                    pornObj.is_resolved = true;

                    arryPorn.push(pornObj);
                    userObj["porn-days"].data = arryPorn;

                    return dispatch(addPornDays(pornObj, pornData, reqIdentifier, type)).then(res => {

                        dispatch({
                            type: SET_USER_DETAIL,
                            payload: userObj,
                        })

                        resolve(true)
                    }).catch(err => {
                        resolve(false)
                    });
                } else {
                    pornObj.is_resolved = false;
                    pornObj.resolve_delay = resolvedDelay;

                    arryPorn.push(pornObj);
                    userObj["porn-days"].data = arryPorn;

                    return dispatch(addPornDays(pornObj, pornData, reqIdentifier, type)).then(res => {

                        dispatch({
                            type: SET_USER_DETAIL,
                            payload: userObj,
                        })

                        resolve(true)
                    }).catch(err => {
                        resolve(false)
                    });
                    //Update at midnight
                }
            }
        }
        resolve(false)
    })
}

export const updatedValue = (metadata, key, value, newObj) => {
    if (key in newObj) {
        return newObj[key] + (value);
    }
    if (key in metadata) {
        return metadata[key] + (value);
    }
    return value;
}

//New Checkup
export const setNewCheckupData = (selectedAnswer, isYesterday, checkupDate) => {
    return (dispatch, getState) => {
        try {
            let answerKeys = Object.keys(selectedAnswer);
            let updateAward = false;
            //let metaData = getState().metaData.metaData;
            let metaData = cloneDeep(getState().metaData.metaDataBackup.data);
            if (metaData === undefined || Object.keys(metaData).length === 0) {
                if (Object.keys(getState().metaData.metaData).length > 0) {
                    metaData = cloneDeep(getState().metaData.metaData);
                } else {
                    metaData = cloneDeep(objDefaultMetaData);
                }
            }
            //Use Metadata
            let strDateKey = checkupDate;

            let actualMetaData = cloneDeep(cloneDeep(getState().metaData.metaData));
            if (isYesterday) {
                metaData = actualMetaData;
            } else {
                //Not use backup metadata
                if (actualMetaData.last_checkup_at !== strDateKey) {
                    metaData = actualMetaData;
                    updateAward = true;
                }
            }
            let newMetaData = {};

            // Update Award
            if (updateAward === true) {
                newMetaData.awards_lover = updatedValue(metaData, 'awards_lover', 1, newMetaData);

                let updateAward = []
                parseInt(newMetaData.awards_lover) >= 100 && updateAward.push({
                    id: 'awards_lover',
                    name: 'Lover',
                    point: 700
                })
                dispatch(updateLevel('rateyourday', 'Rate your day', 10, updateAward));
            }

            try {
                if (metaData.progress_selfcompassion && metaData.progress_selfcompassion > ConstantValue.progress_selfcompassion_MaxValue) {
                    metaData.progress_selfcompassion = ConstantValue.progress_selfcompassion_MaxValue
                }
                if (metaData.progress_rest && metaData.progress_rest > ConstantValue.progress_rest_MaxValue) {
                    metaData.progress_rest = ConstantValue.progress_rest_MaxValue
                }
                if (metaData.progress_activity && metaData.progress_activity > ConstantValue.progress_activity_MaxValue) {
                    metaData.progress_activity = ConstantValue.progress_activity_MaxValue
                }
                if (metaData.progress_nutrition && metaData.progress_nutrition > ConstantValue.progress_nutrition_MaxValue) {
                    metaData.progress_nutrition = ConstantValue.progress_nutrition_MaxValue
                }
                if (metaData.progress_mentaldiet && metaData.progress_mentaldiet > ConstantValue.progress_mentaldiet_MaxValue) {
                    metaData.progress_mentaldiet = ConstantValue.progress_mentaldiet_MaxValue
                }
                if (metaData.improvement_attraction && metaData.improvement_attraction > ConstantValue.improvement_attraction_MaxValue) {
                    metaData.improvement_attraction = ConstantValue.improvement_attraction_MaxValue
                }

                answerKeys.forEach(queKey => {
                    let answers = selectedAnswer[queKey];

                    switch (queKey) {
                        case "porn":
                            try {
                                if (answers.isPronfree) {
                                    newMetaData.progress_selfcompassion = updatedValue(metaData, 'progress_selfcompassion', 4, newMetaData);
                                    newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 3, newMetaData);
                                    newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', 3, newMetaData);
                                } else {
                                    newMetaData.progress_selfcompassion = updatedValue(metaData, 'progress_selfcompassion', -(Math.round(metaData.progress_selfcompassion * 0.1)), newMetaData);
                                    newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', -(Math.round(metaData.progress_rest * 0.1)), newMetaData);
                                    newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', -(Math.round(metaData.progress_activity * 0.1)), newMetaData);
                                }
                            } catch (e) {
                                if (__DEV__) {
                                    alert("porn", e)
                                }
                            }
                            break;
                        case "masturbation":
                            try {
                                if (answers.isMasturbationFree) {
                                    newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 1, newMetaData);
                                    answers.optionList.map((obj) => {
                                        if (obj.question === 'TIME') {
                                            if (obj.answer.length > 0) {
                                                obj.answer.map((obj) => {
                                                    if (obj.toLowerCase() === 'Morning'.toLowerCase()) {
                                                        newMetaData.tempted_masturbation_morning = updatedValue(metaData, 'tempted_masturbation_morning', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Afternoon'.toLowerCase()) {
                                                        newMetaData.tempted_masturbation_afternoon = updatedValue(metaData, 'tempted_masturbation_afternoon', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Evening'.toLowerCase()) {
                                                        newMetaData.tempted_masturbation_evening = updatedValue(metaData, 'tempted_masturbation_evening', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Night'.toLowerCase()) {
                                                        newMetaData.tempted_masturbation_night = updatedValue(metaData, 'tempted_masturbation_night', 1, newMetaData);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                } else if (answers.isSetBack) {
                                    answers.optionList.map((obj) => {
                                        if (obj.question === 'TIME') {
                                            if (obj.answer.length > 0) {
                                                obj.answer.map((obj) => {
                                                    if (obj.toLowerCase() === 'Morning'.toLowerCase()) {
                                                        newMetaData.relapse_masturbation_morning = updatedValue(metaData, 'relapse_masturbation_morning', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Afternoon'.toLowerCase()) {
                                                        newMetaData.relapse_masturbation_afternoon = updatedValue(metaData, 'relapse_masturbation_afternoon', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Evening'.toLowerCase()) {
                                                        newMetaData.relapse_masturbation_evening = updatedValue(metaData, 'relapse_masturbation_evening', 1, newMetaData);
                                                    } else if (obj.toLowerCase() === 'Night'.toLowerCase()) {
                                                        newMetaData.relapse_masturbation_night = updatedValue(metaData, 'relapse_masturbation_night', 1, newMetaData);
                                                    }
                                                })
                                            }
                                        }
                                    });
                                }
                            } catch (e) {
                                if (__DEV__) {
                                    alert("masturbation", e)
                                }
                            }
                            break;
                        case "sex":
                            try {
                                answers.map(obj => {
                                    if (obj.question.toLowerCase().includes('attraction')) {
                                        if (obj.isSelected) {
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 1, newMetaData);
                                            newMetaData.improvement_attraction = updatedValue(metaData, 'improvement_attraction', 2, newMetaData);
                                        } else {
                                            newMetaData.improvement_attraction = updatedValue(metaData, 'improvement_attraction', -1, newMetaData);
                                        }
                                    } else if (obj.question.toLowerCase().includes('erections')) {
                                        if (obj.isSelected) {
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 1, newMetaData);
                                        }
                                    } else if (obj.question.toLowerCase().includes('intercourse')) {
                                        //Do nothing
                                    } else if (obj.question.toLowerCase() === 'SEX ENJOYMENT'.toLowerCase()) {
                                        if (obj.answer.toLowerCase() === 'High'.toLowerCase()) {
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 3, newMetaData);
                                        } else if (obj.answer.toLowerCase() === 'Medium'.toLowerCase()) {
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 1, newMetaData);
                                        }
                                    } else if (obj.question.toLowerCase() === 'PORN FANTASY DURING SEX'.toLowerCase()) {
                                        if (obj.answer.toLowerCase() === 'Low'.toLowerCase()) {
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 4, newMetaData);
                                        }
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("sex", e)
                                }
                            }
                            break;
                        case "observation":
                            try {
                                debugger
                                answers.map(obj => {
                                    if (obj.question.toLowerCase() === 'Sexual Attration'.toLowerCase()) {
                                        let value = (obj.answer * 2) / 100
                                        newMetaData.progress_relationships = updatedValue(metaData, 'progress_relationships', value, newMetaData);
                                    } else if (obj.question.toLowerCase() === 'Feel Batter'.toLowerCase()) {
                                        let value = (obj.answer * 2) / 100
                                        newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', value, newMetaData);
                                    } else if (obj.question.toLowerCase() === 'OVERALL DAY QUALITY'.toLowerCase()) {
                                        let value = (obj.answer * 2) / 100
                                        newMetaData.progress_stress = updatedValue(metaData, 'progress_stress', value, newMetaData);
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("observation", e)
                                }
                            }
                            break;
                        case "yourExperience":
                            try {
                                answers.map(obj => {
                                    if (obj.question.toLowerCase() == "Control your mind".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_stress = updatedValue(metaData, 'progress_stress', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Improve your self".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_nutrition = updatedValue(metaData, 'progress_nutrition', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Got some execise".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Healthy eating".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_mentaldiet = updatedValue(metaData, 'progress_mentaldiet', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Connect with friend or family".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_relationships = updatedValue(metaData, 'progress_relationships', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Better sleep".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_nutrition = updatedValue(metaData, 'progress_nutrition', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Meditation".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Self-Improvement".toLowerCase() && obj.isSelected) {
                                        newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', 1, newMetaData);
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("improvement", e)
                                }
                            }
                            break;
                        case "improvement":
                            try {
                                answers.map(obj => {
                                    if (obj.question.toLowerCase() == "High self-confidence".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_confidence = updatedValue(metaData, 'improvement_confidence', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Strong voice".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_voice = updatedValue(metaData, 'improvement_voice', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Feeling energetic".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_energy = updatedValue(metaData, 'improvement_energy', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Clear mind".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_mind = updatedValue(metaData, 'improvement_mind', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Improved sleep".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_sleep = updatedValue(metaData, 'improvement_sleep', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Healthy appearance".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_health = updatedValue(metaData, 'improvement_health', 1, newMetaData);
                                    } else if (obj.question.toLowerCase() == "Feeling alive".toLowerCase() && obj.isSelected) {
                                        newMetaData.improvement_alive = updatedValue(metaData, 'improvement_alive', 1, newMetaData);
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("improvement", e)
                                }
                            }
                            break;
                        case "setBackTime":
                            try {
                                answers.map(obj => {
                                    if (obj.selectedOptions && obj.selectedOptions.length !== 0) {
                                        if (obj.selectedOptions[0].toLowerCase() === 'Morning'.toLowerCase()) {
                                            newMetaData.relapse_porn_morning = updatedValue(metaData, 'relapse_porn_morning', 1, newMetaData);
                                        } else if (obj.selectedOptions[0].toLowerCase() === 'Afternoon'.toLowerCase()) {
                                            newMetaData.relapse_porn_afternoon = updatedValue(metaData, 'relapse_porn_afternoon', 1, newMetaData);
                                        } else if (obj.selectedOptions[0].toLowerCase() === 'Evening'.toLowerCase()) {
                                            newMetaData.relapse_porn_evening = updatedValue(metaData, 'relapse_porn_evening', 1, newMetaData);
                                        } else if (obj.selectedOptions[0].toLowerCase() === 'Night'.toLowerCase()) {
                                            newMetaData.relapse_porn_night = updatedValue(metaData, 'relapse_porn_night', 1, newMetaData);
                                        }
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("improvement", e)
                                }
                            }
                            break;
                        case "setBackPlace":
                            try {
                                answers.map(obj => {
                                    for (let i = 0; i < obj.selectedOptions.length; i++) {
                                        if (obj.selectedOptions[i].toLowerCase() === 'Badroom'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Computer Room'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Bathroom'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Work Place'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Traveling'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'School'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Living Room'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Other'.toLowerCase()) {

                                            newMetaData.progress_selfcompassion = updatedValue(metaData, 'progress_selfcompassion', -0.2, newMetaData);
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', -0.2, newMetaData);
                                            newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', -0.2, newMetaData);
                                            newMetaData.progress_nutrition = updatedValue(metaData, 'progress_nutrition', -0.2, newMetaData);
                                            newMetaData.progress_mentaldiet = updatedValue(metaData, 'progress_mentaldiet', -0.2, newMetaData);
                                            newMetaData.progress_relationships = updatedValue(metaData, 'progress_relationships', -0.2, newMetaData);
                                            newMetaData.progress_stress = updatedValue(metaData, 'progress_stress', -0.2, newMetaData);
                                        }
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("improvement", e)
                                }
                            }
                            break;
                        case "reasonOfSetBack":
                            try {
                                answers.map(obj => {
                                    for (let i = 0; i < obj.selectedOptions.length; i++) {
                                        if (obj.selectedOptions[i].toLowerCase() === 'Family Issue'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Weariness'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'More Stress'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Social Anxiety'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Watching Movie/TV'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Watching online article/video/social media'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Finacial Problem'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Physical Pain'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'No work today'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Spend time mostly alone'.toLowerCase() ||
                                            obj.selectedOptions[i].toLowerCase() === 'Social Media'.toLowerCase()) {

                                            newMetaData.progress_selfcompassion = updatedValue(metaData, 'progress_selfcompassion', -0.2, newMetaData);
                                            newMetaData.progress_rest = updatedValue(metaData, 'progress_rest', -0.2, newMetaData);
                                            newMetaData.progress_activity = updatedValue(metaData, 'progress_activity', -0.2, newMetaData);
                                            newMetaData.progress_nutrition = updatedValue(metaData, 'progress_nutrition', -0.2, newMetaData);
                                            newMetaData.progress_mentaldiet = updatedValue(metaData, 'progress_mentaldiet', -0.2, newMetaData);
                                            newMetaData.progress_relationships = updatedValue(metaData, 'progress_relationships', -0.2, newMetaData);
                                            newMetaData.progress_stress = updatedValue(metaData, 'progress_stress', -0.2, newMetaData);
                                        }
                                    }
                                });
                            } catch (e) {
                                if (__DEV__) {
                                    alert("improvement", e)
                                }
                            }
                            break;

                        default:
                            break;
                    }
                });
                //The value never be less then 0
                Object.keys(newMetaData).forEach((key) => {
                    if (typeof newMetaData[key] === 'number') {
                        if (newMetaData[key] < 0) {
                            newMetaData[key] = 0;
                        }
                    }
                })
                //here set last checkup date
                let todayDate = moment().format('YYYY-MM-DD');
                if (isYesterday) {
                    if (metaData.last_checkup_at) {
                        if (metaData.last_checkup_at !== todayDate) {
                            newMetaData.last_checkup_at = strDateKey;
                        }
                    } else {
                        newMetaData.last_checkup_at = strDateKey;
                    }
                } else {
                    newMetaData.last_checkup_at = strDateKey;
                }
                // delete metaData.registered_at;
                let finalObj = getValidMetadata(newMetaData);
                let aryUpdate = cloneDeep(finalObj);

                return new Promise((resolve, reject) => {
                    const db = database().ref(`beefup/user/${getState().user.userDetails.id}/matadata/`);

                    db.update(aryUpdate).then(responseData => {

                        let obj = getState().user.userDetails;
                        let metaData = obj.matadata;
                        Object.keys(finalObj).forEach(key => {
                            metaData[key] = finalObj[key];
                        });
                        obj.matadata = metaData;

                        dispatch({
                            type: SET_META_DATA,
                            payload: metaData
                        });


                        Promise.all([
                            dispatch({
                                type: SET_USER_DETAIL,
                                payload: obj,
                            })
                        ]).then(res => {
                            dispatch(getPornDaysNew(false, true, null, obj))
                            dispatch(calculateRewiringProgress());
                            dispatch(calculatePornWhyIRelapse());
                            dispatch(calculatePornWhenIRelapse());
                            dispatch(calculateMasturbationWhenIRelapse());
                            dispatch(calculateImprovementByActivity());
                        });

                        resolve(true)
                    }).catch(err => {
                        resolve(false)
                    })
                })

            } catch (e) {
                if (__DEV__) {
                    alert(e);
                }
            }
        } catch (e) {
            if (__DEV__) {
                alert(e)
            }
            alert("Something went wrong.");
            return Promise.reject(e);
        }
    };
};

//Custom reson while checkup - relapse Porn
export const getPornRelapseReason = () => {
    return (dispatch, getState) => {
        let newKey = null;
        try {
            let metaData = getState().metaData.metaData;
            let metaDataKeys = Object.keys(metaData);
            let defalutKeys = filter(metadataAppKeys, function (o) {
                return o.includes('relapse_porn_') && !o.includes("relapse_porn_morning")
                    && !o.includes("relapse_porn_afternoon") && !o.includes("relapse_porn_evening") && !o.includes("relapse_porn_night")
            });
            let newObj = filter(metaDataKeys, function (o) {
                return o.includes('relapse_porn_') && !o.includes("relapse_porn_morning")
                    && !o.includes("relapse_porn_afternoon") && !o.includes("relapse_porn_evening") && !o.includes("relapse_porn_night")
            });
            newKey = [{str: "Anxiety"},
                {str: "Boredom"},
                {str: "Stress"},
                {str: "Arousal"},
                {str: "Pain"},
                {str: "Tiredness"},
                {str: "Loneliness"}];
            newObj.forEach(obj => {
                if (!defalutKeys.includes(obj)) {
                    let newWord = manageSingleWord(obj, 'relapse_porn_');
                    if (newWord) {
                        newKey = [...newKey, {str: newWord}];
                    }
                }
            });
            newKey = [...newKey, {str: "Add a new trigger"},];
            return Promise.resolve(newKey);
        } catch (e) {
            return Promise.resolve(newKey);
            if (__DEV__) {
                alert(e)
            }
        }
    }
}

//Custom reson while checkup - tempted Porn
export const getPornTemptedReason = () => {
    return (dispatch, getState) => {
        let newKey = null;
        try {
            let metaData = getState().metaData.metaData;
            let metaDataKeys = Object.keys(metaData);
            let defalutKeys = filter(metadataAppKeys, function (o) {
                return o.includes('tempted_porn_') && !o.includes("tempted_porn_morning")
                    && !o.includes("tempted_porn_afternoon") && !o.includes("tempted_porn_evening") && !o.includes("tempted_porn_night")
            });
            let newObj = filter(metaDataKeys, function (o) {
                return o.includes('tempted_porn_') && !o.includes("tempted_porn_morning")
                    && !o.includes("tempted_porn_afternoon") && !o.includes("tempted_porn_evening") && !o.includes("tempted_porn_night")
            });
            newKey = [{str: "Anxiety"},
                {str: "Boredom"},
                {str: "Stress"},
                {str: "Arousal"},
                {str: "Pain"},
                {str: "Tiredness"},
                {str: "Loneliness"}];
            newObj.forEach(obj => {
                if (!defalutKeys.includes(obj)) {
                    let newWord = manageSingleWord(obj, 'tempted_porn_');
                    if (newWord) {
                        newKey = [...newKey, {str: newWord}];
                    }
                }
            });
            newKey = [...newKey, {str: "Add a new trigger"}];
            return Promise.resolve(newKey);
        } catch (e) {
            return Promise.resolve(newKey);
            if (__DEV__) {
                alert(e)
            }
        }
    }
}

//End checkup

//Calculate Rewiring progress and total
export const calculateRewiringProgress = () => {
    return (dispatch, getState) => {
        try {

            let metaData = getState().metaData.metaData;
            if (metaData == undefined || Object.keys(metaData).length == 0) {
                //metaData =  cloneDeep(objDefaultMetaData);
                return;
            }
            let perselfcompassion = Math.floor(4 + ((metaData.progress_selfcompassion / ConstantValue.progress_selfcompassion_MaxValue) * 96));
            let perprogress_rest = Math.floor(4 + ((metaData.progress_rest / ConstantValue.progress_rest_MaxValue) * 96));
            let progress_activity = Math.floor(4 + ((metaData.progress_activity / ConstantValue.progress_activity_MaxValue) * 96));
            let progress_nutrition = Math.floor(4 + ((metaData.progress_nutrition / ConstantValue.progress_nutrition_MaxValue) * 96));
            let progress_mentaldiet = Math.floor(4 + ((metaData.progress_mentaldiet / ConstantValue.progress_mentaldiet_MaxValue) * 96));
            let progress_relationships = Math.floor(4 + ((metaData.progress_relationships / ConstantValue.progress_relationships_MaxValue) * 96));
            let progress_stress = Math.floor(4 + ((metaData.progress_stress / ConstantValue.progress_stress_MaxValue) * 96));
            let progress_level = Math.floor(4 + ((metaData.progress_level / ConstantValue.progress_level_MaxValue) * 96));

            let aperselfcompassion = Math.floor((metaData.progress_selfcompassion / ConstantValue.progress_selfcompassion_MaxValue) * 100);
            let aperprogress_rest = Math.floor((metaData.progress_rest / ConstantValue.progress_rest_MaxValue) * 100);
            let aprogress_activity = Math.floor((metaData.progress_activity / ConstantValue.progress_activity_MaxValue) * 100);
            let aprogress_nutrition = Math.floor((metaData.progress_nutrition / ConstantValue.progress_nutrition_MaxValue) * 100);
            let aprogress_mentaldiet = Math.floor((metaData.progress_mentaldiet / ConstantValue.progress_mentaldiet_MaxValue) * 100);
            let aprogress_relationships = Math.floor((metaData.progress_relationships / ConstantValue.progress_relationships_MaxValue) * 100);
            let aprogress_stress = Math.floor((metaData.progress_stress / ConstantValue.progress_stress_MaxValue) * 100);
            let aprogress_level = Math.floor((metaData.progress_level / ConstantValue.progress_level_MaxValue) * 100);

            perselfcompassion = (perselfcompassion > 100) && 100 || perselfcompassion;
            perprogress_rest = (perprogress_rest > 100) && 100 || perprogress_rest;
            progress_activity = (progress_activity > 100) && 100 || progress_activity;
            progress_nutrition = (progress_nutrition > 100) && 100 || progress_nutrition;
            progress_mentaldiet = (progress_mentaldiet > 100) && 100 || progress_mentaldiet;
            progress_relationships = (progress_relationships > 100) && 100 || progress_relationships;
            progress_stress = (progress_stress > 100) && 100 || progress_stress;
            progress_level = (progress_level > 100) && 100 || progress_level;

            aperselfcompassion = (aperselfcompassion > 100) && 100 || aperselfcompassion;
            aperprogress_rest = (aperprogress_rest > 100) && 100 || aperprogress_rest;
            aprogress_activity = (aprogress_activity > 100) && 100 || aprogress_activity;
            aprogress_nutrition = (aprogress_nutrition > 100) && 100 || aprogress_nutrition;
            aprogress_mentaldiet = (aprogress_mentaldiet > 100) && 100 || aprogress_mentaldiet;
            aprogress_relationships = (aprogress_relationships > 100) && 100 || aprogress_relationships;
            aprogress_stress = (aprogress_stress > 100) && 100 || aprogress_stress;
            aprogress_level = (aprogress_level > 100) && 100 || aprogress_level;

            let rewiringProgress = [
                {
                    progressName: "self compassion", progressPer: perselfcompassion + "%",
                    fillColor: "rgb(5,195,249)", key: "Desensitation", actualPer: aperselfcompassion + "%"
                },
                {
                    progressName: "Rest",
                    progressPer: perprogress_rest + "%", fillColor: "rgb(239,76,129)", key: "Dopamine",
                    actualPer: aperprogress_rest + "%"
                },
                {
                    progressName: "Activity",
                    progressPer: progress_activity + "%", fillColor: "rgb(251,176,67)", key: "Hypofrontality",
                    actualPer: aprogress_activity + "%"
                },
                {
                    progressName: "Nutrition",
                    progressPer: progress_nutrition + "%", fillColor: "rgb(121,112,255)", key: "Stress",
                    actualPer: aprogress_nutrition + "%"
                },
                {
                    progressName: "Mentaldiet",
                    progressPer: progress_mentaldiet + "%", fillColor: "rgb(91,196,189)", key: "Wisdom",
                    actualPer: aprogress_mentaldiet + "%"
                },
                {
                    progressName: "Relationships",
                    progressPer: progress_relationships + "%", fillColor: "rgb(91,196,189)", key: "Wisdom",
                    actualPer: aprogress_relationships + "%"
                },
                {
                    progressName: "Stress",
                    progressPer: progress_stress + "%", fillColor: "rgb(91,196,189)", key: "Wisdom",
                    actualPer: aprogress_stress + "%"
                },
                {
                    progressName: "Level",
                    progressPer: progress_level + "%", fillColor: "rgb(91,196,189)", key: "Wisdom",
                    actualPer: aprogress_level + "%"
                },
            ];
            let aTotal = Math.round(Math.floor(((aperselfcompassion + aperprogress_rest + aprogress_activity + aprogress_nutrition + aprogress_mentaldiet + aprogress_relationships + aprogress_stress + aprogress_level) / 500) * 100));
            let cirularPer = 2 + (aTotal * 0.98);

            if (getState().statistic.totalRewiringPercentage != aTotal ||
                getState().statistic.circularRewiringPercentage != cirularPer) {
                dispatch({
                    type: TOTAL_REWIRING_PERCENTAGE,
                    payload: {
                        totalRewiringPercentage: aTotal,
                        circularRewiringPercentage: cirularPer
                    }
                });
            }

            // setTimeout(()=>{
            dispatch(manageRewiredProgressPopup(false, false, true,
                {totalRewiringPercentage: aTotal, circularRewiringPercentage: cirularPer}));
            // },800);


            // Level Process
            let levelData = getState().metaData.levelData;
            let levelNumber = getState().metaData.levelNumber;

            dispatch({
                type: SET_LEVEL_DATA,
                payload: levelData
            });
            if (levelData) {
                let arr = []
                let point = 0
                Object.keys(levelData).map(obj => {
                    arr.push({'key': obj, date: levelData[obj].date, 'value': levelData[obj]})
                    point = point + levelData[obj].point
                });
                const sortedArray = arr.sort((a, b) => new moment(a.date).format('YYYYMMDD') - new moment(b.date).format('YYYYMMDD'))
                dispatch({
                    type: LEVEL_LIST,
                    payload: sortedArray
                });

                let arrPoint = ConstantValue.levelArray
                let level = 0
                let nextLevel = 0
                let levelPer = 0
                for (let i = 0; i < arrPoint.length - 1; i++) {
                    if (arrPoint[i] <= point && arrPoint[i + 1] > point) {
                        level = i + 1;
                        nextLevel = arrPoint[i + 1];

                        let sub = arrPoint[i + 1] - arrPoint[i];
                        let main = point - arrPoint[i];
                        levelPer = (main * 100) / sub;
                        break
                    }
                }
                if (point > 4900) {
                    level = arrPoint.length
                }

                dispatch({
                    type: LEVEL_NUMBER,
                    payload: {
                        current_point: point,
                        level: level,
                        next_level: nextLevel,
                        per: levelPer,
                        date: levelNumber.date || ''
                    }
                });
            }

            // case LEVEL_LIST
            // case LEVEL_NUMBER
            return dispatch({
                type: SET_REWIRING_BARS,
                payload: rewiringProgress
            });
            // if(JSON.stringify(getState().metaData.rewiringProgress) !== JSON.stringify(rewiringProgress)){
            //     return dispatch({
            //         type: SET_REWIRING_BARS,
            //         payload: rewiringProgress
            //     });
            // }
        } catch (e) {
            console.log(e);
        }
        return;
    }
};

//porn - Why I relapse and tempted
getCalculatedObjWhy = (strKey, metaData) => {
    try {
        let keys = Object.keys(metaData);
        let newReplaseObj = filter(keys, function (o) {
            return o.includes(strKey) && !o.includes(strKey + "morning")
                && !o.includes(strKey + "afternoon") && !o.includes(strKey + "evening") && !o.includes(strKey + "night")
        });
        let whyRelapse = [];
        let totalRelapses = 0;
        newReplaseObj.forEach(obj => {
            totalRelapses += metaData[obj];
        });
        newReplaseObj.forEach(obj => {
            let key = manageSingleWord(obj, strKey);
            let keyObj = {
                key: key,
                total: getPrecentage(metaData[obj], totalRelapses)
            };
            if (obj == (strKey + "bored") || obj == (strKey + "stress") || obj == (strKey + "anxiety")
                || obj == (strKey + "tired") || obj == (strKey + "alone") || obj == (strKey + "pain")
                || obj == (strKey + "horny")) {
                whyRelapse.push(keyObj);
            } else {
                if (metaData[obj] > 0) {
                    whyRelapse.push(keyObj);
                }
            }
        });
        whyRelapse = sortBy(whyRelapse, obj => obj.total).reverse();
        return whyRelapse;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const calculatePornWhyIRelapse = () => {
    return (dispatch, getState) => {
        try {
            let metaData = getState().metaData.metaData;
            let whyRelapse = getCalculatedObjWhy("relapse_porn_", metaData);
            if (whyRelapse && JSON.stringify(getState().statistic.pornWhyIRelapse) != JSON.stringify(whyRelapse)) {
                return dispatch({
                    type: PORN_WHY_RELAPSE,
                    payload: whyRelapse
                });
            }
            //Why I tempted
            let whyTempted = getCalculatedObjWhy("tempted_porn_", metaData);
            if (whyTempted && JSON.stringify(getState().statistic.pornWhyITempted) != JSON.stringify(whyTempted)) {
                return dispatch({
                    type: PORN_WHY_TEMPTED,
                    payload: whyTempted
                });
            }
        } catch (e) {
            console.log(e);
        }
        return;
    }
};

//porn - When I relapse, stressed and tempted
export const calculatePornWhenIRelapse = () => {
    return (dispatch, getState) => {
        try {
            let metaData = getState().metaData.metaData;
            if (metaData == undefined || Object.keys(metaData).length == 0) {
                metaData = cloneDeep(objDefaultMetaData);
            }
            let totalRelapses = metaData.relapse_porn_morning + metaData.relapse_porn_afternoon
                + metaData.relapse_porn_evening + metaData.relapse_porn_night;
            let whenRelapse = {
                Morning: getPrecentage(metaData.relapse_porn_morning, totalRelapses),
                Afternoon: getPrecentage(metaData.relapse_porn_afternoon, totalRelapses),
                Evening: getPrecentage(metaData.relapse_porn_evening, totalRelapses),
                Night: getPrecentage(metaData.relapse_porn_night, totalRelapses),
            };
            if (JSON.stringify(getState().statistic.pornWhenIRelapse) != JSON.stringify(whenRelapse)) {
                dispatch({
                    type: PORN_WHEN_RELAPSE,
                    payload: whenRelapse
                });
            }
            //Calculate when stressed
            let totalStressed = metaData.stressed_morning + metaData.stressed_afternoon
                + metaData.stressed_evening + metaData.stressed_night;
            let stressed = {
                Morning: getPrecentage(metaData.stressed_morning, totalStressed),
                Afternoon: getPrecentage(metaData.stressed_afternoon, totalStressed),
                Evening: getPrecentage(metaData.stressed_evening, totalStressed),
                Night: getPrecentage(metaData.stressed_night, totalStressed),
            };
            if (JSON.stringify(getState().statistic.pornWhenIStressed) != JSON.stringify(stressed)) {
                return dispatch({
                    type: PORN_WHEN_STRESSED,
                    payload: stressed
                });
            }
            //Calculate I When I Tempted
            let temptedObj = {
                tempted_porn_morning: 0,
                tempted_porn_afternoon: 0,
                tempted_porn_evening: 0,
                tempted_porn_night: 0,
            }
            let totalTempted = 0;
            Object.keys(temptedObj).map(obj => {
                if (metaData[obj]) {
                    temptedObj[obj] = metaData[obj];
                    totalTempted += metaData[obj];
                }
            });

            let whenTempted = {
                Morning: getPrecentage(temptedObj.tempted_porn_morning, totalTempted),
                Afternoon: getPrecentage(temptedObj.tempted_porn_afternoon, totalTempted),
                Evening: getPrecentage(temptedObj.tempted_porn_evening, totalTempted),
                Night: getPrecentage(temptedObj.tempted_porn_night, totalTempted),
            };
            if (JSON.stringify(getState().statistic.pornWhenITempted) != JSON.stringify(whenTempted)) {
                dispatch({
                    type: PORN_WHEN_TEMPTED,
                    payload: whenTempted
                });
            }
        } catch (e) {
            console.log(e);
        }
        return;
    }
};

//Masturbation - When I relapse and tempted
export const calculateMasturbationWhenIRelapse = () => {
    return (dispatch, getState) => {
        try {

            let metaData = getState().metaData.metaData;

            if (metaData == undefined || Object.keys(metaData).length == 0) {
                metaData = cloneDeep(objDefaultMetaData);
            }
            let totalRelapses = metaData.relapse_masturbation_morning + metaData.relapse_masturbation_afternoon
                + metaData.relapse_masturbation_evening + metaData.relapse_masturbation_night;
            let whenRelapse = {
                Morning: getPrecentage(metaData.relapse_masturbation_morning, totalRelapses),
                Afternoon: getPrecentage(metaData.relapse_masturbation_afternoon, totalRelapses),
                Evening: getPrecentage(metaData.relapse_masturbation_evening, totalRelapses),
                Night: getPrecentage(metaData.relapse_masturbation_night, totalRelapses),
            };
            if (JSON.stringify(getState().statistic.masturbationWhenIRelapse) != JSON.stringify(whenRelapse)) {
                return dispatch({
                    type: M_WHEN_RELAPSE,
                    payload: whenRelapse
                });
            }
            //Calculate I When I Tempted
            let temptedObj = {
                tempted_masturbation_morning: 0,
                tempted_masturbation_afternoon: 0,
                tempted_masturbation_evening: 0,
                tempted_masturbation_night: 0,
            }
            let totalTempted = 0;
            Object.keys(temptedObj).map(obj => {
                if (metaData[obj]) {
                    temptedObj[obj] = metaData[obj];
                    totalTempted += metaData[obj];
                }
            });

            let whenTempted = {
                Morning: getPrecentage(temptedObj.tempted_masturbation_morning, totalTempted),
                Afternoon: getPrecentage(temptedObj.tempted_masturbation_afternoon, totalTempted),
                Evening: getPrecentage(temptedObj.tempted_masturbation_evening, totalTempted),
                Night: getPrecentage(temptedObj.tempted_masturbation_night, totalTempted),
            };
            if (JSON.stringify(getState().statistic.pornWhenITempted) != JSON.stringify(whenTempted)) {
                dispatch({
                    type: M_WHEN_TEMPTED,
                    payload: whenTempted
                });
            }
        } catch (e) {
            console.log(e);
        }
        return;
    }
};

getPrecentage = (val, total) => {
    if (total <= 0) {
        return 0;
    }
    return Math.round(Math.floor(val / total * 100));
};

//Rewiring- calculate Improvement progress bar
export const calculateImprovementByActivity = () => {
    return (dispatch, getState) => {
        let metaData = getState().metaData.metaData;
        if (metaData == undefined || Object.keys(metaData).length == 0) {
            metaData = cloneDeep(objDefaultMetaData);
        }
        let improvementPercentage = [
            {
                icon: (Math.round(4 + (metaData.improvement_mind / ConstantValue.improvement_mind_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "mind",
                progressPer: Math.round(4 + (metaData.improvement_mind / ConstantValue.improvement_mind_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_mind / ConstantValue.improvement_mind_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_mind / ConstantValue.improvement_mind_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_energy / ConstantValue.improvement_energy_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "energy",
                progressPer: Math.round(4 + (metaData.improvement_energy / ConstantValue.improvement_energy_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_energy / ConstantValue.improvement_energy_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_energy / ConstantValue.improvement_energy_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_attraction / ConstantValue.improvement_attraction_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "attraction",
                progressPer: Math.round(4 + (metaData.improvement_attraction / ConstantValue.improvement_attraction_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_attraction / ConstantValue.improvement_attraction_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_attraction / ConstantValue.improvement_attraction_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_sleep / ConstantValue.improvement_sleep_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "sleep",
                progressPer: Math.round(4 + (metaData.improvement_sleep / ConstantValue.improvement_sleep_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_sleep / ConstantValue.improvement_sleep_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_sleep / ConstantValue.improvement_sleep_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_voice / ConstantValue.improvement_voice_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "voice",
                progressPer: Math.round(4 + (metaData.improvement_voice / ConstantValue.improvement_voice_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_voice / ConstantValue.improvement_voice_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_voice / ConstantValue.improvement_voice_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_health / ConstantValue.improvement_health_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "health",
                progressPer: Math.round(4 + (metaData.improvement_health / ConstantValue.improvement_health_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_health / ConstantValue.improvement_health_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_health / ConstantValue.improvement_health_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_confidence / ConstantValue.improvement_confidence_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "confidence",
                progressPer: Math.round(4 + (metaData.improvement_confidence / ConstantValue.improvement_confidence_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_confidence / ConstantValue.improvement_confidence_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_confidence / ConstantValue.improvement_confidence_MaxValue) * 100) + "%"
            },
            {
                icon: (Math.round(4 + (metaData.improvement_alive / ConstantValue.improvement_alive_MaxValue) * 96) >= 100) && "Y" || "B",
                val: "alive",
                progressPer: Math.round(4 + (metaData.improvement_alive / ConstantValue.improvement_alive_MaxValue) * 96) + "%",
                valPer: Math.round(4 + (metaData.improvement_alive / ConstantValue.improvement_alive_MaxValue) * 96),
                actualPer: Math.round((metaData.improvement_alive / ConstantValue.improvement_alive_MaxValue) * 100) + "%"
            },
        ];
        // let improvementPercentage = {
        //     mind: Math.round(4 + (metaData.improvement_mind/10)*96) + "%",
        //     energy: Math.round(4 + (metaData.improvement_energy/10)*96) + "%",
        //     attraction: Math.round(4 + (metaData.improvement_attraction/10)*96) + "%",
        //     sleep: Math.round(4 + (metaData.improvement_sleep/10)*96) + "%",
        //     voice: Math.round(4 + (metaData.improvement_voice/10)*96) + "%",
        //     health: Math.round(4 + (metaData.improvement_health/10)*96) + "%",
        //     confidence: Math.round(4 + (metaData.improvement_confidence/10)*96) + "%",
        //     alive: Math.round(4 + (metaData.improvement_alive/10)*96) + "%",
        // };

        if (JSON.stringify(getState().metaData.improvementPercentage) != JSON.stringify(improvementPercentage)) {
            return dispatch({
                type: IMPROVEMEMT_PERCENTAGE,
                payload: improvementPercentage
            });
        }
        return;
    }
};

//Add new checkup question
export const addNewCheckupQuestion = (allquestion) => {
    return (dispatch, getState) => {
        return dispatch({
            type: ADD_NEW_CHECKUP_QUESTION,
            payload: allquestion
        });
    }
};


//Set Morning routine
export const setMorningRoutine = (morningRoutine) => {
    return (dispatch, getState) => {
        if (JSON.stringify(getState().metaData.morningRoutine) != JSON.stringify(morningRoutine)) {
            return dispatch({
                type: SET_MORNING_ROUTINE,
                payload: morningRoutine
            });
        }
        return;
    }
};

//On complete morning routine
export const setCompletedMorningRoutine = (pageName) => {
    return (dispatch, getState) => {
        let today = new Date().toDateString();
        let morningRoutine = getState().metaData.morningRoutine;
        let completedMorningRoutine = getState().metaData.completedMorningRoutine.routineActivities;
        let completedObj = find(morningRoutine, {pageName: pageName});
        if (completedObj != undefined) {
            if (completedMorningRoutine.indexOf(completedObj) < 0) {
                completedMorningRoutine.push(completedObj);
            }
        } else {
            completedMorningRoutine = [];
        }
        return dispatch({
            type: SET_DONE_MORNING_ROUTINE,
            payload: {
                completedDate: today,
                routineActivities: completedMorningRoutine
            }
        });
    }
};

export const onCompletedMorningRoutine = (pageName) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SET_DONE_MORNING_ROUTINE,
            payload: {
                completedDate: new Date().toDateString(),
                routineActivities: []
            }
        });
    }
};

//SET SELECTED OPTIONAL EXERCISES
export const setSelectedOptionalExercises = (optionalExercises) => {
    return (dispatch, getState) => {
        return dispatch({
            type: SET_SELECTED_OPTIONAL_EXERCISES,
            payload: optionalExercises
        });
    }
};

//SET SELECTED TODAY SCREEN EXERCISES
export const setSelectedTodayExercises = (todayExercises) => {
    return (dispatch, getState) => {
        return dispatch({
            type: TODAY_SCREEN_EXERCISES,
            payload: todayExercises
        });
    }
};

//set meditation time
export const setMeditationTime = (meditationTime, isCallApi = true) => {
    return (dispatch, getState) => {
        dispatch({
            type: MEDITATION_TIME,
            payload: meditationTime
        });
        if (isCallApi) {
            dispatch(updateMetaData({meditation_time: meditationTime}));
        }
        return Promise.resolve(true);
    }
};

//SET SELECTED TODAY SCREEN EXERCISES
export const setExcesiseDone = (todayExercises) => {
    return (dispatch, getState) => {
        return dispatch({
            type: TODAY_EXERCISE,
            payload: todayExercises
        });
    }
};

export const resetPornData = (UserId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = `beefup/user/${UserId}/porn-days`;
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
