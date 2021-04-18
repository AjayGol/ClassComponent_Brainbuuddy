import {
    Dimensions,
    Platform
} from 'react-native';
import DarkThemeColor from './darkThemeColor';
import DefaultThemeColor from './defaultThemeColor';
import {baseUrl} from './../services/apiConstant'

const defalutWhenChart = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    Night: 0,
};
const defalutWhyChart = [
    {key: "Bored", total: 0},
    {key: "Stress", total: 0},
    {key: "Anxiety", total: 0},
    {key: "Tired", total: 0},
    {key: "Alone", total: 0},
    {key: "Pain", total: 0},
    {key: "Horny", total: 0},
]

function getContainer(backColor) {
    return {
        flex: 1,
        backgroundColor: backColor,
        paddingBottom: (Platform.OS === 'ios') && 0 || 12
    }
}

const teamAlertData = (strLocale) => {
    return {
        publicTeamJoinConfirm: {
            data: [{
                title: strLocale("alert.Are you sure you want to change team?"),
                description: strLocale("alert.You cannot rejoin your current team")
            }],
            left: 'Cancel',
            right: 'Change',
            isSinglebtn: false
        },
        confirm: {
            data: [{
                title: strLocale("alert.Confirm team change"),
                description: strLocale("alert.Are you sure want to change team?")
            }],
            left: 'Cancel',
            right: 'Change',
            isSinglebtn: false
        },
        wrongPin: {
            data: [{
                title: strLocale("alert.Incorrect team PIN"),
                description: strLocale("alert.Please check the PIN is correct and try again")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        toomany: {
            data: [{
                title: strLocale("alert.Unable to change team"),
                description: strLocale("alert.Unable to change team message")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        createPrivate: {
            data: [{
                title: strLocale("alert.Create private team?"),
                description: strLocale("alert.Create private team message")
            }],
            left: 'Cancel',
            right: 'Create',
            isSinglebtn: false
        },
        swipeLimit: {
            data: [{
                title: strLocale("alert.Swap limit reached"),
                description: strLocale("alert.You can only change teams once every 24 hours")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        fullTeamAccept: {
            data: [{
                title: strLocale("alert.The team is full"),
                description: strLocale("alert.The team is full message")
            }],
            left: 'Okay',
            isSinglebtn: true
        }
    }
}

const communityAlert = (strLocale) => {
    return {
        adviceReport: {
            alertData: [{
                title: strLocale("alert.Report this post?"),
                description: strLocale("alert.Report this post message")
            }],
            left: 'Cancel',
            right: 'Report',
            rightBtnStyle: {backgroundColor: '#f26747'},
            isSinglebtn: false
        }
    }
}

const expiredTimeAlert = (strLocale) => {
    return {
        expiredTime: {
            alertData: [{
                title: "Time has expired. Continue chatting?",
                description: ''
            }],
            left: strLocale('professionalSupport.End chat'),
            right: strLocale('professionalSupport.Continue chat'),
            leftBtnStyle: {backgroundColor: '#f26747'},
            rightBtnStyle: {backgroundColor: '#5ac2bc'},
            isSinglebtn: false,
            backgroundStyle: {backgroundColor: '#f0f0f0'},
            textStyle: {
                color: '#525252',
                fontFamily: (Platform.OS === 'android') ? 'MuseoSans_700' : 'MuseoSans-700',
                fontSize: 14
            },
        }
    }
}

module.exports = {
    isRelease: false,
    testUser: 'beefup@gmail.com',
    testUser2: 'manu2386@gmail.com',
    defalutWhenChart,
    defalutWhyChart,
    teamAlertData,
    communityAlert,
    expiredTimeAlert,
    teamChangeDate: 'TEAM_CHANGE_DATE',

    screen: Dimensions.get('window'),
    screenHeight: Platform.OS === 'ios' && Dimensions.get('window').height || Dimensions.get('window').height - 24,
    screenWidth: Dimensions.get('window').width,
    fullScreenHeight: Dimensions.get('window').height,

    isIphoneX: Platform.OS === 'ios' && Dimensions.get('window').height === 812,

    isIOS: Platform.OS === 'ios',
    isiPAD: ((Dimensions.get('window').height / Dimensions.get('window').width) < 1.6),
    // isiPad: Device.isIpad(),
    isANDROID: Platform.OS === 'android',

    bestColor: [ "#DB7093", "#8B008B", "#E9967A",
        "#FF8C00", "#FF6347", "#FFD700",
        "#3CB371", "#006400", "#66CDAA", "#008080",
        "#5F9EA0", "#0000FF", "#191970", "#BC8F8F",
        "#800000", "#808080", "#280000",  "#990099",
        "#5900a6", "#DC143C", "#8B4513"],

    bestDarkColor: ['#FFA500','#FF4500','#FFFF00', '#7CFC00',
    '#00FFFF','#AFEEEE', '#6495ED', '#87CEEB', '#D8BFD8', '#EE82EE',
    '#DB7093', '#FFC0CB', '#FFF8DC', '#F5FFFA', '#F0FFF0'],

    congratulationEmoji: ["🎉", "🍺", "🍾", "🥂", "🎊", "🥳", "🙌"],
    motivationEmoji: ["🙂", "😊", "😀", "😁", "✌️", "🙏", "🤙"],

    alertTitle: "Brain Buddy",

    font300: (Platform.OS === 'android') ? 'Roboto_Light' : 'MuseoSans-300',
    font500: (Platform.OS === 'android') ? 'Roboto_Regular' : 'MuseoSans-500',
    font700: (Platform.OS === 'android') ? 'Roboto_Bold' : 'MuseoSans-700',

    backColor: '#202125', //003e53 //old Back 01536d //
    lightThemeBack: '#f0f0f0', //003e53 //old Back 01536d //
    lightTheamColor: '#709baa',
    transparent: 'transparent',
    lightBlueColor: '#05c3f9',
    settingBlueColor: '#58c0f3',

    violetColor: 'rgb(121,120,253)',
    darkVioletColor: '#564df0',

    remainigTextColor: '#58c0f3',

    orangeProgressBarColor: '#f26747',
    orangeBackProgressBarColor: 'rgb(179,132,120)',

    disable: '#D3D3D3',
    lightGreen: '#5ac2bc',
    blueProgressBarColor: '#5bc4bd',
    orangeColor: '#fbb043',
    greenColor: '#77e26d',
    transparentBackColor: '#1b657c',

    verColor: '#55c1bc',
    darkVerColor: '#1a7181', //147585

    darkVerOrange: '#b48578',
    verOrangeColor: '#f46b46',
    verProgressbarOrangeBack: '#ffddd4',

    backColor2: 'rgb(26,100,125)',
    activeColor: 'rgb(37,215,76)',
    backProgressBarColor: '#202125',
    grayBackground: '#efeff4',//'rgb(239,239,244)',
    heartColor: 'rgb(242,103,71)',
    commentColor: '#58c0f4',

    checkupColor: '#5ac2bb',
    checkupRelapseColor: '#f46b46',
    checkupGreenSwith: '#74bfba',

    settingHeaderColor: 'rgb(239,239,244)',
    settingGrayColor: '#D7D7D7',

    settingRowPressIn: '#dcdbdb',

    darkTheme: "DARK",
    lightTheme: "LIGHT",

    getContainer,

    LIGHT: DefaultThemeColor,
    DARK: DarkThemeColor,

    NO_RELIGIOUS: "NO_RELIGIOUS",
    RELIGIOUS: "RELIGIOUS",
    ASK_RELIGIOUS_ALERT: "ASK_RELIGIOUS_ALERT",

    NOT_REACHABLE_BACKEND: "NOT_REACHABLE_BACKEND",
    NOT_REACHABLE: "NOT_REACHABLE",
    REACHABLE: "REACHABLE",
    CANCEL_TOKEN: "CANCEL_TOKEN",

    selectionColor: '#4596d8',
    cancelTokenError: "Operation canceled by cancelToken",

    shadow: {
        shadowColor: '#000',
        shadowOffset: {width: 8, height: 8},
        shadowOpacity: 0.5,
        shadowRadius: 8.0,
        elevation: 2
    },
    shadow2: {
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3.0,
        elevation: 2
    },
    userGoals: [1, 3, 5, 7, 10, 14, 21, 30, 45, 60, 75, 90, 120, 180, 270, 365, 400, 500, 600, 700, 730, 800, 900, 1000],
    userGoals2: [1, 3, 5, 7, 10, 14, 21, 30, 45, 60, 75, 90, 120, 180, 270, 365, 400, 500, 600, 700, 730, 800, 900, 1000],
    levelArray: [0, 500, 1100, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4900],
    userGoalsTitle: ['1 day','3 days','5 days','1 week','10 days','2 weeks','3 weeks','1 month','45 days',
        '2 months','75 days','3 months','4 months','6 months','9 months','1 year','400 days','500 days',
        '600 days','700 days','730 days','800 days','900 days','1000 days'],

    genderTypes: ['male', 'female', 'transgender_male', 'transgender_female'],
    regionTypes: ['america', 'europe', 'asia', 'pacific'],
    motivationType: ['both', 'porn', 'masturbation'],
    orientationType: ['bisexual', 'homosexual', 'heterosexual'],
    notificationType: ['none', 'long', 'discreet'],

    comment_full: 'comment_icon_full',
    comment_empty: 'comment_icon_empty',
    heart_empty: 'heart_icon_empty',
    heart_full: 'heart_icon_full',

    appLocalization: ['en', 'de', 'es', 'fr', 'ja', 'ko', 'zh'],

    settingNew: '#03c3f9',
    settingSearch: 'rgb(121,120,253)',
    professionActiveColor: '#5ac2bc',
    professionInActiveColor: '#dcdbdb',
    professionInSessionColor: '#FFA500',
    professionStatus: '#737373',
    professionBottom: '#bcbcbc',
    professionReview: '#dcedec',

    //Pusher Event name
    pusherKey: baseUrl === "https://go.brainbuddyapp.com/api/v1/" && '53956610c9ac12c6f706' || '53956610c9ac12c6f706',
    pusherSupportChatAccept: 'support_chat_session.follow_up_accepted',
    pusherSupportChatDecline: 'support_chat_session.follow_up_declined',
    pusherSupportUpdated: 'professional.updated',
    pusherSupportChatEnded: 'support_chat.ended',
    pusherSupportChatPostSend: 'support_chat_post.sent',

    pusherSupportChatSessionStarted: 'support_chat_session.started',

    pusherSupportReqestAccepted: 'support_request.accepted',
    pusherSupportRequestDeclined: 'support_request.declined',
    pusherSupportRequestCreated: 'support_request.created',

    starSelected: '#fbb043',
    starUnSelected: 'rgb(76,225,212)',
    placeHolderReview: 'white',

    progress_selfcompassion_MaxValue: 700,
    progress_rest_MaxValue: 400,
    progress_activity_MaxValue: 400,
    progress_nutrition_MaxValue: 100,
    progress_mentaldiet_MaxValue: 100,
    progress_relationships_MaxValue: 100,
    progress_stress_MaxValue: 100,
    progress_level_MaxValue: 100,
    improvement_mind_MaxValue: 10,
    improvement_energy_MaxValue: 10,
    improvement_attraction_MaxValue: 10,
    improvement_sleep_MaxValue: 10,
    improvement_voice_MaxValue: 10,
    improvement_health_MaxValue: 10,
    improvement_confidence_MaxValue: 10,
    improvement_alive_MaxValue: 10,

    yesEditDate: {color: 'rgb(139,232,145)', textAlign: 'center', textColor: '#4b4b4b'},

    noEditDate: {color: 'rgb(242,104,71)', textAlign: 'center', textColor: '#4b4b4b'},

    shadowCommunication: {
        shadowColor: 'rgba(192, 192, 192, 0.59)',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 3,
        shadowOpacity: 0.99,
        elevation: 2,
        backgroundColor: 'white'
    },
    textSmall: {
        fontSize: 13,
        fontFamily: (Platform.OS === 'android') ? 'Roboto_Light' : 'MuseoSans-300',
        color: 'gray',
        textAlign: 'left',
    },
    text: {
        fontSize: 13,
        fontFamily: (Platform.OS === 'android') ? 'Roboto_Regular' : 'MuseoSans-500',
        textAlign: 'center',
    },
    separateLine: '#D3D3D3',
    postFavIconColor: 'gray',
    postFavIconColorSelected: '#3AD29F',
    textColorCommunication: 'black',
    postShadowColor: '#8E8E8E',
    feedCommentBackground: '#EFF0F2',
    feedCommentTitle: 'black',
    feedCommentDetail: 'black',

    styleTitle: {
        marginTop: 52,
        marginBottom: 32,
        paddingHorizontal: 24,
        color: '#000000',
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' && 'System' || 'Roboto-Bold',
        fontWeight: 'bold',
    },
    styleTitleSecondLine: {
        color: '#000000',
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' && 'System' || 'Roboto-Bold',
        fontWeight: 'bold',
    },
    headerAnimationTitle: {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
        fontFamily: 'System',
        fontWeight: '700'
    },

    styleSubTitle: {
        marginTop: 25, //38.5
        marginBottom: 15,
        color: '#000000',
        fontSize: 18,
        paddingHorizontal: 20,
        fontFamily: 'System',
        fontWeight: 'bold'
    },

    styleSubTitle2: {
        marginTop: 13, //38.5
        marginBottom: 10,
        color: '#000000',
        fontSize: 16,
        paddingHorizontal: 24,
        fontFamily: 'System',
        fontWeight: 'bold'
    },

  //00A4CC
    newTabSelected: '#9551FF',
    newColorCombination1: '#00A4CC',
    newColorCombination2: '#F9A12E',
    newColorCombination3: '#FC766A',
    newColorCombination4: '#9B4A97',
    newTabUnSelected: '#919192',
    newUnderLine: '#F5F6F5',
    newLightGray: '#F0F0EF',
    newTitleText: '#FC8836',
    detailText: '#8C8D8D',
    typeEmogy: ['img_greatbig', 'img_goodbig', 'img_mehbig', 'img_difficultbig', 'img_awfullybig'],

    positiveImage: ["😀", "😃", "😄", "😁", "😆", "😅", "🙂", "😊", "😇", "😘", "☺️", "😜", "😐", "😎"],
    sadImage: ["🙃", "🤭", "🤫", "😑", "😏", "😒", "🙄", "😌", "😔", "😵", "😮", "😲", "😥", "😢", "😠",
        "😞", "🤜", "👊", "👎"],
    celebrationImage: ["🥰", "😍", "🤩", "🤗", "🥳", "👋", "🤚", "👌", "✌️", "🤞", "🤟", "🤘", "🙌", "👏", "✊", "👍"
        , "☝️", "💪"],

    awardList: {
        "awards_launch": {
            name: 'Launch',
            decription: 'Complete first activity',
            descriptionDetail: 'Reduces Stress, Controls Anxiety, Promotes Emotional Health, Stress reduction is one of the most common reasons people try meditation.',
            icon: 'img_launch_badge',
            progress: '0'
        },
        "awards_lover": {
            name: 'Lover',
            decription: 'Complete 100 times today motivation',
            descriptionDetail: 'Reduces Stress, Controls Anxiety, Promotes Emotional Health, Stress reduction is one of the most common reasons people try meditation.',
            icon: 'img_lover_badge',
            progress: '0'
        },
        "awards_streakgoalmaster": {
            name: 'Streak Goal Master',
            decription: '100 streak goal to archive',
            descriptionDetail: 'Reduces Stress, Controls Anxiety, Promotes Emotional Health, Stress reduction is one of the most common reasons people try meditation.',
            icon: 'img_selfgoalmaster_badge',
            progress: '0'
        },
        "awards_meditation": {
            name: 'Meditation',
            decription: 'Power mind and release stress',
            descriptionDetail: 'Reduces Stress, Controls Anxiety, Promotes Emotional Health, Stress reduction is one of the most common reasons people try meditation.',
            icon: 'img_meditation_badge',
            progress: '0'
        },
        "awards_selfconfident": {
            name: 'Self Confident',
            decription: 'Daily activity get confident',
            descriptionDetail: 'Being your best under stress. Athletes, musicians and actors will at',
            icon: 'img_selfconfidence_badge',
            progress: '0'
        },
        "awards_community": {
            name: 'Community',
            decription: 'Post, Comment or replay 100 times on the beefup forum',
            descriptionDetail: 'Community benefits are programs or activities that provide treatment and/or promote health and healing as a response to community needs',
            icon: 'img_community_badge',
            progress: '0'
        },
        "award_braintrain": {
            name: 'Brain Train',
            decription: 'Post, Comment or replay 100 times on the beefup forum',
            descriptionDetail: 'Community benefits are programs or activities that provide treatment and/or promote health and healing as a response to community needs',
            icon: 'img_selfgoalmaster_badge',
            progress: '0'
        },
    }
};
//StoreReview.requestReview();
