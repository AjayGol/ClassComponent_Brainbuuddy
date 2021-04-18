import {
    CONGRATULATE_POPUP, ENCOURAGE_POPUP,
    PROFESSIONAL_CHAT_DISPLAY_LIST,
    PROFESSIONAL_CHAT_MESSAGE_ARRAY,
    PROFESSIONAL_CHAT_PAGINATION,
    SET_USER_TOKEN,
    START_LOADING, TEAM_CHAT_DISPLAY_LIST, TEAM_CHAT_MESSAGE_ARRAY,
    PROFESSIONAL_USER_LIST
} from './types'
import React, { Component, useState, useContext, useEffect } from 'react';
import {AsyncStorage, Linking, NativeModules, Alert, Platform} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {CallApi, checkForRechability} from '../services/apiCall'
import Constant from '../services/apiConstant'
import {cloneDeep, filter, find, sortBy, uniqBy} from "lodash";
import {apiErrorHandler, manageAppBadgeCount} from "./userActions";
import AppConstant from "../helper/constant";
import PushNotificationIOS from "@react-native-community/push-notification-ios/js/index";

export const listProfessional = () => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.professionalListing,'get',{},{"Authorization": token})
            .then((response)=>{
                dispatch({
                    type: PROFESSIONAL_USER_LIST,
                    payload: response.data,
                });

                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            })
    };
};

export const requestToProfessionalUser = (professionalId) => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.requestToProfessionalUser,'post',{professional_id: professionalId},{"Authorization": token})
            .then((response)=>{
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject((error && error.response && error.response.data) && error.response.data || "");
            })


    };
};

export const getRendomProfessional = () => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.requestToRandomUser,'get',{},{"Authorization": token})
            .then((response)=>{
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject((error && error.response && error.response.data) && error.response.data || "");
            })
    };
};

export const currentUserSeassion = () => {
    return (dispatch, getState) => {

        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.userProfessionCurrentStatus,'get',{},{"Authorization": token})
            .then((response)=>{
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject(error);
            })
    };
};

export const getprofessionChat = (teamID = '1') => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"

        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.professionTeamchatPagination+teamID+'/posts', 'get', {}, {"Authorization": token})
            .then((response) => {

                let teamChat = response.data && response.data.chat_post || {};

                let obj = cloneDeep(response);
                delete obj['data'];
                delete obj['data'];
                teamChat = uniqBy(teamChat, 'id');
                teamChat = sortBy(teamChat, obj => obj.id);

                return Promise.all([
                    dispatch({
                        type: PROFESSIONAL_CHAT_DISPLAY_LIST,
                        payload: teamChat
                    }),
                    dispatch({
                        type: PROFESSIONAL_CHAT_MESSAGE_ARRAY,
                        payload: teamChat.reverse(),
                    }),
                    dispatch({
                        type: PROFESSIONAL_CHAT_PAGINATION,
                        payload: obj
                    }),
                ]).then(res => {
                    return Promise.resolve(response.data && response.data.latest_session ||  "");
                });
            })
            .catch((error) => {
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const requestcancelRequestByuser= (professionalId) => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.cancelRequestByUser+professionalId,'delete',{},{"Authorization": token})
            .then((response)=>{
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject((error && error.response && error.response.data) && error.response.data || "");
            })
    };
};


export const addProfessionChat = (objMessage, chatID = 3) => {
    return (dispatch, getState) => {

        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"

        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.professionTeamchatSendMessage+chatID+'/posts', 'post', objMessage,
            {"Authorization": token})
            .then((response) => {
                try{

                    let teamChatDisplayList = cloneDeep(getState().professional.professionalChatDisplayList) || [];
                    teamChatDisplayList.splice(0, 0, response.data.data);

                    dispatch({
                        type: PROFESSIONAL_CHAT_DISPLAY_LIST,
                        payload: teamChatDisplayList
                    })

                }catch (e){
                    console.log(e);
                    if(__DEV__){
                        alert(e)
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const acceptMoreTimeInvitation = (id = 0) => {
    return (dispatch, getState) => {

        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"

        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.acceptRejectMoreTimeInvtation+id+'/follow-up-session', 'post', {},
            {"Authorization": token})
            .then((response) => {
                try{

                }catch (e){
                    console.log(e);
                    if(__DEV__){
                        alert(e)
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const endCurrentChatSession = (id) => {
    return (dispatch, getState) => {

        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"

        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.userEndCurrentChatSession+id+'/follow-up-session', 'delete', {},
            {"Authorization": token})
            .then((response) => {
                try{

                }catch (e){
                    console.log(e);
                    if(__DEV__){
                        alert(e)
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const contiuewCurrentChatSession = (id) => {
    return (dispatch, getState) => {

        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"

        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.userEndCurrentChatSession+id+'/follow-up-session', 'post', {},
            {"Authorization": token})
            .then((response) => {
                try{

                }catch (e){
                    console.log(e);
                    if(__DEV__){
                        alert(e)
                    }
                }
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                // return Promise.reject(error);
                return dispatch(apiErrorHandler(error));
            })
    };
};

export const postReviewForProfession = (chatID,data) => {
    return (dispatch, getState) => {
        let token = "Bearer " + getState().user.token
        token = "Bearer jHNDIfaP2C"
        return CallApi('https://staging.brainbuddyapp.com/api/v2/'+Constant.postReview+chatID+'/rate','post',data,{"Authorization": token})
            .then((response)=>{
                return Promise.resolve(response);
            })
            .catch((error)=>{
                return Promise.reject((error && error.response && error.response.data) && error.response.data || "");
            })


    };
};

export const updateProfessionList = (data) => {
    return (dispatch, getState) => {

        let teamChatDisplayList = cloneDeep(getState().professional.professionalChatDisplayList) || [];
        teamChatDisplayList.splice(0, 0, data);

        dispatch({
            type: PROFESSIONAL_CHAT_DISPLAY_LIST,
            payload: teamChatDisplayList
        })
    };
};

export const setEmtptyProfessionList = (data) => {
    return (dispatch, getState) => {

        dispatch({
            type: PROFESSIONAL_CHAT_DISPLAY_LIST,
            payload: []
        })
    };
};


export const setEmtptyProfessionChatList = (data) => {
    return (dispatch, getState) => {

        dispatch({
            type: PROFESSIONAL_USER_LIST,
            payload: []
        })
    };
};





