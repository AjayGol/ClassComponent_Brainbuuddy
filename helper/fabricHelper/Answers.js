/**
 * @providesModule Answers
 */
// @flow

import analytics from '@react-native-firebase/analytics';

export const UserEvent = {

    userTrackScreen: function(screenName: string, Event: string) {

        screenName = screenName.split(" ").join("")
        if (Event){
            analytics().logEvent(screenName, Event)
        }else{
            analytics().logEvent(screenName)
        }
    },
};
