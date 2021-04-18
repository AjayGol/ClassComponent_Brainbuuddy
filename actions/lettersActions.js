import {
    SET_LETTERS,
    SET_LAST_LETTER_DAY,
    SET_LAST_LETTER_DATE
} from './types'
import {CallApi} from '../services/apiCall';
import Constant from '../services/apiConstant';
import {find} from 'lodash';
import moment from 'moment';
import {apiErrorHandler} from "./userActions";
