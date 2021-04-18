import axios from 'axios';
import {AsyncStorage} from "react-native";
import AppConstant from '../helper/constant';
import {EventRegister} from "react-native-event-listeners";
import {setAPICallsFail} from "../helper/appHelper";
import DeviceInfo from "react-native-device-info";
import {APP_SET_USER_DATA} from "../actions/types";
let source = axios.CancelToken.source();
const httpClient = axios.create();
httpClient.defaults.timeout = 15000;

export function CallApi(url, type = 'get', data = {}, header = {}, reqIdentifier = null) {

    if(header.Authorization && (header.Authorization.includes('undefined') ||
            header.Authorization === "Bearer " || header.Authorization === "Bearer")){
        //Get From AsyncStorage
        return AsyncStorage.getItem('user').then(user=>{
            if(user){
                let userData = JSON.parse(user);
                if(userData.token){
                    let token = "Bearer " + userData.token;
                    header.Authorization = token;
                    return makeAPICall(url, type, data, header, reqIdentifier);
                }
            }
            return Promise.reject('');
        });
    }else{
        //Call api
        return makeAPICall(url, type, data, header, reqIdentifier);
    }
}

export function makeAPICall(url, type = 'get', data = {}, header = {}, reqIdentifier = null) {
    debugger
    try{
        if(reqIdentifier){
            header["Brainbuddy-Request-Identifier"] = reqIdentifier;
        }

        const reqVersion = DeviceInfo.getModel() + '-' + DeviceInfo.getSystemVersion() + '-' + DeviceInfo.getReadableVersion();
        if(reqVersion){
            header["Brainbuddy-App-Version"] = reqVersion;
        }
    }catch (e){
        console.log(e);
    }
    debugger
    let reqHeader = Object.assign(header,
        {"Accept": "application/json", "Content-Type": "application/json"});
    console.log("API CALL - " + url + " TYPE- " + type, reqHeader);
    if (type === 'get') {
        return httpClient.get(url,{headers: reqHeader,cancelToken: source.token})
            .then((response) => {
                console.log("Response - " + url + " TYPE- " + type)
                return Promise.resolve(response.data)
            })
            .catch((err) => {
                console.log("Error - " + url + " TYPE- " + type, err)
                return Promise.reject(err);
            });
    } else if (type === 'post') {
        debugger
        return httpClient.post(url, data, {headers: reqHeader,cancelToken: source.token})
            .then((response) => {
                reqHeader
                console.log("Response - " + url + " TYPE- " + type)
                return Promise.resolve(response)
            })
            .catch((err) => {
                reqHeader
                console.log("Error - " + url + " TYPE- " + type, err)
                return Promise.reject(err);
            });
    } else if (type === 'delete') {
        return httpClient.delete(url, {headers: reqHeader,cancelToken: source.token})
            .then((response) => {
                console.log("Response - " + url + " TYPE- " + type)
                return Promise.resolve(response);
            })
            .catch((err) => {
                console.log("Error - " + url + " TYPE- " + type, err)
                return Promise.reject(err);
            });
    } else if (type === 'patch') {
        return httpClient.patch(url, data, {headers: reqHeader,cancelToken: source.token})
            .then((response) => {
                console.log("Response - " + url + " TYPE- " + type)
                return Promise.resolve(response)
            })
            .catch((err) => {
                if(err && err.message && err.message == AppConstant.cancelTokenError){
                    setAPICallsFail({type, data, url, header});
                }
                console.log("Error - " + url + " TYPE- " + type, err)
                return Promise.reject(err);
            });
    }
}

export function checkAccessAvailable(url) {
    const httpClient1 = axios.create();
    httpClient1.defaults.timeout = 20000;
    return httpClient1.get('https://player.vimeo.com').then(res => {
        return Promise.resolve(true);
    }).catch(err => {
        return Promise.reject(false);
    })
}

export const checkForRechability = (isCheckBrainbuddy = true) => {

    const httpClient1 = axios.create();
    httpClient1.defaults.timeout = 5000;
    return httpClient1.get('https://go.brainbuddyapp.com',{cancelToken: source.token}).then(res => {
        // return httpClient.get('https://www.youtube.com/').then(res => {
        return Promise.resolve(AppConstant.REACHABLE);
    }).catch(error => {
        if(error && error.message && error.message == AppConstant.cancelTokenError){
            console.log(AppConstant.CANCEL_TOKEN);
            return Promise.resolve(AppConstant.CANCEL_TOKEN);
        }else{
            return httpClient1.get('https://www.google.com',{cancelToken: source.token}).then(res => {
                //Rechability issue
                return Promise.resolve(AppConstant.NOT_REACHABLE_BACKEND);
            }).catch(error => {
                if(error && error.message && error.message == AppConstant.cancelTokenError){
                    console.log(AppConstant.CANCEL_TOKEN);
                    return Promise.resolve(AppConstant.CANCEL_TOKEN);
                }else{
                    return Promise.reject(AppConstant.NOT_REACHABLE);
                }
            });
        }
    });
}

export  function callAppGoesToBackground() {
    source.cancel(AppConstant.cancelTokenError);
}

export  function createNewTocken() {
    source = axios.CancelToken.source();
}

export function CallApi2(url, type = 'get') {
    return normalAPI(url);
}

export function normalAPI(url) {
//http://worldclockapi.com/api/json/est/now
    return httpClient.get('http://worldtimeapi.org/api/timezone/America/Argentina/Salta',{})
        .then((response) => {
            return Promise.resolve(response.data)
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
