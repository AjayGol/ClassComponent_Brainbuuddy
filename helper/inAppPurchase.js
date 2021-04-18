import React, { Component } from 'react';
import {
    Alert,
    NativeModules
} from 'react-native';
const { InAppUtils } = NativeModules; // react-native-in-app-utils
import moment from 'moment';
import iapReceiptValidator from 'iap-receipt-validator';
const password = 'b3c7e3995e3a46d2a97d9e4ac1327a08'; // Shared Secret from iTunes connect
const production = true; // use sandbox or production url for validation
const validateReceipt = iapReceiptValidator(password, production);
const validateReceiptSandbox = iapReceiptValidator(password, false);
import _ from 'lodash';

export const loadMonthlyAllProduct = () => {
    let products = [
        'beefup_monthly2'
    ];
    //console.log("--loadAllProducts-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            //console.log("***||Productss",products);
            if(error){
                console.log("loadMonthlyAllProduct-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadMonthlyAllProduct-> response");
                return resolve(products);
            }
        });
    })
};

export const  loadMonthlyAllProductNew = async () => {
    let products = [
        'beefup_monthly2'
    ];

    try {
        const products2 = await InAppUtils.loadProducts(products);
        if (products2) {
            return Promise.resolve(products2);
        }else{
            return Promise.reject("Fail to load products, try again");
        }
    }catch (e) {
        return Promise.reject("Fail to load products, try again");
    }
};

export const loadYearlyAllProduct = () => {
    let products = [
        'beefup_monthly2'
    ];
    //console.log("--loadAllProducts-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            //console.log("***||Productss",products);
            if(error){
                console.log("loadMonthlyAllProduct-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadMonthlyAllProduct-> response");
                return resolve(products);
            }
        });
    })
};

export const loadAllProducts = () => {
    let products = [
        'beefup_monthly2',
    ];
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            console.log("***||Productss",products);
            if(error){
                console.log("loadAllProducts-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadAllProducts-> response");
                return resolve(products);
            }
        });
    })
};

export const loadAllProductsNew = async () => {
    let products = [
        'beefup_monthly2',
    ];
    try {
        const products = await InAppUtils.loadProducts(products);
        if (products) {
            return Promise.resolve(products);
        }else{
            return Promise.reject("Fail to load products, try again");
        }
    }catch (e) {
        return Promise.reject("Fail to load products, try again");
    }
};

export const canMakePayment = () => {
    //console.log("--can make payment-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.canMakePayments((enabled) => {
            if(enabled) {
                console.log("canMakePayment-> enable");
                return resolve(true);
                // return restoreAllData();
            } else {
                //          console.log("canMakePayment-> disable");

                console.log('--------------canMakePayment---------');

                return reject("not able to make payment");


            }
        });
    })
};

export const canMakePaymentNew = async () => {

    try {
        const canMakePayments = await InAppUtils.canMakePayments();
        if (canMakePayments) {
            return Promise.resolve(true);
        }else{
            return Promise.reject("not able to make payment");
        }
    }catch (e) {
        return Promise.reject("not able to make payment");
    }
}

export const purchaseApp = (productKey="beefup_monthly2") => {
    //console.log("------purchaseApp-----");
    // let productIdentifier = 'beefup_monthly2';
    // let productIdentifier = 'brainbuddy_yearly3';
    let productIdentifier = "beefup_monthly2";
    return new Promise((resolve,reject)=> {
        // alert(productIdentifier)
        return InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
            console.log('--------------purchaseApp Not Responding---------')
            if (response && response.productIdentifier) {
                console.log("------purchaseApp-----> success");
                // //Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
                // //unlock store here.
                return resolve(true);
            }
            if (error) {
                //Cancel subscription
                console.log('--------------Catch Purchase---------' + error);
                return reject(false);
                // Alert.alert("Subscription fail, Please try again");
                console.log("------purchaseApp-----> Error");
                // Alert.alert("error" + error);
                // console.log("***||error", error)
            }
        });
    })
};

export const purchaseAppNew = async (productKey="beefup_monthly2") => {
    let products = [
        'beefup_monthly2'
    ];

    try {
        const products2 = await InAppUtils.loadProducts(products);
        if (products2) {
            try {
                console.log("------purchase - load product -----");
                const productIdentifier = "beefup_monthly2";
                const response = await InAppUtils.purchaseProduct(productIdentifier);
                if (response && response.productIdentifier) {
                    console.log("------purchaseApp-----> success");
                    return Promise.resolve(true);
                } else {
                    console.log('--------------Catch Purchase new---------' + err);
                    return Promise.reject(false);
                }
            } catch (err) {
                console.log('--------------Catch Purchase new 1 ---------' + err);
                return Promise.reject(false);
            }
        }else{
            return Promise.reject(false);
        }
    }catch (e) {
        return Promise.reject(false);
    }
}

export const restoreAllData = () => {
    return new Promise((resolve,reject)=>{
        return InAppUtils.restorePurchases((error, response) => {
            if(error) {
                console.log('--------------restoreAllData---------err' + error);
                return reject("Faild")
            } else {
                if (response.length === 0) {
                    console.log('--------------restoreAllData 0 ---------');
                    return reject("receipt_not_found")
                }else {
                    console.log('--------------in else block  restoreAllData---------');
                    return resolve(true)
                }
            }

        });
    })
};

export const restoreAllDataNew = async () => {
    try {
        const response = await InAppUtils.restorePurchases();
        if (response.length === 0) {
            console.log('--------------restoreAllData 0 ---------');
            return Promise.reject("receipt_not_found");
        }else{
            console.log('--------------in else block  restoreAllData---------');
            return Promise.resolve(true)
        }
    } catch (err) {
        console.log('--------------restoreAllData---------err' + err);
        return Promise.reject("Faild");
    }
}

export const checkForValidation = (type = "") => {
    return new Promise((resolve,reject)=>{
        return InAppUtils.receiptData((error, receiptDatas)=> {
            if(error){
                // Alert.alert("failed to get")
                console.log('-------------then-checkForValidation error ---------');
                console.log('------------Failed to get receipt Data, please try again---------');
                return reject("Failed");
            }
            // console.log("***||reciptData",receiptDatas);
            // if(receiptDatas || receiptDatas != undefined){
            return validate(receiptDatas, type).then(res=>{
                console.log('-------------then-checkForValidation ---------');
                return resolve(true);
            }).catch(err=>{
                console.log('-------------catch-checkForValidation ---------' + err);
                return reject(err);  //Expired or receipt_not_found
            });
            // }else{
            //     console.log('--------------in else block  checkForValidation---------');
            //     return reject(false);
            // }
        });
    });
};

export const checkForValidationNew = async (type = "") => {
    try {
        const receiptData = await InAppUtils.receiptData();
        if (receiptData) {
            return validate(receiptData, type).then(res=>{
                console.log('-------------then-checkForValidation ---------');
                return Promise.resolve(true);
            }).catch(err=>{
                console.log('-------------catch-checkForValidation ---------' + err);
                return Promise.reject(err);  //Expired or receipt_not_found
            });
        }else{
            console.log('-------------then-checkForValidation error ---------');
            console.log('------------Failed to get receipt Data, please try again---------');
            return Promise.reject("Failed");
        }
    } catch (err) {
        console.log('-------------then-checkForValidation error ---------');
        console.log('------------Failed to get receipt Data, please try again---------');
        return Promise.reject("Failed");
    }
}

const validate = async (receiptData, type = '') => {
    if (type === 'sandbox'){
        try {
            const validationData = await validateReceiptSandbox(receiptData);

            if (validationData['latest_receipt_info'].length > 0) {
                let allData = validationData['latest_receipt_info'];
                console.log("==========allData===========")
                // alert(JSON.stringify(allData));

                let obj = _.maxBy(allData, function (o) {
                    return parseFloat(o.expires_date_ms);
                });
                console.log("=====================")
                console.log(obj);
                // alert(JSON.stringify(obj))

                if (obj.expires_date_ms) {
                    let parseDate = parseInt(obj.expires_date_ms);
                    let today = parseInt(Date.now());
                    // alert("end date " + parseDate + ' ' + "today date " + today + ' ' + "total " +(parseDate - today))
                    console.log("Compaire Date " + obj.expires_date_ms + ' ' + today);
                    if (parseDate > today) {
                        console.log("resolve============");
                        return Promise.resolve(true);
                    }
                }
                console.log("resolve===catch=========");
                return Promise.reject("Expired");
            } else {
                console.log('--------------validate ---------');
                console.log("----not getting date---latest_receipt_info_not_found----");
                return Promise.reject("latest_receipt_info_not_found")
            }

        } catch (err) {
            console.log('--------------validate ---------' + err);
            console.log("***||error", err);
            // console.log(err.valid, err.error, err.message);
            return Promise.reject(err.message)
        }
    }else {
        try {
            const validationData = await validateReceipt(receiptData);
            // check if Auto-Renewable Subscription is still valid
            // return Promise.resolve(true);

            if (validationData['latest_receipt_info'].length > 0) {
                let allData = validationData['latest_receipt_info'];
                console.log("==========allData===========")
                // alert(JSON.stringify(allData));

                let obj = _.maxBy(allData, function (o) {
                    return parseFloat(o.expires_date_ms);
                });
                console.log("=====================")
                console.log(obj);
                // alert(JSON.stringify(obj))

                if (obj.expires_date_ms) {
                    console.log(obj.expires_date_ms);
                    let parseDate = parseInt(obj.expires_date_ms);
                    let today = parseInt(Date.now());
                    // alert("end date " + parseDate + ' ' + "today date " + today + ' ' + "total " +(parseDate - today))
                    if (parseDate > today) {
                        console.log("resolve============");
                        return Promise.resolve(true);
                    }
                }
                console.log("resolve===catch=========");
                return Promise.reject("Expired");

                //
                // console.log("=+++++++++++++=")
                // console.log(allData);
                //
                // let todayDateStr = moment().format('YYYY-MM-DD HH:mm:ss').toString();
                // let todayDateGetTime = moment(todayDateStr);
                // let todayDate = new Date(todayDateGetTime);
                //
                // allData.map(inAPPData=>{
                //     if(inAPPData.expires_date_ms){
                //         let dateExpMS = parseInt(inAPPData.expires_date_ms);
                //         let expiryDate = new Date(dateExpMS);
                //         console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
                //         if (todayDate < expiryDate) {
                //             console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
                //             return Promise.resolve(true);
                //         }
                //     }
                // });
                //
                //
                // console.log("=+++++++++++++=")
                // console.log(allData);
                // return Promise.reject(false);
                // let lastObj = validationData['latest_receipt_info'].length - 1;
                // if(validationData['latest_receipt_info'][lastObj].expires_date_ms) {
                //
                //     // let todayDateStr = moment().format('YYYY-MM-DD HH:mm:ss').toString();
                //     //let todayDateGetTime = moment(todayDateStr);
                //
                //     //let todayDate = new Date(todayDateGetTime);
                //
                //     //let dateExpMS = parseInt(validationData['latest_receipt_info'][lastObj].expires_date_ms);
                //
                //     //let expiryDate = new Date(dateExpMS);
                //
                //     //console.log("--------new todayDate-------" + todayDate);
                //     //console.log("--------new expiryDate-------" + expiryDate);
                //
                //     let parseDate = parseInt(validationData['latest_receipt_info'][lastObj].expires_date_ms);
                //     let today = parseInt(Date.now());
                //     if (parseDate > Date.now()) {
                //         //alert("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
                //         return Promise.resolve(true);
                //     } else {
                //         //need to renew
                //         // console.log('--------------validate ---------');
                //         // alert("invalid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
                //
                //         return Promise.reject(false)
                //     }
                // }
            } else {
                console.log('--------------validate ---------');
                console.log("----not getting date---latest_receipt_info_not_found----");
                return Promise.reject("latest_receipt_info_not_found")
            }

        } catch (err) {
            console.log('--------------validate ---------' + err);
            console.log("***||error", err);
            // console.log(err.valid, err.error, err.message);
            return Promise.reject(err.message)
        }
    }
};

//Checking for free Trial
export const getReceiptData = (type = "") => {
    return new Promise((resolve,reject)=>{
        return InAppUtils.receiptData((error, receiptDatas)=> {
            if(error){
                console.log('-------------then-checkForValidation error ---------');
                console.log('------------Failed to get receipt Data, please try again---------');
                return reject("Failed");
            }
            return getValidJson(receiptDatas, type).then(res=>{
                return resolve(res);
            }).catch(err=>{
                return reject(err);
            });
        });
    });
};

export const getReceiptDataNew = async (type = "") => {
    try {
        const receiptData = await InAppUtils.receiptData();
        if (receiptData){
            return getValidJson(receiptData, type).then(res=>{
                // alert('get data11')
                return Promise.resolve(res);
            }).catch(err=>{
                // alert('get 222')
                return Promise.reject(err);
            });
        }else{
            console.log('-------------then-checkForValidation error ---------');
            console.log('------------Failed to get receipt Data, please try again---------');
            return Promise.reject("Failed");
        }
    } catch (err) {
        console.log('-------------then-checkForValidation error ---------');
        console.log('------------Failed to get receipt Data, please try again---------');
        return Promise.reject("Failed");
    }
}

const getValidJson = async (receiptData, type = '') => {
    if (type === "sandbox"){
        try {
            const validationData = await validateReceiptSandbox(receiptData);
            return Promise.resolve(validationData);
        } catch(err) {
            console.log("--getValidJson--err---",err)
            return Promise.reject(err.message)
        }
    }else{
        try {
            const validationData = await validateReceipt(receiptData);
            return Promise.resolve(validationData);
        } catch(err) {
            console.log("--getValidJson--err---",err)
            return Promise.reject(err.message)
        }

    }
};

// --------------restoreAllData---------erruser_cancelled
