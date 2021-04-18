// import firebase  from 'react-native-firebase';


import firebase  from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

const config = {
    apiKey: "AIzaSyDTpmhdZQqwXbzrdf-NA5GQwFllvNFNK3o",
    authDomain: "beefup-bac7a.firebaseapp.com",
    databaseURL: "https://beefup-bac7a.firebaseio.com",
    projectId: "beefup-bac7a",
    storageBucket: "beefup-bac7a.appspot.com",
    messagingSenderId: "655277701462",
    appId: "1:655277701462:ios:4f69474d1b3bca86807ef7",
}


export const app = firebase.initializeApp(config);
