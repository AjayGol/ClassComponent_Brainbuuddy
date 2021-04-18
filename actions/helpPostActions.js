import {
    HELP_POST_LIST,
    HELP_SORT_TYPE,
    HELP_PAGINATION_POST_LIST,
    HELP_POST_COMMENT_LIST,
    HELP_POST_COMMENT_PAGINATION_LIST, ADVICE_POST_COMMENT_LIST,
    LIST_FEED, LIST_FEED_ADVICE, LIST_FEED_DAILY_DISCUSSION, LIST_FEED_MESSAGE_BOARD,
    MY_FEED,
    CATEGORY_FILTER,
    USER_LEADERBOARD, DAILY_DISCUSSION, ADMIN_LIST,
} from './types'

import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import {findIndex, find, filter, groupBy, indexOf, cloneDeep, sortBy, uniqBy, isEqual, orderBy} from 'lodash';
import {calculateJournal} from "./statisticAction";
import {apiErrorHandler} from "./userActions";
// import {app} from "../helper/firebaseConfig";
import {getTimeFromMS} from "../helper/appHelper";
import Routine from "../screens/today/component/routineComponent";
import React from "react";
import moment from "moment";
import database from '@react-native-firebase/database';
import {debug} from "react-native-reanimated";

const db = database();
const pageSize = 10;
const pageSizeBig = 15;

export const sortHelpPostRecent = (sortType) => {
    return (dispatch, getState) => {
        //let adviceList = getState().advice.adviceList;
        dispatch({
            type: HELP_PAGINATION_POST_LIST,
            payload: null
        });
        let apiUrl = Constant.baseUrlV2 + Constant.helpPostPagination;

        if (sortType == "new") {
            apiUrl = apiUrl + '?sort_by=most_recent'
        } else if (sortType == "top") {
            apiUrl = apiUrl + '?sort_by=most_commented'
        } else {
            apiUrl = apiUrl + '?sort_by=hottest'
        }

        // if (flag) {
        //     apiUrl = apiUrl + '?sort_by=most_commented';
        // }
        dispatch({
            type: HELP_SORT_TYPE,
            payload: sortType,
        });
    }
};

export const sortHelpPost = (flag, helpPostList) => {
    return (dispatch, getState) => {
        // let helpPostList = getState().helpPost.helpPostList;
        if (flag) {
            dispatch({
                type: HELP_POST_LIST,
                payload: sortBy(helpPostList, obj => obj.comments.count).reverse(),
            });
        } else {
            dispatch({
                type: HELP_POST_LIST,
                payload: sortBy(helpPostList, obj => obj.id).reverse(),
            });
        }
        return dispatch({
            type: HELP_SORT_TYPE,
            payload: flag,
        });
    };
};

// Get Feed
export const getFeed = (pageNumber, key = "", category = 'help', subcategory = 'top', startAt = 0, endAt = 0, isAdmin = false) => async (dispatch, getState) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/communication/${category}/feed`);
        /*
        https://howtofirebase.com/collection-queries-with-firebase-b95a0193745d
         */

        if (subcategory === "top") {
            // this.refValue = ref.orderByChild('commentCount').startAt(startAt).endAt(endAt)

            if (key === "") {
                this.refValue = ref.orderByChild("commentCount").limitToLast(pageSizeBig)
            }else{
                this.refValue = ref.orderByChild("commentCount").limitToLast(pageSizeBig).endAt(key)
            }
            // ref.orderByChild("commentCount")
            //     .limitToLast(3)
            //     .endAt(8)
            //     .once("value")
            //     .then(function(snapshot){
            //         debugger
            //         console.log(snap.val());
            //     })
        } else {
            console.log(`API Calling : ${`beefup/communication/${category}/feed`} EndKey=${key}`)

            if (key === "") {
                this.refValue = ref.orderByValue().limitToLast(pageSize)
            } else {
                this.refValue = ref.orderByKey().endAt(key).limitToLast(pageSize)
            }
        }

        /*
            ref.orderByChild("commentCount")
            .limitToLast(3)
            .endAt(8)
            .once("value")
            .then(function(snapshot){
                debugger
                console.log(snap.val());
            })
             */
        this.refValue.once('value').then(function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                Object.entries(snapshot.val()).map((data, index) => {

                    if (key && (key !== data[0]) || pageNumber === 1 || subcategory === 'top') {
                        const originalFeedObj = data[1]
                        originalFeedObj.id = data[0]
                        // sorting comments

                        if (originalFeedObj.comments !== undefined) {
                            const originalComments = originalFeedObj.comments
                            const commentIds = Object.keys(originalComments)
                            const comments = []
                            for (let i = 0; i < commentIds.length; i++) {
                                comments.push(originalComments[commentIds[i]])
                            }
                            comments.sort((a, b) => {
                                return a.created_at - b.created_at
                            })
                            originalFeedObj.comments = comments
                        }

                        if (originalFeedObj.media && originalFeedObj.media.length !== 0) {
                            const mediaList = originalFeedObj.media[originalFeedObj.id];
                            const keyValue = Object.keys(mediaList);
                            const mediaObj = mediaList[keyValue[0]];
                            if (mediaObj.mediaType === "videos") {
                                originalFeedObj.videoPaused = true
                                originalFeedObj.videoMuted = true
                            }
                        }
                        if (originalFeedObj.text && originalFeedObj.url_preview) {
                            LinkPreview.getPreview(originalFeedObj.text).then(data => {
                                originalFeedObj.linkPreviewData = data
                            })
                                .catch(error => {
                                    console.log('error while creating link preview', err)
                                })
                        }

                        // Get Time Step
                        if (originalFeedObj.created_at) {
                            originalFeedObj.time = getTimeFromMS(originalFeedObj.created_at)
                        }

                        feed.push(originalFeedObj)
                    }
                })

                if (subcategory === "top") {
                    feed.sort((a, b) => {
                        return b.commentCount - a.commentCount
                    })
                }else {
                    feed.sort((a, b) => {
                        return b.created_at - a.created_at
                    })
                }

                // end pagination
                if (subcategory === "top") {
                    if (feed.length + 1 !== pageSizeBig && feed.length !== pageSizeBig) {
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
                }else {
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
                }
            } else {
                reject({
                    status: 100,
                    value: "nodata"
                })
            }
        }, (err) => {
            if (isAdmin === false) {
                if (category === 'help') {
                    dispatch({
                        type: LIST_FEED,
                        payload: [],
                        getFeedStatus: 'fail'
                    });
                } else if (category === 'youradvice') {
                    dispatch({
                        type: LIST_FEED_ADVICE,
                        payload: [],
                        getFeedStatus: 'fail'
                    });
                } else if (category === 'dailydiscussion') {
                    dispatch({
                        type: LIST_FEED_DAILY_DISCUSSION,
                        payload: [],
                        getFeedStatus: 'fail'
                    });
                } else if (category === 'messageboard') {
                    dispatch({
                        type: LIST_FEED_MESSAGE_BOARD,
                        payload: [],
                        getFeedStatus: 'fail'
                    });
                }
            }

            reject({
                status: 400,
                error
            })
        })
    })
}

export const postFeed = (data, category = 'help') => async (dispatch) => {
    category = category.replace(/ /g, '')

    let ref = database().ref(`beefup/communication/${category}/feed`)

    const key = ref.push().key
    data.feedId = key

    data.media = {}
    data.likes = {}

    debugger
    return new Promise((resolve, reject) => {
        return ref.child(key).set(cloneDeep(data)).then((result) => {
            // postImage(key, media)

            resolve(key)
            // })
        })
            .catch(error => {
                apiErrorHandler(error)
                reject(false)
            })
    })
}

export const editFeed = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: LIST_FEED,
            payload: feed
        });
        return Promise.resolve('');
    }
}

export const editFeedAdvice = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: LIST_FEED_ADVICE,
            payload: feed
        });
        return Promise.resolve('');
    }
}

export const editFeedDailyDiscussion = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: LIST_FEED_DAILY_DISCUSSION,
            payload: feed
        });
        return Promise.resolve('');
    }
}

export const editFeedMessageBoard = (feed) => {
    return (dispatch, getState) => {
        dispatch({
            type: LIST_FEED_MESSAGE_BOARD,
            payload: feed
        });
        return Promise.resolve('');
    }
}


export const onLikeFeed = (like, feedId, userDetails, category = 'help') => async (dispatch) => {
    category = category.replace(/ /g, '')

    let path = `beefup/communication/${category}/feed/` + feedId;

    var ref = db.ref(path);
    var isAdd = false;
    var likesRef = ref.child('likes');

    return new Promise((resolve, reject) => {
        likesRef.once('value')
            .then(snapshot => {
                var likes = snapshot.val() || {};
                var likeIds = Object.keys(likes)
                isAdd = likeIds.indexOf(userDetails.id) === -1;
                if (isAdd) {
                    likes[userDetails.id] = true;
                } else {
                    delete likes[userDetails.id];
                }
                likesRef.set(likes)
                    .then(() => {
                        var likesByUserRef = ref.child('likes_by_user').child(userDetails.id);
                        var userName;
                        if (isAdd) {
                            userName = userDetails.name;
                        } else {
                            userName = null;
                        }
                        return likesByUserRef.set(userName);
                    })
            })
            .then(() => {
                if (isAdd) {
                    // eventFeedMessageLike(event_id, post_id, user_id).then((res) => {
                    //
                    // }).catch((error) => {
                    //
                    // }).finally(() => {
                    //     resolve({
                    //         status: 200
                    //     })
                    // });
                    resolve(true)
                } else {
                    resolve({
                        status: 200
                    })
                    resolve(true)
                }
            })

            .catch(error => {
                resolve(true)
            })
    })
}

export const onUnLikeFeed = (like, feedId, userDetails, category = 'help') => async (dispatch) => {
    category = category.replace(/ /g, '')

    let path = `beefup/communication/${category}/feed/` + feedId;

    var ref = db.ref(path);
    var isAdd = false;
    var likesRef = ref.child('unlikes');

    return new Promise((resolve, reject) => {
        likesRef.once('value')
            .then(snapshot => {
                var likes = snapshot.val() || {};
                var likeIds = Object.keys(likes)
                isAdd = likeIds.indexOf(userDetails.id) === -1;
                if (isAdd) {
                    likes[userDetails.id] = true;
                } else {
                    delete likes[userDetails.id];
                }
                likesRef.set(likes)
                    .then(() => {
                        var likesByUserRef = ref.child('unlikes_by_user').child(userDetails.id);
                        var userName;
                        if (isAdd) {
                            userName = userDetails.name;
                        } else {
                            userName = null;
                        }
                        return likesByUserRef.set(userName);
                    })
            })
            .then(() => {
                if (isAdd) {
                    resolve(true)
                } else {
                    resolve({
                        status: 200
                    })
                    resolve(true)
                }
            })

            .catch(error => {
                resolve(true)
            })
    })
}

export const addComment = (data, feedId, category = 'help', comment = []) => async (dispatch) => {
    category = category.replace(/ /g, '')

    let path = `beefup/communication/${category}/feed/` + feedId + '/comments'

    var ref = db.ref(path)
    const key = ref.push().key;
    data.id = key;

    return new Promise((resolve, reject) => {
        ref.child(key).set(cloneDeep(data))
            .then(() => {
                resolve(key)
            })
            .catch(error => {
                reject('')
            })
    });
};

export const updateCommentValue = (data, feedId, category = 'help', comment = []) => async (dispatch) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {
        const path = `beefup/communication/${category}/feed/${feedId}`;
        const db = database().ref(path);

        return db.update({
            commentCount: cloneDeep(comment.length)
        })
    })

}

export const onLikeCommentFeed = (like, feedId, userDetails, commentid, type = '', category = 'help') => async (dispatch) => {
    category = category.replace(/ /g, '')

    let path = `beefup/communication/${category}/feed/` + feedId + `/comments/${commentid}`
    if (type !== '') {
        path = `/apps/${userDetails.appId}/public/events_data/feednews/${type}/` + feedId + `/comments/${commentid}`
    }

    var ref = db.ref(path)
    var isAdd = false;
    var likesRef = ref.child('likes');

    return new Promise((resolve, reject) => {
        likesRef.once('value')
            .then(snapshot => {
                var likes = snapshot.val() || {};
                var likeIds = Object.keys(likes)
                isAdd = likeIds.indexOf(userDetails.id) === -1;
                if (isAdd) {
                    likes[userDetails.id] = true;
                } else {
                    delete likes[userDetails.id];
                }
                likesRef.set(likes)
                    .then(() => {
                        var likesByUserRef = ref.child('likes_by_user').child(userDetails.id);
                        var userName;
                        if (isAdd) {
                            userName = userDetails.name;
                        } else {
                            userName = null;
                        }
                        return likesByUserRef.set(userName);
                    })
            })
            .then(() => {
                if (isAdd) {
                    // eventFeedMessageLike(event_id, post_id, user_id).then((res) => {
                    //
                    // }).catch((error) => {
                    //
                    // }).finally(() => {
                    //     resolve({
                    //         status: 200
                    //     })
                    // });
                    resolve(true)
                } else {
                    resolve({
                        status: 200
                    })
                    resolve(true)
                }
            })

            .catch(error => {
                resolve(true)
            })
    })
}

export const editCategory = (category, subcategory) => {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_FILTER,
            payload: category,
            payload2: subcategory
        });
        return Promise.resolve('');
    }
}

export const deleteFeed = (key, category = 'help') => async (dispatch) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {
        let path = `beefup/communication/${category}/feed/${key}`
        var ref = database().ref(path)

        ref.remove().then(() => {
            resolve(true)
        }).catch((error) => {
            resolve(false)
        });
    })
}

export const reportInappropriate = (key, category = 'help', feed) => async (dispatch) => {
    category = category.replace(/ /g, '')
    let feed2 = cloneDeep(feed);
    return new Promise((resolve, reject) => {
        const path = `beefup/communication/${category}/feed/${key}`;
        const db = database().ref(path);

        resolve(feed2.approprite && parseInt(feed2.approprite) + 1 || 1)
        return db.update({
            approprite: feed2.approprite && parseInt(feed2.approprite) + 1 || 1
        })
    })

}

export const getLeaderBoard = (pageNumber,) => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/user/`)
        /*
        https://howtofirebase.com/collection-queries-with-firebase-b95a0193745d
         */

        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                let arr = []
                Object.entries(snapshot.val()).map((data, index) => {
                    try {
                        let total = 0;
                        Object.entries(data[1]["level"]).map((data2, index) => {
                            total = total + data2[1]["point"];
                        })
                        arr.push({
                            id: data[1]["id"],
                            name: data[1]["name"],
                            level: total,
                            avatar_id: data[1]["avatar_id"],
                        })

                    } catch (e) {

                    }
                })

                //Filter array by point
                const sortedActiveTiles = orderBy(arr, 'level', ['desc']);

                dispatch({
                    type: USER_LEADERBOARD,
                    payload: sortedActiveTiles,
                    getFeedStatus: 'fail'
                });
                return Promise.resolve('');
            }
        }, (err) => {
            return Promise.resolve('');
        })
    })
}

export const getUserPost = (pageNumber, userId: '', category = 'help', key = "", subcategory = 'top', startAt = 0, endAt = 0,
) => async (dispatch, getState) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/communication/${category}/feed`)

        this.refValue = ref.orderByChild("user_id").equalTo(userId);
        this.refValue.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                Object.entries(snapshot.val()).map((data, index) => {

                    if (key && (key !== data[0]) || pageNumber === 1 || subcategory === 'top') {
                        const originalFeedObj = data[1]
                        originalFeedObj.id = data[0]
                        // sorting comments

                        if (originalFeedObj.comments !== undefined) {
                            const originalComments = originalFeedObj.comments
                            const commentIds = Object.keys(originalComments)
                            const comments = []
                            for (let i = 0; i < commentIds.length; i++) {
                                comments.push(originalComments[commentIds[i]])
                            }
                            comments.sort((a, b) => {
                                return a.created_at - b.created_at
                            })
                            originalFeedObj.comments = comments
                        }

                        if (originalFeedObj.media && originalFeedObj.media.length !== 0) {
                            const mediaList = originalFeedObj.media[originalFeedObj.id];
                            const keyValue = Object.keys(mediaList);
                            const mediaObj = mediaList[keyValue[0]];
                            if (mediaObj.mediaType === "videos") {
                                originalFeedObj.videoPaused = true
                                originalFeedObj.videoMuted = true
                            }
                        }
                        if (originalFeedObj.text && originalFeedObj.url_preview) {
                            LinkPreview.getPreview(originalFeedObj.text).then(data => {
                                originalFeedObj.linkPreviewData = data
                            })
                                .catch(error => {
                                    console.log('error while creating link preview', err)
                                })
                        }

                        // Get Time Step
                        if (originalFeedObj.created_at) {
                            originalFeedObj.time = getTimeFromMS(originalFeedObj.created_at)
                        }

                        originalFeedObj.typeCategory = category;
                        feed.push(originalFeedObj)
                    }
                })
                feed.sort((a, b) => {
                    return b.created_at - a.created_at
                })

                resolve(feed)

            } else {
                resolve([])
            }
        }, (err) => {
            resolve([])
        })
    })
}

export const getSingleFeed = (id: '', category = 'help') => async (dispatch, getState) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/communication/${category}/feed/${id}`)

        ref.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                const originalFeedObj = snapshot.val()
                originalFeedObj.id = snapshot.val().feedId
                // sorting comments

                if (originalFeedObj.comments !== undefined) {
                    const originalComments = originalFeedObj.comments
                    const commentIds = Object.keys(originalComments)
                    const comments = []
                    for (let i = 0; i < commentIds.length; i++) {
                        comments.push(originalComments[commentIds[i]])
                    }
                    comments.sort((a, b) => {
                        return a.created_at - b.created_at
                    })
                    originalFeedObj.comments = comments
                }

                if (originalFeedObj.media && originalFeedObj.media.length !== 0) {
                    const mediaList = originalFeedObj.media[originalFeedObj.id];
                    const keyValue = Object.keys(mediaList);
                    const mediaObj = mediaList[keyValue[0]];
                    if (mediaObj.mediaType === "videos") {
                        originalFeedObj.videoPaused = true
                        originalFeedObj.videoMuted = true
                    }
                }
                if (originalFeedObj.text && originalFeedObj.url_preview) {
                    LinkPreview.getPreview(originalFeedObj.text).then(data => {
                        originalFeedObj.linkPreviewData = data
                    })
                        .catch(error => {
                            console.log('error while creating link preview', err)
                        })
                }

                // Get Time Step
                if (originalFeedObj.created_at) {
                    originalFeedObj.time = getTimeFromMS(originalFeedObj.created_at)
                }

                originalFeedObj.typeCategory = category;

                resolve(originalFeedObj)

            } else {
                resolve([])
            }
        }, (err) => {
            resolve(feed)
        })
    })
}

export const getTodayDiscussion = (category = 'dailydiscussion') => async (dispatch, getState) => {
    category = category.replace(/ /g, '')

    return new Promise((resolve, reject) => {

        const ref = db.ref(`beefup/communication/${category}/feed`)

        this.refValue = ref.orderByValue().limitToLast(1)

        this.refValue.once('value', function (snapshot) {
            const feed = []
            if (snapshot.val() !== null) {

                Object.entries(snapshot.val()).map((data, index) => {

                    const originalFeedObj = data[1]
                    originalFeedObj.id = data[0]

                    if (originalFeedObj.comments !== undefined) {
                        const originalComments = originalFeedObj.comments
                        const commentIds = Object.keys(originalComments)
                        const comments = []
                        for (let i = 0; i < commentIds.length; i++) {
                            comments.push(originalComments[commentIds[i]])
                        }
                        comments.sort((a, b) => {
                            return a.created_at - b.created_at
                        })
                        originalFeedObj.comments = comments
                    }

                    if (originalFeedObj.media && originalFeedObj.media.length !== 0) {
                        const mediaList = originalFeedObj.media[originalFeedObj.id];
                        const keyValue = Object.keys(mediaList);
                        const mediaObj = mediaList[keyValue[0]];
                        if (mediaObj.mediaType === "videos") {
                            originalFeedObj.videoPaused = true
                            originalFeedObj.videoMuted = true
                        }
                    }
                    if (originalFeedObj.text && originalFeedObj.url_preview) {
                        LinkPreview.getPreview(originalFeedObj.text).then(data => {
                            originalFeedObj.linkPreviewData = data
                        })
                            .catch(error => {
                                console.log('error while creating link preview', err)
                            })
                    }

                    // Get Time Step
                    if (originalFeedObj.created_at) {
                        originalFeedObj.time = getTimeFromMS(originalFeedObj.created_at)
                    }

                    originalFeedObj.dateToday = moment().format("YYYY-MM-DD");
                    feed.push(originalFeedObj)
                })
                feed.sort((a, b) => {
                    return b.created_at - a.created_at
                })

                dispatch({
                    type: DAILY_DISCUSSION,
                    payload: feed,
                    getFeedStatus: 'success'
                });

            }
        }, (err) => {
            dispatch({
                type: DAILY_DISCUSSION,
                payload: [],
                getFeedStatus: 'fail'
            });
        })
    })
}


export const onAdminListGet = () => async (dispatch, getState) => {

    return new Promise((resolve, reject) => {

        const ref = db.ref(`/beefup/testuser`)

        ref.once('value', function (snapshot) {
            if (snapshot.val() !== null) {

                let arrMain = snapshot.val().user || []

                dispatch({
                    type: ADMIN_LIST,
                    payload: arrMain,
                    getFeedStatus: 'sucess'
                });

                resolve(true)

            } else {
                resolve([])
            }
        }, (err) => {
            resolve(false)
        })
    })
}
