import {
    SET_META_DATA,
    IMPROVEMEMT_PERCENTAGE,
    ADD_NEW_CHECKUP_QUESTION,
    SET_MORNING_ROUTINE,
    SET_DONE_MORNING_ROUTINE,
    SET_REWIRING_BARS,
    SET_SELECTED_OPTIONAL_EXERCISES,
    META_DATA_BACKUP,
    MEDITATION_TIME,
    TODAY_SCREEN_EXERCISES,
    SET_LEVEL_DATA,
    LEVEL_LIST,
    LEVEL_NUMBER,
    AWARD_LIST,
    TODAY_EXERCISE,
    AWARD_TODAY
} from '../actions/types';
import _ from 'lodash';

import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.metaData;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_META_DATA: {
            return {
                ...state,
                metaData: action.payload
            };
        }
        case IMPROVEMEMT_PERCENTAGE: {
            return {
                ...state,
                improvementPercentage: action.payload
            };
        }
        case ADD_NEW_CHECKUP_QUESTION: {
            return {
                ...state,
                checkupQuestions: action.payload
            };
        }
        case SET_MORNING_ROUTINE: {
            return {
                ...state,
                morningRoutine: action.payload
            };
        }
        case SET_DONE_MORNING_ROUTINE: {
            return {
                ...state,
                completedMorningRoutine: action.payload
            };
        }
        case SET_SELECTED_OPTIONAL_EXERCISES: {
            return {
                ...state,
                selectedOptionalExercise: action.payload
            };
        }
        case SET_REWIRING_BARS: {
            return {
                ...state,
                rewiringProgress: action.payload
            };
        }
        case SET_LEVEL_DATA: {
            return {
                ...state,
                levelData: action.payload
            };
        }
        case LEVEL_LIST: {
            return {
                ...state,
                levelList: action.payload
            };
        }
        case LEVEL_NUMBER: {
            return {
                ...state,
                levelNumber: action.payload
            };
        }
        case AWARD_LIST: {
            return {
                ...state,
                awardList: action.payload
            };
        }
        case AWARD_TODAY: {
            return {
                ...state,
                awardToday: action.payload
            };
        }
        case META_DATA_BACKUP: {
            return {
                ...state,
                metaDataBackup: action.payload
            };
        }
        case MEDITATION_TIME: {
            return {
                ...state,
                meditationTime: action.payload
            };
        }
        case TODAY_SCREEN_EXERCISES: {
            return {
                ...state,
                todayScreenExercise: action.payload
            };
        }
        case TODAY_EXERCISE: {
            return {
                ...state,
                todayExercise: action.payload
            };
        }
        default:
            return state;
    }
}