import {
    TRAINING_LIST,
    SLEEP_MEDITATION_LIST
} from '../actions/types';
import {appDefaultReducer} from './defaultReducer';
const INITIAL_STATE = appDefaultReducer.training;

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TRAINING_LIST: {
            return {
                ...state,
                trainingList: action.payload,
            };
        }
        case SLEEP_MEDITATION_LIST: {
            return {
                ...state,
                sleepMeditationList: action.payload,
            };
        }
        default:
            return state;
    }
}

