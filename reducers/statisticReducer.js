import {
    STATISTIC_J_DATE_ARRAY,
    STATISTIC_JOURNAL_DETAIL,
    STATISTIC_JOURNAL_DETAIL_EDIT,
    STATISTIC_OTHER_DETAIL,
    STATISTIC_ALL_BACKUP,
    STATISTIC_ALL_BACKUP_EDIT,
    STATISTIC_P_CALCULATION,
    STATISTIC_M_CALCULATION,
    STATISTIC_JOURNAL_TOTAL,
    TOTAL_REWIRING_PERCENTAGE,
    PORN_WHY_RELAPSE,
    PORN_WHEN_RELAPSE,
    PORN_WHEN_TEMPTED,
    M_WHEN_RELAPSE,
    SET_GOAL_DATA,
    PORN_WHEN_STRESSED, M_WHEN_TEMPTED, PORN_WHY_TEMPTED, SET_PORN_DAYS, SET_M_DAYS,
    MEDITATION_MINUTE, MEDITATION_M_CALCULATION
} from '../actions/types'
import {appDefaultReducer} from './defaultReducer';

const DEFAULT_STATE = appDefaultReducer.statistic;

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_PORN_DAYS: {
            return{
                ...state,
                pornDetail: {
                    ...state.pornDetail,
                    p_array:action.payload
                }
            }
        }
        case SET_M_DAYS: {
            return{
                ...state,
                mosturbutionDetail: {
                    ...state.mosturbutionDetail,
                    m_array:action.payload
                }
            }
        }
        case STATISTIC_ALL_BACKUP: {
            return{
                ...state,
                backup_data:action.payload
            }
        }
        case STATISTIC_ALL_BACKUP_EDIT:{
            return{
                ...state,
                backup_data:action.payload
            }
        }
        case STATISTIC_M_CALCULATION: {
            return{
                ...state,
                mosturbutionDetail: action.payload
            } ;
        }

        case STATISTIC_P_CALCULATION: {
            return{
                ...state,
                pornDetail: action.payload
            } ;
        }
        case STATISTIC_OTHER_DETAIL: {
            return {
                ...state,
                other_detail: action.payload,

            };
        }
        case STATISTIC_J_DATE_ARRAY: {
            return {
                ...state,
                j_array: action.payload,
            };
        }

        case STATISTIC_JOURNAL_DETAIL:{
            return {
                ...state,
                journal_date_wise_list:action.payload,
            }
        }
        case STATISTIC_JOURNAL_TOTAL: {
            return {
                ...state,
                journal_total:action.payload,
            }
        }
        case STATISTIC_JOURNAL_DETAIL_EDIT:{
            return {
                ...state,
                journal_date_wise_list:action.payload,
            }
        }
        case TOTAL_REWIRING_PERCENTAGE:{
            return {
                ...state,
                totalRewiringPercentage : action.payload.totalRewiringPercentage,
                circularRewiringPercentage : action.payload.circularRewiringPercentage,// 2 + ( action.payload * 0.98 )
            }
        }
        case PORN_WHY_RELAPSE:{
            return {
                ...state,
                pornWhyIRelapse : action.payload,
            }
        }
        case PORN_WHY_TEMPTED:{
            return {
                ...state,
                pornWhyITempted : action.payload,
            }
        }
        case PORN_WHEN_RELAPSE:{
            return {
                ...state,
                pornWhenIRelapse : action.payload,
            }
        }
        case PORN_WHEN_TEMPTED:{
            return {
                ...state,
                pornWhenITempted : action.payload,
            }
        }
        case PORN_WHEN_STRESSED:{
            return {
                ...state,
                pornWhenIStressed : action.payload,
            }
        }
        case M_WHEN_RELAPSE:{
            return {
                ...state,
                masturbationWhenIRelapse : action.payload,
            }
        }
        case M_WHEN_TEMPTED:{
            return {
                ...state,
                masturbationWhenITempted : action.payload,
            }
        }
        case SET_GOAL_DATA:{
            return {
                ...state,
                currentGoal : action.payload,
            }
        }
        case MEDITATION_MINUTE: {
            return{
                ...state,
                meditationDetail: {
                    ...state.meditationDetail,
                    m_array:action.payload
                }
            }
        }
        case MEDITATION_M_CALCULATION: {
            return{
                ...state,
                meditaionYearDetail: action.payload
            } ;
        }
        default:
            return state;
    }
}
