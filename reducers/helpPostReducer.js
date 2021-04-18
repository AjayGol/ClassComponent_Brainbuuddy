import {
    HELP_POST_LIST, ADD_HELP_DETAIL, HELP_SORT_TYPE,
    HELP_PAGINATION_POST_LIST, HELP_POST_COMMENT_LIST, HELP_POST_COMMENT_PAGINATION_LIST,
    ADD_FEED, LIST_FEED, MY_FEED, OTHER_USER_FEED, CATEGORY_FILTER, ADMIN_LIST,
    LIST_FEED_ADVICE, LIST_FEED_DAILY_DISCUSSION, LIST_FEED_MESSAGE_BOARD
} from '../actions/types';

import {appDefaultReducer} from './defaultReducer';
const INITIAL_STATE = appDefaultReducer.helpPost;

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case HELP_POST_LIST: {
            return {
                ...state,
                helpPostList: action.payload,
            };
        }
        case HELP_PAGINATION_POST_LIST: {
            return {
                ...state,
                helpPostPagination: action.payload,
            };
        }
        case HELP_POST_COMMENT_LIST: {
            return {
                ...state,
                helpPostComment: action.payload,
            };
        }
        case HELP_POST_COMMENT_PAGINATION_LIST: {
            return {
                ...state,
                helpPostCommentPagination: action.payload,
            };
        }
        case ADD_HELP_DETAIL: {
            return {
                ...state,
                helpPostList: action.payload,
            };
        }
        case HELP_SORT_TYPE: {
            return {
                ...state,
                sortType: action.payload,
            }
        }

        case ADD_FEED: {
            return {
                ...state,
                add: action.payload
            };
        }

        case LIST_FEED: {
            return{
                ...state,
                list: action.payload,
                listPage: action.listPage,
                getFeedStatus: action.getFeedStatus
            }
        }

        case LIST_FEED_ADVICE: {
            return{
                ...state,
                listAdvice: action.payload,
                listAdvicePage: action.listPage,
                getFeedAdviceStatus: action.getFeedStatus
            }
        }

        case LIST_FEED_DAILY_DISCUSSION: {
            return{
                ...state,
                listDailyDiscussion: action.payload,
                listDailyDiscussionPage: action.listPage,
                getFeedDailyDiscussionStatus: action.getFeedStatus
            }
        }

        case LIST_FEED_MESSAGE_BOARD: {
            return{
                ...state,
                listMessageBoard: action.payload,
                listMessageBoardPage: action.listPage,
                getFeedMessageBoardStatus: action.getFeedStatus
            }
        }

        case MY_FEED: {
            return{
                ...state,
                myList: action.payload,
            }
        }

        case OTHER_USER_FEED: {
            return{
                ...state,
                otherUserList: action.payload,
            }
        }

        case CATEGORY_FILTER: {
            return{
                ...state,
                categoryFilter: action.payload,
                categorySubFilter: action.payload2,
            }
        }

        case ADMIN_LIST: {
            return {
                ...state,
                adminList: action.payload,
            }
        }

        default:
            return state;
    }

}
