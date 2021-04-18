import {Platform} from "react-native";

const Constant = {
    font300: (Platform.OS === 'android') ? 'MuseoSans_300': 'MuseoSans-300',
    font500: (Platform.OS === 'android') ? 'MuseoSans_500': 'MuseoSans-500',
    font700: (Platform.OS === 'android') ? 'MuseoSans_700': 'MuseoSans-700'
};

const achievementiconY = {
    "1": {uri: 'achievement_icon_success_1'},
    "3": {uri: 'achievement_icon_success_3'},
    "7": {uri: 'achievement_icon_success_7'},
    "14": {uri: 'achievement_icon_success_14'},
    "30": {uri: 'achievement_icon_success_30'},
    "90": {uri: 'achievement_icon_success_90'},
    "180": {uri: 'achievement_icon_success_180'},
    "365": {uri: 'achievement_icon_success_365'},

    "400": {uri: 'achievement_icon_success_400'},
    "500": {uri: 'achievement_icon_success_500'},
    "600": {uri: 'achievement_icon_success_600'},
    "700": {uri: 'achievement_icon_success_700'},
    "730": {uri: 'achievement_icon_success_730'},
    "800": {uri: 'achievement_icon_success_800'},
    "900": {uri: 'achievement_icon_success_900'},
    "1000": {uri: 'achievement_icon_success_1000'},
};
const achievementiconB = {
    "1": {uri: 'achievement_icon_empty_1_dark'},
    "3": {uri: 'achievement_icon_empty_3_dark'},
    "7": {uri: 'achievement_icon_empty_7_dark'},
    "14": {uri: 'achievement_icon_empty_14_dark'},
    "30": {uri: 'achievement_icon_empty_30_dark'},
    "90": {uri: 'achievement_icon_empty_90_dark'},
    "180": {uri: 'achievement_icon_empty_180_dark'},
    "365": {uri: 'achievement_icon_empty_365_dark'},

    "400": {uri: 'achievement_icon_empty_400_dark'},
    "500": {uri: 'achievement_icon_empty_500_dark'},
    "600": {uri: 'achievement_icon_empty_600_dark'},
    "700": {uri: 'achievement_icon_empty_700_dark'},
    "730": {uri: 'achievement_icon_empty_730_dark'},
    "800": {uri: 'achievement_icon_empty_800_dark'},
    "900": {uri: 'achievement_icon_empty_900_dark'},
    "1000": {uri: 'achievement_icon_empty_1000_dark'},
};

const improvementiconY = {
    alive: {uri: 'improvement_alive_success'},
    attraction: {uri: 'improvement_attraction_success'},
    confidence: {uri: 'improvement_confidence_success'},
    energy: {uri: 'improvement_energy_success'},
    health: {uri: 'improvement_health_success'},
    mind: {uri: 'improvement_zen_success'},
    sleep: {uri: 'improvement_sleep_success'},
    voice: {uri: 'improvement_voice_success'},
};
const improvementiconB = {
    alive: {uri: 'improvement_alive_empty_dark'},
    attraction: {uri: 'improvement_attraction_empty_dark'},
    confidence: {uri: 'improvement_confidence_empty_dark'},
    energy: {uri: 'improvement_energy_empty_dark'},
    health: {uri: 'improvement_health_empty_dark'},
    mind: {uri: 'improvement_zen_empty_dark'},
    sleep: {uri: 'improvement_sleep_empty_dark'},
    voice: {uri: 'improvement_voice_empty_dark'},
};

const teamAchievementicomY = {
    "10": {uri: 'achievement_team_success_10'},
    "30": {uri: 'achievement_team_success_30'},
    "50": {uri: 'achievement_team_success_50'},
    "100": {uri: 'achievement_team_success_100'},
    "180": {uri: 'achievement_team_success_180'},
    "365": {uri: 'achievement_team_success_365'},
    "500": {uri: 'achievement_team_success_500'},
    "1000": {uri: 'achievement_team_success_1000'},

    "1500": {uri: 'achievement_team_success_1500'},
    "2000": {uri: 'achievement_team_success_2000'},
    "2500": {uri: 'achievement_team_success_2500'},
    "3000": {uri: 'achievement_team_success_3000'},
    "3500": {uri: 'achievement_team_success_3500'},
    "4000": {uri: 'achievement_team_success_4000'},
    "4500": {uri: 'achievement_team_success_4500'},
    "5000": {uri: 'achievement_team_success_5000'},
};

const teamAchievementicomB = {
    "10": {uri: 'achievement_team_empty_10_dark'},
    "30": {uri: 'achievement_team_empty_30_dark'},
    "50": {uri: 'achievement_team_empty_50_dark'},
    "100": {uri: 'achievement_team_empty_100_dark'},
    "180": {uri: 'achievement_team_empty_180_dark'},
    "365": {uri: 'achievement_team_empty_365_dark'},
    "500": {uri: 'achievement_team_empty_500_dark'},
    "1000": {uri: 'achievement_team_empty_1000_dark'},

    "1500": {uri: 'achievement_team_empty_1500_dark'},
    "2000": {uri: 'achievement_team_empty_2000_dark'},
    "2500": {uri: 'achievement_team_empty_2500_dark'},
    "3000": {uri: 'achievement_team_empty_3000_dark'},
    "3500": {uri: 'achievement_team_empty_3500_dark'},
    "4000": {uri: 'achievement_team_empty_4000_dark'},
    "4500": {uri: 'achievement_team_empty_4500_dark'},
    "5000": {uri: 'achievement_team_empty_5000_dark'},
};

const specialAchievementIcon = {
    "0": {uri: 'special_achievement_jan'},
    "1": {uri: 'special_achievement_feb'},
    "2": {uri: 'special_achievement_mar'},
    "3": {uri: 'special_achievement_apr'},
    "4": {uri: 'special_achievement_may'},
    "5": {uri: 'special_achievement_jun'},
    "6": {uri: 'special_achievement_jul'},
    "7": {uri: 'special_achievement_aug'},
    "8": {uri: 'special_achievement_sep'},
    "9": {uri: 'special_achievement_oct'},
    "10": {uri: 'special_achievement_nov'},
    "11": {uri: 'special_achievement_dec'},
};
const specialAchievementEmptyIcon = {
    "0": {uri: 'special_achievement_jan_empty_dark'},
    "1": {uri: 'special_achievement_feb_empty_dark'},
    "2": {uri: 'special_achievement_mar_empty_dark'},
    "3": {uri: 'special_achievement_apr_empty_dark'},
    "4": {uri: 'special_achievement_may_empty_dark'},
    "5": {uri: 'special_achievement_jun_empty_dark'},
    "6": {uri: 'special_achievement_jul_empty_dark'},
    "7": {uri: 'special_achievement_aug_empty_dark'},
    "8": {uri: 'special_achievement_sep_empty_dark'},
    "9": {uri: 'special_achievement_oct_empty_dark'},
    "10": {uri: 'special_achievement_nov_empty_dark'},
    "11": {uri: 'special_achievement_dec_empty_dark'},
};

const commnityClock = {uri:'community_time_icon_white'}


colors = {
    lightBack: '#242321',
    progressBack: '#4c4d50',
    cardBack: '#28292C',
    backColor: '#161619',
    grayTitle: '#cdcdcd',
    subTitle: '#8f8f88',
    fontColor: '#7e7f7f',
    smallBtn: '#45474b',
    headerBtn: '#959595',
}

const color = {
    'silver' : 'silver',
    'white' : 'white',
    'black' : 'black',
    'blackPopUp' : '#19191B',
    'lightGreen' : '#3AD29F',
    'disable' : '#D3D3D3',
    'lightBack': '#212224',
    'pageDisable': '#F0F1F9',
    'gray' : 'gray',
    'violetColor': 'rgb(121,120,253)',
    'darkVioletColor': '#564df0',
    'notViwedNotification': '#E5F1FD',
    'backColor': '#161619',
    'fontColor': '#7e7f7f',
};

module.exports = {
    appBackground: colors.lightBack,
    appLighBackground: "#01536d",
    statusBarStyle: "light-content",
    themeFont: '#fff',
    lightBack: colors.backColor,

    appBackgroundWhite: "white",
    appBackground20: '#001f28',
    titleColor20: '#fff',
    titleColor20Black: '#FFFFFF',

    //Today
    todayLighBackground: colors.backColor,
    todayHeaderTitle: colors.subTitle,
    cardSubSection: colors.lightBack,
    cardBack: colors.cardBack,
    cardBackNew: "#242321",
    cardSubTitle: colors.subTitle,
    titleTheme: '#fff',
    titleCommunity: '#fff',
    titleDailyTracker: '#fff',
    titleNotificationSetting: '#fff',
    titleTeamTab: '#fff',

    //Font colors
    defaultFont : '#fff',
    subTitile :colors.grayTitle,


    // cardSubTitle: '#aec8d1',
    headerTitle: colors.headerBtn,
    topTodayRemainig: colors.grayTitle,

    navTitleMain: "white",
    titleMain: '#FFF',
    subTitleMain: '#FFF',
    subTitleExercise: '#FFF',

    analysisProgressText: 'white',
    progressBG: '#333437',
    levelProgress: '#333437',

    // cardBack: "#5d879b",
    // cardSubSection: "#386980",
    pogressBarOtherColor: colors.progressBack,
    replayMorningRoutine: {uri:'icon_replay_exercise_dark'},

    viewCompletedBtn: '#03c3f9',
    viewCompletedText: '#FFF',
    // viewCompletedBtn: '#003e53',
    // viewCompletedText: '#dee1e3',

    scrollableBack: colors.lightBack,
    customInactiveFont: colors.grayTitle,
    scrollableActiveFont: '#fff',
    scrollableInactiveFont: colors.fontColor,

    scrollableViewBack: '#212224',
    changeAvatar: colors.lightBack,

    progressBarTitle:"#707078",
    progressBarLine:"#45474B",
    rewiredprogressBarOtherColor: colors.progressBack,

    verProgressBottomTitle: '#707078',

    streackCountText: '#87beb9',

    senderBubble: '#9551FF',
    selectedSenderBubble: '#22aad6',
    selectedSenderText: '#fff',
    receiverBubble: '#393a3c',
    selectedReceiverBubble: '#313335',
    receiverBubbleText: '#fff',

    bottomChatInner: colors.lightBack,
    bottomChatPlaceholder: colors.fontColor,
    bottomChatText: "#fff",

    chatUsername: '#fff',
    chatDateTime: colors.fontColor,

    rowView: colors.lightBack,
    postAdviceRowBottomText: '#9a9ca0',
    postAdviceRowBottomIcon: '#9a9ca0',
    comunityPornDayCount: '#5ac2bc',
    commentReplyIcon: '#707078',

    editPostBack: '#f0f0f0',
    editPostText: '#000',

    postButton: '#03c3f9',//'#58c0f4',
    selectedSortBtn: '#03c3f9',
    unselectedSortBtn: '#68dbfb',
    createPostBtn: '#03c3f9',

    createPostCancel: colors.headerBtn,

    commentViewBack: colors.backColor,
    commentHeader: colors.lightBack,
    commentView: '#FFF',

    moreRow: colors.lightBack,
    pressInMoreRow: colors.backColor,
    moreSeparator: colors.backColor,
    separateLine: '#333333',

    settingBtn: colors.smallBtn,
    settingBtnText: "#fff",

    verProgressbarBack: colors.lightBack,
    verProgressbarOrangeBack: colors.lightBack,

    sliderBack: colors.lightBack,
    sliderTop: '#64676d',
    sliderText: colors.fontColor,
    selectedTabText: '#fff',

    // verProgressbarBack: '#1a7181',
    // verProgressbarOrangeBack: '#b48578',
    // yesEditDate:[{startingDay: true, color: 'rgb(139,232,145)',textAlign:'center',textColor:'#fff'},
    //     {endingDay: true,textAlign:'center', color: 'rgb(139,232,145)',textColor:'#fff'}],

    yesDate:{color: 'rgb(132,177,58)',textAlign:'center',textColor:'#fff'},

    noDate: {color: 'rgb(245,56,68)',textAlign:'center',textColor:'#fff'},

    noEditDate: {color: '#FF0000',textAlign:'center',textColor:'#fff'},

    yesEditDate:{color: '#9551FF',textAlign:'center',textColor:'#fff'},

    greenSpin: {color: colors.lightBack,textAlign:'center',
        textColor:'#4b4b4b',spinner:{uri: 'calendar_spinner_green'}},

    redSpin: {color: colors.lightBack,textAlign:'center',textColor:'#4b4b4b',
        spinner:{uri: 'calendar_spinner_red'}},

    graySpin: {color: colors.lightBack,textAlign:'center',textColor:'#4b4b4b',
        spinner:{uri: 'calendar_spinner_dark'}},

    //Leaderboard
    leaderBoradRank: colors.grayTitle,
    leaderboardRowBackColor: colors.lightBack,
    leaderBoardClose: '#e4e4e4',
    leaderBoardCloseIcon: 'leaderboard_close_white',
    leaderBoardFooter: colors.grayTitle,

    borderBottom: colors.lightBack,
    //Tabbar
    tabbarBack: colors.lightBack,
    tabbarTopBorder: '#333333',
    tabIcon: {
        Today: 'tab_nav_icon_1_light',
        Statistic: 'tab_nav_icon_2_light',
        Team: 'tab_nav_icon_3_light',
        Milestone: 'tab_nav_icon_4_light',
        More: 'tab_nav_icon_5_light',
    },
    selectedTabIcon: {
        Today: 'tab_nav_icon_1_selected_light',
        Statistic: 'tab_nav_icon_2_selected_light',
        Team: 'tab_nav_icon_3_selected_light',
        Milestone: 'tab_nav_icon_4_selected_light',
        More: 'tab_nav_icon_5_selected_light',
    },
    settingIcon: {
        feelingTampered: 'icon_sossetting_dark',
        trainingSection: 'icon_trainingsetting_dark',
        journal: 'icon_journalsetting_dark',
        completedExercise: 'icon_audiosetting_dark',
        internetFilterIcon: 'icon_internetfiltersetting_dark',
        settings: 'icon_settingsetting_dark'
    },
    achievementImages: {
        Y: achievementiconY,
        L: achievementiconY,
        B: achievementiconB
    },

    improvementIcon: {
        Y : improvementiconY,
        B : improvementiconB
    },

    teamAchievementImages: {
        Y: teamAchievementicomY,
        L: teamAchievementicomY,
        B: teamAchievementicomB
    },

    specialAchievementIcon: {
        Y: specialAchievementIcon,
        B: specialAchievementEmptyIcon
    },
    iconYearText: {
        Y: '#fff',
        B: "#fff"
    },
    popUp:{
        B:{
            backColor: 'rgb(237,194,115)',
            progressColor: 'rgba(255,255,255, 0.3)',
            textColor: '#f7e4c5'
        },
        Y:{
            backColor: 'rgb(90,194,189)',
            progressColor: '#9dd1cf',
            textColor: '#dfecec',
        },
    },
    editStatisticCalendar: {
        calendarBackground: 'transparent',
        textSectionTitleColor: colors.fontColor, //7ca6b4
        todayTextColor: colors.fontColor,
        dayTextColor: '#fff',
        textDisabledColor: '#c6c6c9',
        default: colors.fontColor,
        monthTextColor: '#fff',
        yearTextColor: colors.fontColor,
        textMonthFontSize: 24,
        textMonthFontFamily: Constant.font300,
        textDayHeaderFontFamily: Constant.font500,
        textDayFontFamily: Constant.font500,
        textDayFontWeight: '400',
    },
    statisticCalendar: {
        calendarBackground: "transparent",
        textSectionTitleColor: colors.fontColor,
        selectedDayTextColor: '#000',
        todayTextColor: '#03c3f9',
        dayTextColor: '#fff',
        textDisabledColor: '#47464a',
        monthTextColor: '#fff',
        yearTextColor: colors.fontColor,
        textMonthFontSize: 24,
        default: 'transparent',
        textMonthFontFamily: Constant.font300,
        textDayHeaderFontFamily: Constant.font500,
        textDayFontFamily: Constant.font500,
        textDayFontWeight: '400',
        editButton:{
            fontSize:14,
            color:colors.fontColor,
            fontFamily: Constant.font500,
        }
    },
    arrowColor: colors.fontColor,

    //Popup
    todayPopupBackgroundColor: colors.backColor,
    todayPopupBackOpacity: 0.8,
    aboutYouPopupBack: 'rgba(0,0,0,0.55)',

    //Navigation bar
    navDefaultColor: colors.cardBack,
    navBorderColor: colors.backColor,
    navTextColor: '#FFF',
    navBackArrow: 'rgba(255,255,255,0.8)',
    navSettingFillingTempted: 'rgb(231,72,24)',
    navSettingFillingTemptedBorder: 'rgb(231,72,24)',
    navSettingAudioActivity: 'rgb(49,165,159)',
    navSettingAudioActivityBorder: 'rgb(49,165,159)',
    navDetailTextColor: '#FFF',

    navDoneBtn: 'white',

    activityIndicator: '#fff',

    teamSetting: colors.smallBtn,
    teamSettingText: '#fff',

    teamDetailsRow: colors.lightBack,
    profileColor: colors.fontColor,
    rowSeperator: '#036383',
    textInputBackColor: '#01536d',
    textColor: '#fff',
    streakHelpBtn:colors.smallBtn,
    streakHelpText:'#fff',
    lighTextColor: '#fff',

    filterHelp: colors.grayTitle,
    filterSubTitle: '#a3a3a3',
    filterTitle: '#FFFFFF',
    headerIcon : 'icon_right_arrow_dark',
    headerIconLeft : 'icon_left_arrow_dark',

    communityClock: commnityClock,
    communitySeperator: colors.lightBack,
    communityBtn: colors.smallBtn,

    settingHeaderColor: colors.backColor,
    settingHeaderTextColor: 'white',
    settingGrayColor: '#333333',
    settingRowColor: colors.lightBack,
    settingRowPressIn: colors.fontColor,

    checkupHeaderDate: colors.headerBtn,
    checkupHeaderText: colors.headerBtn,
    checkupSeperator: colors.backColor,
    checkupOption: colors.progressBack,
    checkupBottomShadowStart: colors.lightBack,
    checkupBottomShadowEnd: '#52565C00',
    checkupCardAndroid: colors.lightBack,
    checkupCardAndroid2: colors.cardBack,

    shadow:  {
        shadowColor: '#000',
        shadowOffset:  {width: 2,height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 8.0,
        elevation: 2
    },

    shadowPopUp:  {
        shadowColor: '#000',
        shadowOffset:  {width: 4,height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 8.0,
        elevation: 2
    },

    audioLock: 'lock_icon_white',
    transaltionTagBack: '#45474B',
    navSingleLine: 'gray',

    professionalDetailText: '#FFF',
    professionalCancelText: '#FFF',
    professionDetail: '#FFF',
    professionReview: '#FFF',
    professionalChatBG: colors.backColor,
    professionalReceiverBubble: '#5ac2bc',
    professionalReceiverText: '#FFF',
    professionalLoadingBG: '#313335',
    professionalDotColor: 'white',

    storyHeaderBG: '#6aaeab',
    storyHeaderButton: '#03c3f9',

    newAppSelected: '#9551FF',

    newTabSelected: '#9551FF',
    newTabUnSelected: 'white',
    newUnderLine: '#333333',
    newLightGray: '#F0F0EF',
    newTitleText: '#FC8836',

    actionSheetText: 'white',
    popupModalBackground: colors.lightBack,
    popupModalBackground2: 'black',

    headerAnimationTitle: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: 'System',
        fontWeight: '700'
    },

}
