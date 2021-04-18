import RNFirebase from '@react-native-firebase/app';

const configurationOptions = {
    debug: true,
    promptOnMissingPlayServices: true
};

const firebase = RNFirebase.initializeApp(configurationOptions);
export default firebase
