import {
    TRAINING_LIST,
    SLEEP_MEDITATION_LIST
} from './types'

import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import {findIndex, find, filter, groupBy, indexOf, cloneDeep, sortBy, uniqBy} from 'lodash';
import {calculateJournal} from "./statisticAction";
import {apiErrorHandler} from "./userActions";
// import {app} from "../helper/firebaseConfig";
import {getTimeFromMS} from "../helper/appHelper";
import database from '@react-native-firebase/database';

const db = database()
const pageSize = 5


// Get Feed
export const getFeed = () => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/training`)

        ref.once('value', function (snapshot) {
            if (snapshot.val() !== null) {

                let arr = [];
                Object.entries(snapshot.val()).map((data, index) => {

                    if (data[0]) {
                        const originalFeedObj = data[1]
                        originalFeedObj.title = data[0]
                        // sorting comments

                        arr.push(originalFeedObj)
                    }
                });

                resolve({
                    payload: arr,
                    getFeedStatus: 'fail'
                })

                dispatch({
                    type: TRAINING_LIST,
                    payload: arr,
                    getFeedStatus: 'true'
                });
            }
        }, (err) => {
            dispatch({
                type: TRAINING_LIST,
                payload: [],
                getFeedStatus: 'fail'
            });

            reject({
                status: 400,
                error
            })
        })
    })
}

export const updateFeed = (key, trainingID, updateObject) => async (dispatch) => {

    let ref = database().ref(`beefup/user/${key}/training/${trainingID}`)

    return new Promise((resolve, reject) => {
        return ref.set(cloneDeep(updateObject)).then((result) => {
            resolve(true)
        }).catch(error => {
            resolve(false)
        })
    })
}

export const getSleepmeditation = () => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/sleepmeditation`)

        debugger
        ref.once('value', function (snapshot) {
            debugger
            if (snapshot.val() !== null) {

                let arr = [];
                Object.entries(snapshot.val()).map((data, index) => {

                    if (data[0]) {
                        const originalFeedObj = data[1]
                        // sorting comments

                        arr.push(originalFeedObj)
                    }
                });

                resolve({
                    payload: arr,
                    getFeedStatus: 'fail'
                })

                dispatch({
                    type: SLEEP_MEDITATION_LIST,
                    payload: arr,
                    getFeedStatus: 'true'
                });
            }
        }, (err) => {
            dispatch({
                type: SLEEP_MEDITATION_LIST,
                payload: [],
                getFeedStatus: 'fail'
            });

            reject({
                status: 400,
                error
            })
        })
    })
}
