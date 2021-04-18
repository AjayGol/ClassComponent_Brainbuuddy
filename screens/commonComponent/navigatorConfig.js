import React, { Component } from 'react';
import {
} from 'react-native';
import { NavigationStyles } from '@expo/ex-navigation';

export default class NavigatorConfig extends React.PureComponent {

    static route = {
        styles: {
            gestures: (params) => {
                const newParams = {...params};
                newParams.gestureResponseDistance = Constant.screenWidth / 2;
                return NavigationStyles.SlideHorizontal.gestures(newParams);
            },
        },
    };
}