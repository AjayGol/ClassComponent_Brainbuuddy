import {
    TEAM_DETAIL,
    TEAM_MEMBER_ARRAY,
    TEAM_CHAT_MESSAGE_ARRAY,
    INDIVIDUAL_LEADER_BOARD,
    USER_USERNAME_EDIT,
    TEAM_LEADER_BOARD,
    TEAM_ACHIEVEMENT_DETAILS,
    TEAM_CHAT_PAGINATION,
    ENCOURAGE_POPUP,
    TEAM_ACHIEVEMENTES,
    TEAM_ACHIEVEMENTES_PAGINATION,
    TEAM_CHAT_DISPLAY_LIST, CONGRATULATE_POPUP,
    TEAM_MEMBER_EVENT_DETAILS,
    TEAM__MEMBER_EVENT_PAGINATION_DETAILS,
    MEMBER_DETAIL,
    USER_EVENT_DETAILS,
    USER_EVENT_PAGINATION_DETAILS, GLOBAL_STATISCTIC, SEEN_USER_EVENTS, APP_BADGE_COUNT, EVENT_BADGE_COUNT,
    START_EVENT_VIEWS,
    SET_CURRENT_USER_DATA, TEAM_LIST, TEAM__LIST_PAGINATION, INVITE_LIST, INVITE_LIST_PAGINATION, ADVICE_POST_LIST,
    ADVICE_PAGINATION_POST_LIST, TEAM_LIST_SORT_TYPE, TUTORIAL_TAB3,
    TEAM_TODAY_MOTIVATION_DONE,
    TEAM_CHAT_GET_MESSAGE, APP_SET_USER_DATA
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import {find, filter, groupBy, indexOf, cloneDeep, sortBy, uniqBy, remove, flatMap, max} from 'lodash';
import {apiErrorHandler, manageAppBadgeCount, updateUserDetail, manageData, loadDataAfterLoginNew} from "./userActions";
import AppConstant from '../helper/constant';
import {AsyncStorage} from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import moment from 'moment';
// import {app} from "../helper/firebaseConfig";
import {getTimeFromMS} from "../helper/appHelper";
import {EventRegister} from "react-native-event-listeners";
import database from '@react-native-firebase/database';

const db = database();
const pageSize = 20;

function compare(a, b) {
    const genreA = (a.porn_free_days.total != undefined) && a.porn_free_days.total || a.porn_free_days.counts.total;
    const genreB = (b.porn_free_days.total != undefined) && b.porn_free_days.total || b.porn_free_days.counts.total;
    let comparison = 0;
    if (genreA < genreB) {
        comparison = 1;
    } else if (genreA > genreB) {
        comparison = -1;
    }
    return comparison;
}

// Get Feed
export const getTeamNew = (pageNumber, key = "") => async (dispatch, getState) => {
    // category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/team`)

        // console.log(`API Calling : ${`beefup/communication/${category}/feed`} EndKey=${key}`)

        if (key === "") {
            this.refValue = ref.orderByValue().limitToFirst(pageSize)
        } else {
            this.refValue = ref.orderByKey().startAt(key).limitToFirst(pageSize + 1)
        }

        // this.refValue = ref.orderByChild('titlename').equalTo("Rocks")

        this.refValue.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                Object.entries(snapshot.val()).map((data, index) => {

                    if (key && (key !== data[0]) || pageNumber === 1) {
                        // const originalFeedObj = data[1]
                        // originalFeedObj.id = data[0]

                        feed.push(data[1])
                    }
                })
                feed.sort((a, b) => {
                    return a.id - b.id
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
            reject({
                status: 400,
                error
            })
        })
    })
}

export const editFeed = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: TEAM_LIST,
            payload: feed
        });
        return Promise.resolve('');
    }
}

//Get User Events
export const manageSeenEvents = (id) => {
    return (dispatch, getState) => {
        let seenUserEvents = getState().team.seenUserEvents;
        if (seenUserEvents.indexOf(id) < 0) {
            seenUserEvents.push(id)
        }
        return dispatch({
            type: SEEN_USER_EVENTS,
            payload: cloneDeep(seenUserEvents),
        })
    };
};

//Manage Activity Event badge count
export const manageActivityEventBadgeCount = (count) => {
    return (dispatch, getState) => {
        return dispatch({
            type: EVENT_BADGE_COUNT,
            payload: cloneDeep(count)
        });
    }
};

//Global statisctic
export const getGlobalStatistic = () => {
    return (dispatch, getState) => {
        let callUrl = Constant.baseUrlV2 + Constant.globals;
        return CallApi(callUrl, 'get', {}, {"Authorization": "Bearer " + getState().user.token})
            .then((response) => {
                dispatch({
                    type: GLOBAL_STATISCTIC,
                    payload: response.data,
                });
                return Promise.resolve(response);
            }).catch((err) => {
                return dispatch(apiErrorHandler(err));
            })
    }
};

//Managed from which activty need to start views
export const manageStartEventViews = (activityId) => {
    return (dispatch, getState) => {
        return dispatch({
            type: START_EVENT_VIEWS,
            payload: activityId
        });
    }
};

export const getAllTeamMember = (userId) => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/team/`)
        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {
                resolve(snapshot.val())
            }
        }, (err) => {
            return Promise.resolve('');
        })
    })
}

export const jointTeam = (key, updateObject) => async (dispatch) => {
    return new Promise((resolve, reject) => {
        const path = `beefup/team/${key}`;
        const db = database().ref(path);

        db.update(cloneDeep(updateObject)).then(responseData => {
            resolve(true)
        }).catch(err => {
            resolve(true)
        })
    })
}

export const updateTeamIDFormUser = (metadata, id) => async (dispatch) => {
    return new Promise((resolve, reject) => {
        // let finalObj = getValidMetadata(updatedData);
        const path = db.ref(`beefup/user/${id}/`);

        path.update({teamID: cloneDeep(metadata)}).then(responseData => {
            resolve(true)
        }).catch(err => {
            alert(err)
        })
    })
}

export const getTeamListNew = (getId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/team/${getId}/`)
        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                let responseData = snapshot.val();
                dispatch(updateTeamInfo(responseData));
                dispatch(manageTeamMember(snapshot.val()));
                resolve(true)
            }
        }, (err) => {
            return Promise.resolve('');
        })
    });
};

export const updateTeamInfo = (responseData) => {
    return (dispatch, getState) => {
        try {
            if (responseData.members) {
                delete responseData.members;
            }

            if (JSON.stringify(getState().team.teamDetail) !== JSON.stringify(responseData)) {
                dispatch({
                    type: TEAM_DETAIL,
                    payload: responseData,
                });
            }
        } catch (e) {

        }
    }
}

export const getUserSubDetail2 = (userId, data, index) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const ref = db.ref(`beefup/user/${userId}/`)
        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {
                let teamData = cloneDeep(getState().team.memberArray);
                teamData[index].avatar_id = snapshot.val().avatar_id;
                let value = manageData(snapshot.val());
                teamData[index].porn_free_days = {
                    "total": value.totalFree && value.totalFree.length || 0,
                    "longest_streak": value.best_Streak || 0,
                    "current_streak": value.current_Streak || 0,
                    "total_relapse": value.totalRelapce && value.totalRelapce.length || 0,
                };
                teamData[index].midnight_of_last_checkup_at = value.isPopUpRelapse || false;
                teamData[index].isCongratulation = value.isCongratulation || false;
                teamData[index].playerID = snapshot.val().playerID || 0;
                teamData[index].teamNotification = snapshot.val().teamNotification || "1";
                dispatch({
                    type: TEAM_MEMBER_ARRAY,
                    payload: teamData,
                });
                setTimeout(() => {
                    EventRegister.emit('teamUpdate', true);
                }, 200)
                resolve(true)
            }
        }, (err) => {
            return Promise.resolve('');
        })
    })
}

//Code here
export const manageTeamMember = (value) => {
    return (dispatch, getState) => {
        let data = getState().user.userDetails.id || null;
        let playerID = getState().user.userDetails.playerID || 0;

        let teamData = getState().team.memberArray;
        for (let i = 0; i < value.members.length; i++) {
            if (value.members[i].id === data) {
                value.members[i].name = getState().user.userDetails.name || '';
                value.members[i].avatar_id = getState().user.userDetails.avatar_id || '';
                value.members[i].is_current_user = true;
                value.members[i].porn_free_days = {
                    "total": getState().statistic.pornDetail.total_p_clean_days || 0,
                    "longest_streak": getState().statistic.pornDetail.best_p_clean_days || 0,
                    "current_streak": getState().statistic.pornDetail.current_p_clean_days || 0
                };
                value.members[i].midnight_of_last_checkup_at = "";
                value.members[i].playerID = playerID;
                value.members[i].teamNotification = "0";
            } else {
                let indexGet = -1;
                if (teamData && teamData !== 0) {
                    let obj = find(teamData, {id: value.members[i].id});
                    if (obj) {
                        let objIndex = teamData.indexOf(obj);
                        if (objIndex > -1) {
                            indexGet = objIndex
                        }
                    }
                }

                if (indexGet !== -1) {
                    value.members[i] = teamData[indexGet];
                } else {
                    value.members[i].avatar_id = 0;
                    value.members[i].is_current_user = false;
                    value.members[i].porn_free_days = {
                        "total": 0,
                        "longest_streak": 0,
                        "current_streak": 0
                    };
                    value.members[i].midnight_of_last_checkup_at = data;
                    value.members[i].playerID = '';
                    value.members[i].teamNotification = "0";
                }
            }
        }
        dispatch({
            type: TEAM_MEMBER_ARRAY,
            payload: value.members,
        });

        // for (let i = 0; i < value.members.length; i++) {
        //     if (value.members[i].id === data) {
        //     }else{
        //         dispatch(getUserSubDetail2(value.members[i].id, value, i));
        //     }
        // }
    }
};

export const getCurrentTeam = (teamId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/team/${teamId}`)
        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {
                resolve(snapshot.val())
            }
        }, (err) => {
            return Promise.resolve('');
        })
    })
}

export const updateCurrentTeam = (teamId, updateObject) => async (dispatch) => {
    return new Promise((resolve, reject) => {
        const ref = db.ref(`beefup/team/${teamId}`)

        ref.update(cloneDeep(updateObject)).then(responseData => {
            resolve(true)
        }).catch(err => {
            resolve(true)
        })
    })

}

export const updateTeamList = (value = '') => {
    return (dispatch, getState) => {
        dispatch({
            type: TEAM_MEMBER_ARRAY,
            payload: value
        });
        return Promise.resolve(true);
    };
};

export const sendNotification = (userID, obj) => async (dispatch) => {

    try {
        var ref = db.ref(`beefup/notification/${userID}`)
        const key = ref.push().key;

        return new Promise((resolve, reject) => {
            ref.child(key).set(cloneDeep(obj))
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

export const upadateTodayMotivationAction = (arr) => {
    return (dispatch, getState) => {
        dispatch({
            type: TEAM_TODAY_MOTIVATION_DONE,
            payload: arr
        });
        return Promise.resolve(true);
    };
};

export const getMessageListner = (chatId) => async (dispatch, getState) => {
    const ref2 = database()
        .ref('beefup/chat/' + `${chatId}` + '' + '/chat')
        .orderByKey()
        .limitToLast(1)

    ref2.on('value', (snapshot) => {
        if (snapshot.val() !== null) {
            Object.entries(snapshot.val()).map((data, index) => {

                if (data.length > 1) {
                    EventRegister.emit('getmessage', data[1]);
                }
            })
        }
        dispatch({
            type: TEAM_CHAT_GET_MESSAGE,
            payload: ref2.path
        })
    });
}

export const addMessageTeamChat = (objMessage, messageType = "", userDetails, chatId, type = '',
                                   days = '') => {
    return (dispatch, getState) => {

        let bestColor = AppConstant.bestColor[0];
        let bestDarkColor = AppConstant.bestDarkColor[0];
        let cognr = AppConstant.congratulationEmoji[0];
        try {
            bestColor = AppConstant.bestColor[Math.floor(Math.random() * (AppConstant.bestColor.length - 1))];
            bestDarkColor = AppConstant.bestDarkColor[Math.floor(Math.random() * (AppConstant.bestDarkColor.length - 1))];
            cognr = AppConstant.congratulationEmoji[Math.floor(Math.random() * (AppConstant.congratulationEmoji.length - 1))];
        } catch (e) {

        }

        if (type === 'motivation' || type === 'congratulation') {
            bestColor = '#FFF';
            bestDarkColor = '#FFF';
        }

        let data = {
            "content": objMessage,
            "occurred_at": new Date().getTime(),
            "isNew": 'true',
            "creator": {
                "id": userDetails.id,
                "name": userDetails.name,
                "avatar_id": userDetails.avatar_id,
                "is_current_user": true,
            },
            type: type,
            days: days,
            color: bestColor,
            colorDark: bestDarkColor,
            congratulationEmoji: cognr,
        }

        const ref = database().ref('beefup/chat/' + `${chatId}` + '' + '/chat')
        const key = ref.push().key;
        data.id = key

        return new Promise((resolve, reject) => {
            ref.child(key).set(cloneDeep(data))
                .then(() => {
                    resolve(cloneDeep(data))
                })
                .catch(error => {
                    reject('')
                })
        });
    };
};

export const getTeamChat = (pageNumber, key = "", userDetails, chatId) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {

        const ref = database().ref('beefup/chat/' + `${chatId}` + '' + '/chat')
        console.log(`API Calling : ${'beefup/chat/' + `${chatId}` + '/chat'} EndKey=${key}`)

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
                        } catch (e) {
                        }

                        // sorting comments

                        feed.push(originalFeedObj)
                    }
                })
                feed.sort((a, b) => {
                    return b.occurred_at - a.occurred_at
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
                type: TEAM_CHAT_DISPLAY_LIST,
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

export const editFeed2 = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: TEAM_CHAT_DISPLAY_LIST,
            payload: feed,
        });
        return Promise.resolve('');
    }
}

export const checkTeamAvailble = (teamId) => async (dispatch, getState) => {
    const db = database().ref('beefup/privateteam/feed').orderByChild("privateTeamID").equalTo(parseInt(teamId))

    return new Promise((resolve, reject) => {
        return db.once('value', snapshot => {
            if (snapshot.val()) {
                const snap = Object.entries(snapshot.val())
                if (snap.length !== 0) {
                    try {
                        const data = snap[snap.length - 1];
                        let value = data[1];
                        resolve(value)
                    }catch (e) {
                        reject(false)
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

export const jointPrivateTeam = (data) => async (dispatch) => {

    let ref = database().ref(`beefup/privateteam/feed`)

    const key = ref.push().key;
    data.feedId = key;

    const newKey = cloneDeep(key);
    return new Promise((resolve, reject) => {
        return ref.child(key).set(cloneDeep(data)).then((result) => {

            resolve(newKey)
        })
            .catch(error => {
                reject(false)
            })
    })
}

export const deletePrivateTeam = (teamID) => async (dispatch) => {

    return new Promise((resolve, reject) => {
        debugger
        let path = `beefup/privateteam/feed/${teamID}`
        var ref = database().ref(path)

        ref.remove().then(() => {
            resolve(true)
        }).catch((error) => {
            resolve(false)
        });
    })
}
