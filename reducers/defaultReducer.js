import {userDefault} from './default/userDefault';
import {helpPostDefault} from './default/helpPostDefault';
import {letterDefault} from './default/letterDefault';
import {metaDataDefault} from './default/metadataDefault';
import {postAdviceDefault} from './default/postAdviceDefault';
import {statisticDefault} from './default/statisticDefault';
import {teamDefault} from './default/teamDefault';
import {professionalDefault} from './default/professionalDefault';
import {trainingDefault} from './default/trainingDefault';

export const appDefaultReducer = {
    user: userDefault,
    statistic: statisticDefault,
    team: teamDefault,
    advice: postAdviceDefault,
    helpPost: helpPostDefault,
    metaData: metaDataDefault,
    letters: letterDefault,
    professional: professionalDefault,
    training: trainingDefault,
};