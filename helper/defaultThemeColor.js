import {Platform} from "react-native";

const Constant = {
    font300: (Platform.OS === 'android') ? 'MuseoSans_300': 'MuseoSans-300',
    font500: (Platform.OS === 'android') ? 'MuseoSans_500': 'MuseoSans-500',
    font700: (Platform.OS === 'android') ? 'MuseoSans_700': 'MuseoSans-700'
}

const achievementiconY = {
    "1": {uri: 'achievement_icon_success_1'},
    "3": {uri: 'achievement_icon_success_3'},
    "5": {uri: 'achievement_icon_success_3'},
    "7": {uri: 'achievement_icon_success_7'},
    "10": {uri: 'achievement_icon_success_7'},
    "14": {uri: 'achievement_icon_success_14'},
    "21": {uri: 'achievement_icon_success_14'},
    "30": {uri: 'achievement_icon_success_30'},
    "45": {uri: 'achievement_icon_success_30'},
    "60": {uri: 'achievement_icon_success_30'},
    "75": {uri: 'achievement_icon_success_30'},
    "90": {uri: 'achievement_icon_success_90'},
    "120": {uri: 'achievement_icon_success_90'},
    "180": {uri: 'achievement_icon_success_180'},
    "270": {uri: 'achievement_icon_success_180'},
    "365": {uri: 'achievement_icon_success_365'},

    "450": {uri: 'achievement_icon_success_400'},
    "520": {uri: 'achievement_icon_success_500'},
    "600": {uri: 'achievement_icon_success_600'},
    "730": {uri: 'achievement_icon_success_700'},
    "800": {uri: 'achievement_icon_success_800'},
    "920": {uri: 'achievement_icon_success_900'},
    "1000": {uri: 'achievement_icon_success_1000'},
};
const achievementiconB = {
    "1": {uri: 'achievement_icon_empty_1_white'},
    "3": {uri: 'achievement_icon_empty_3_white'},
    "7": {uri: 'achievement_icon_empty_7_white'},
    "14": {uri: 'achievement_icon_empty_14_white'},
    "30": {uri: 'achievement_icon_empty_30_white'},
    "90": {uri: 'achievement_icon_empty_90_white'},
    "180": {uri: 'achievement_icon_empty_180_white'},
    "365": {uri: 'achievement_icon_empty_365_white'},

    "400": {uri: 'achievement_icon_empty_400_white'},
    "500": {uri: 'achievement_icon_empty_500_white'},
    "600": {uri: 'achievement_icon_empty_600_white'},
    "700": {uri: 'achievement_icon_empty_700_white'},
    "730": {uri: 'achievement_icon_empty_730_white'},
    "800": {uri: 'achievement_icon_empty_800_white'},
    "900": {uri: 'achievement_icon_empty_900_white'},
    "1000": {uri: 'achievement_icon_empty_1000_white'},
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
    alive: {uri: 'improvement_alive_empty_white'},
    attraction: {uri: 'improvement_attraction_empty_white'},
    confidence: {uri: 'improvement_confidence_empty_white'},
    energy: {uri: 'improvement_energy_empty_white'},
    health: {uri: 'improvement_health_empty_white'},
    mind: {uri: 'improvement_zen_empty_white'},
    sleep: {uri: 'improvement_sleep_empty_white'},
    voice: {uri: 'improvement_voice_empty_white'},
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
    "10": {uri: 'achievement_team_empty_10_white'},
    "30": {uri: 'achievement_team_empty_30_white'},
    "50": {uri: 'achievement_team_empty_50_white'},
    "100": {uri: 'achievement_team_empty_100_white'},
    "180": {uri: 'achievement_team_empty_180_white'},
    "365": {uri: 'achievement_team_empty_365_white'},
    "500": {uri: 'achievement_team_empty_500_white'},
    "1000": {uri: 'achievement_team_empty_1000_white'},

    "1500": {uri: 'achievement_team_empty_1500_white'},
    "2000": {uri: 'achievement_team_empty_2000_white'},
    "2500": {uri: 'achievement_team_empty_2500_white'},
    "3000": {uri: 'achievement_team_empty_3000_white'},
    "3500": {uri: 'achievement_team_empty_3500_white'},
    "4000": {uri: 'achievement_team_empty_4000_white'},
    "4500": {uri: 'achievement_team_empty_4500_white'},
    "5000": {uri: 'achievement_team_empty_5000_white'},
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
    "0": {uri: 'special_achievement_jan_empty_white'},
    "1": {uri: 'special_achievement_feb_empty_white'},
    "2": {uri: 'special_achievement_mar_empty_white'},
    "3": {uri: 'special_achievement_apr_empty_white'},
    "4": {uri: 'special_achievement_may_empty_white'},
    "5": {uri: 'special_achievement_jun_empty_white'},
    "6": {uri: 'special_achievement_jul_empty_white'},
    "7": {uri: 'special_achievement_aug_empty_white'},
    "8": {uri: 'special_achievement_sep_empty_white'},
    "9": {uri: 'special_achievement_oct_empty_white'},
    "10": {uri: 'special_achievement_nov_empty_white'},
    "11": {uri: 'special_achievement_dec_empty_white'},
};

const commnityClock = {uri:'community_time_icon_white'}

const color = {
    'white' : 'white',
    'black' : 'black',
    'disable' : '#D3D3D3',
    'lightBack': '#212224',
    'lightGreen' : '#3AD29F',
    'pageDisable': '#F0F1F9',
    'gray' : 'gray',
    'violetColor': 'rgb(121,120,253)',
    'darkVioletColor': '#564df0',
};

module.exports = {
    appBackground: "white",
    appLighBackground: "#01536d",
    statusBarStyle: "dark-content",
    themeFont: '#fff',
    lightBack: '#f0f0f0',

    //Today
    todayLighBackground: "#f0f0f0",
    todayHeaderTitle: '#707078',
    cardSubSection: "#f9f9f9",
    cardBack: "#FFF",
    cardBackNew: "#FFF",
    cardSubTitle: '#A9A9A9',
    titleTheme: '#9551FF',
    titleCommunity: '#EBA465',
    titleDailyTracker: '#84B155',
    titleNotificationSetting: '#587A9E',
    titleTeamTab: '#D96BA9',

    circularBarOtherColor: "#00536e",

    //Font colors
    defaultFont : '#000',
    subTitile :'rgb(184,198,205)',
    // cardSubTitle: '#aec8d1',
    headerTitle: '#a4b6bf',
    topTodayRemainig: "#b8bfcf",

    appBackgroundWhite: "white",
    appBackground20: 'white',
    titleColor20: '#000000',
    titleColor20Black: '#000000',

    navTitleMain: "#666B80",
    titleMain: '#000000',
    subTitleMain: 'gray',
    subTitleExercise: '#8C8D8D',

    analysisProgressText: '#9551FF',
    progressBG: '#F5F6F5',
    levelProgress: '#F0F0EF',

    // cardBack: "#5d879b",
    // cardSubSection: "#386980",
    pogressBarOtherColor: "#00536e",
    replayMorningRoutine: {uri:'icon_replay_exercise'},

    viewCompletedBtn: '#03c3f9',
    viewCompletedText: '#FFF',
    // viewCompletedBtn: '#003e53',
    // viewCompletedText: '#dee1e3',

    scrollableBack: '#003e53',
    customInactiveFont: '#707078',
    scrollableActiveFont: '#fff',
    scrollableInactiveFont: 'rgb(42,111,134)',

    scrollableViewBack: '#FFF',
    changeAvatar: 'rgb(22,93,120)',

    rowView: '#fff',
    progressBarTitle:"#707078",
    progressBarLine:"#f2f2f2",
    rewiredprogressBarOtherColor: '#f2f2f2',

    verProgressBottomTitle: '#707078',

    streackCountText: '#87beb9',

    senderBubble: '#9551FF',
    selectedSenderBubble: '#22aad6',
    selectedSenderText: '#fff',
    receiverBubble: '#f3f3f3',
    selectedReceiverBubble: '#dcdcdc',
    receiverBubbleText: '#000',
    bottomChatInner: '#f0f0f0',
    bottomChatPlaceholder: "#707078",
    bottomChatText: "#000",

    chatUsername: '#000',
    chatDateTime: '#acb7bd',

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

    createPostCancel: 'white',

    commentViewBack: '#FFF',
    commentHeader: '#f0f0f0',
    commentView: '#FFF',

    moreRow: '#FFF',
    pressInMoreRow: '#d9d8d8',
    moreSeparator: '#e4e4e4',
    separateLine: '#D3D3D3',

    settingBtn: "#01536d",
    settingBtnText: "#fff",

    verProgressbarBack: '#d8f4f3',
    verProgressbarOrangeBack: '#ffddd4',

    sliderBack: '#eee',
    sliderTop: '#fff',
    sliderText: '#707078',
    selectedTabText: '#707078',

    // verProgressbarBack: '#1a7181',
    // verProgressbarOrangeBack: '#b48578',

    yesDate:{color: 'rgb(132,177,58)',textAlign:'center',textColor:'#fff'},

    noDate: {color: 'rgb(255,0,0)',textAlign:'center',textColor:'#fff'},

    yesEditDate: {color: '#9551FF', textAlign: 'center', textColor: 'black'},

    noEditDate: {color: '#FF0000',textAlign:'center',textColor:'black'},

    greenSpin: {color: '#fff',textAlign:'center',textColor:'#4b4b4b',
        spinner:{uri: 'calendar_spinner_green'}},

    redSpin: {color: '#fff',textAlign:'center',textColor:'#4b4b4b',
        spinner:{uri: 'calendar_spinner_red'}},

    graySpin: {color: '#fff',textAlign:'center',textColor:'#4b4b4b',
        spinner:{uri: 'calendar_spinner_gray'}},

    //Leaderboard
    leaderBoradRank: '#707078',
    leaderboardRowBackColor: '#e6f7fe',
    leaderBoardClose: '#e4e4e4',
    leaderBoardCloseIcon: 'leaderboard_close',
    leaderBoardFooter: '#707078',

    borderBottom: '#e4e4e4',
    //Tabbar
    tabbarBack: '#fff',
    tabbarTopBorder: '#F0F0F0',
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
        feelingTampered: 'icon_sossetting',
        trainingSection: 'icon_trainingsetting',
        journal: 'icon_journalsetting',
        completedExercise: 'icon_audiosetting',
        internetFilterIcon: 'icon_internetfiltersetting',
        settings: 'icon_settingsetting'
    },
    // tabbarBack: '#01536d',
    // tabbarTopBorder: '#026485',
    // tabIcon: {
    //     Today: 'tab_nav_icon_1',
    //     Statistic: 'tab_nav_icon_2',
    //     Team: 'tab_nav_icon_3',
    //     Milestone: 'tab_nav_icon_4',
    //     More: 'tab_nav_icon_5',
    // },
    // selectedTabIcon: {
    //     Today: 'tab_nav_icon_1_selected',
    //     Statistic: 'tab_nav_icon_2_selected',
    //     Team: 'tab_nav_icon_3_selected',
    //     Milestone: 'tab_nav_icon_4_selected',
    //     More: 'tab_nav_icon_5_selected',
    // },

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
        textSectionTitleColor: '#c9d3db', //7ca6b4
        todayTextColor: '#9551FF',
        dayTextColor: '#4b4b4b',
        textDisabledColor: '#bebec1',
        default: '#c9d3db',
        monthTextColor: '#4b4b4b',
        yearTextColor: '#4b4b4b',
        textMonthFontSize: 24,
        textMonthFontFamily: Constant.font300,
        textDayHeaderFontFamily: Constant.font300,
        textDayFontFamily: Constant.font500,
        textDayFontWeight: '400',
    },
    statisticCalendar: {
        calendarBackground: "transparent",
        textSectionTitleColor: 'black',
        selectedDayTextColor: '#000',
        todayTextColor: '#9551FF',
        dayTextColor: '#000',
        textDisabledColor: '#D3D3D3',
        monthTextColor: '#84B155', //EF9D6F
        yearTextColor: '#84B155', //EF9D6F
        textMonthFontSize: 23,
        default: 'transparent',
        // textMonthFontFamily: Constant.font700,
        textMonthFontWeight: '900',
        textDayHeaderFontFamily: Constant.font500,
        textDayFontFamily: Constant.font500,
        // textDayFontWeight: '300',
        textDayFontSize: 19,
        editButton:{
            fontSize:14,
            color:'#707078',
            fontFamily: Constant.font500,
        }
    },
    arrowColor: '#707078',

    //Popup
    todayPopupBackgroundColor: '#173d51',
    todayPopupBackOpacity: 1.0,
    aboutYouPopupBack: 'rgba(0,0,0,0.55)',

    //Navigation bar
    navDefaultColor: '#9551FF',
    navBorderColor: '#003e53',
    navTextColor: '#FFF',
    navBackArrow: 'rgba(255,255,255,0.8)',
    navSettingFillingTempted: 'rgb(231,72,24)',
    navSettingFillingTemptedBorder: 'rgb(231,72,24)',
    navSettingAudioActivity: 'rgb(49,165,159)',
    navSettingAudioActivityBorder: 'rgb(49,165,159)',
    navDetailTextColor: '#a7b0b5',

    navDoneBtn: '#a7b0b6',

    activityIndicator: '#707078',

    teamSetting: '#f2f2f2',
    teamSettingText: '#707078',
    teamDetailsRow: '#e2f8ff',
    profileColor: '#707078',
    rowSeperator: '#036383',
    textInputBackColor: '#01536d',
    textColor: '#fff',
    streakHelpBtn:'#0f3244',
    streakHelpText:'#a6adb2',
    lighTextColor: '#4e4e4e',

    filterHelp: '#4e4e4e',
    filterSubTitle: '#a3a3a3',
    filterTitle: '#343434',
    headerIcon : 'icon_right_arrow',
    headerIconLeft : 'icon_left_arrow',

    communityClock: commnityClock,
    communitySeperator: '#e4e4e4',
    communityBtn: '#22485b',

    settingHeaderColor: 'rgb(239,239,244)',
    settingHeaderTextColor: '#a4b6bf',
    settingGrayColor: '#D7D7D7',
    settingRowColor: '#fff',
    settingRowPressIn: '#dcdbdb',

    checkupHeaderDate: '#a7b0b5',
    checkupHeaderText: '#7b8992',
    checkupSeperator: '#f0f0f0',
    checkupOption: '#bbeefc',
    checkupBottomShadowStart: '#FFFFFF',
    checkupBottomShadowEnd: '#E6E6E600',
    checkupCardAndroid: '#F0F0F0',
    checkupCardAndroid2: '#F8F3E9',

    shadow:  {
        shadowColor: '#000000',
        shadowOffset:  {width: 2,height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 8.0,
        elevation: 2
    },

    shadowPopUp:  {
        shadowColor: '#000000',
        shadowOffset:  {width: 4,height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 8.0,
        elevation: 2
    },

    audioLock: 'lock',
    transaltionTagBack: '#c5c7cc',
    navSingleLine: 'gray',

    professionalDetailText: 'black',
    professionalCancelText: 'black',
    professionDetail: '#525252',
    professionReview: '#FFF',
    professionalChatBG: 'white',
    professionalReceiverBubble: '#5ac2bc',
    professionalReceiverText: '#FFF',
    professionalLoadingBG: '#e6e7ed',
    professionalDotColor: '#9e9ea1',

    storyHeaderBG: '#6aaeab',
    storyHeaderButton: '#03c3f9',

    newAppSelected: '#9551FF',

    newTabSelected: '#9551FF',
    newTabUnSelected: '#919192',
    newUnderLine: '#F5F6F5',
    newLightGray: '#F0F0EF',
    newTitleText: '#FC8836',

    actionSheetText: color.lightGreen,
    popupModalBackground: color.white,
    popupModalBackground2: '#e5e5e5',

    headerAnimationTitle: {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
        fontFamily: 'System',
        fontWeight: '700'
    },
}
