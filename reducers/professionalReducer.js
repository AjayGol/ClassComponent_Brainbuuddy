import {
    PROFESSIONAL_CHAT_DISPLAY_LIST,
    PROFESSIONAL_CHAT_MESSAGE_ARRAY,
    PROFESSIONAL_CHAT_PAGINATION,
    PROFESSIONAL_USER_LIST,
    TEAM_CHAT_DISPLAY_LIST,
    PROFESSIONAL_USER_VISIBLE
} from '../actions/types'

import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.professional;

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case PROFESSIONAL_USER_LIST: {
            return {
                ...state,
                memberArray: action.payload,
            };
        }
        case PROFESSIONAL_CHAT_DISPLAY_LIST: {
            return {
                ...state,
                professionalChatDisplayList: action.payload,
            };
        }
        case PROFESSIONAL_CHAT_MESSAGE_ARRAY: {
            return {
                ...state,
                professionalChatMessageArray: action.payload,
            };
        }
        case PROFESSIONAL_CHAT_PAGINATION: {
            return {
                ...state,
                professionalChatPagination:action.payload
            };
        }
        case PROFESSIONAL_USER_VISIBLE: {
            return {
                ...this.state,
                professinalUserVisible: action.payload
            }
        }
        default:
            return state;
    }
}
