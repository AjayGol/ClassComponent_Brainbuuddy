
const metadataKeys = ["progress_desensitation","progress_hypofrontality","progress_wisdom","progress_dopamine_rewiring","progress_stress_control",
    "relapse_porn_bored","relapse_porn_stress","relapse_porn_anxiety","relapse_porn_tired","relapse_porn_alone","relapse_porn_pain",
    "relapse_porn_horny","relapse_porn_morning","relapse_porn_afternoon","relapse_porn_evening","relapse_porn_night","relapse_masturbation_morning",
    "relapse_masturbation_afternoon","relapse_masturbation_evening","relapse_masturbation_night",
    "tempted_porn_morning","tempted_porn_afternoon","tempted_porn_evening","tempted_porn_night",
    "tempted_porn_bored","tempted_porn_stress","tempted_porn_anxiety","tempted_porn_tired",
    "tempted_porn_alone","tempted_porn_pain","tempted_porn_horny",
    "tempted_masturbation_morning","tempted_masturbation_afternoon","tempted_masturbation_evening",
    "tempted_masturbation_night",
    "exercise_number_activity","exercise_number_audio","exercise_number_breathing","exercise_number_choose",
    "exercise_number_emotion","exercise_number_escape","exercise_number_faith","exercise_number_kegals","exercise_number_learn",
    "exercise_number_letters","exercise_number_meditation","exercise_number_slideshow","exercise_number_story","exercise_number_stress_relief",
    "exercise_number_thought_control","exercise_number_brain_training","exercise_number_video","exercise_number_visualization",
    "exercise_number_profile","improvement_mind",
    "improvement_energy","improvement_attraction","improvement_sleep","improvement_voice",
    "improvement_health","improvement_confidence","improvement_alive",
    "stressed_morning","stressed_afternoon","stressed_evening","stressed_night","registered_at","last_checkup_at", "tab_number_number","power_memory_number"];


const requestIdentifier = {
    CHECKUP: 'Checkup',
    REFRESH_DATA: 'Refresh Data',
    EDIT_CALENDAR: 'Edit Calendar',
    BEFORE_BEGIN: 'Before begin',
    PUBLIC_TEAM_SWAP: 'Public team swap',
};

module.exports = {
    requestIdentifier,
    metadataKeys,
    //API Constant
    //Doc https://docs.brainbuddyapp.com/
    baseUrl: 'https://go.brainbuddyapp.com/api/v1/',
    // baseUrl: 'https://staging.brainbuddyapp.com/api/v1/',
    baseUrlImage: 'https://staging.brainbuddyapp.com/img/professional_avatars/',
    signIn:'users/me/token',
    signUp:'users',

    // baseUrlV2: 'https://staging.brainbuddyapp.com/api/v2/',  // Staging
    baseUrlV2: 'https://go.brainbuddyapp.com/api/v2/', // Production

    getPornDays: 'porn-days',
    masturbationDays: 'masturbation-days',
    journalEntries: 'journal-entries',
    resolve: 'resolve',

    backupPost:'backups',
    getStatistic:'users/me/backups/latest',
    getTeam: 'users/me/team',
    getTeamDetail: 'team',
    getTeamChat:'users/me/team/chat/posts',
    sendMessage : 'chat/posts',
    postAdvice: 'advice/posts',
    likePostURL:'advice/posts/',
    unlikePostURL:'advice/hearts/',
    leaderBoardTeam : 'teams',

    // leaderBoardIndividual : 'users',
    // leaderBoardIndividualPornFreeDays : 'users?order_by=porn_free_days',
    // leaderBoardIndividualMonth : 'users?order_by=porn_free_days_for_current_month',
    // leaderBoardIndividualYear : 'users?order_by=porn_free_days_for_current_year',
    // leaderBoardIndividualWeek : 'users?order_by=porn_free_days_for_current_week',
    // leaderBoardIndividualCurrentStreak : 'users?order_by=current_porn_free_streak',
    // leaderBoardIndividualBestStreak : 'users?order_by=longest_porn_free_streak',
    // leaderBoardIndividualAmerica : 'users?region=america',
    // leaderBoardIndividualEurope : 'users?region=europe',
    // leaderBoardIndividualAsia : 'users?region=asia',
    // leaderBoardIndividualPacific : 'users?region=pacific',

    leaderBoardIndividual : 'user-rankings',
    leaderBoardIndividualPornFreeDays : 'user-rankings?sort_by=porn_free_days:total',
    leaderBoardIndividualCurrentStreak : 'user-rankings?sort_by=porn_free_days:current_streak',
    leaderBoardIndividualBestStreak : 'user-rankings?sort_by=porn_free_days:longest_streak',
    leaderBoardIndividualMonth : 'user-rankings?sort_by=porn_free_days:current_month',
    leaderBoardIndividualYear : 'user-rankings?sort_by=porn_free_days:current_year',
    leaderBoardIndividualWeek : 'user-rankings?sort_by=porn_free_days:current_week',
    leaderBoardIndividualAmerica : 'user-rankings?region=america',
    leaderBoardIndividualEurope : 'user-rankings?region=europe',
    leaderBoardIndividualAsia : 'user-rankings?region=asia',
    leaderBoardIndividualPacific : 'user-rankings?region=pacific',

    // leaderBoardTeamOverall : 'teams?order_by=porn_free_days',
    // leaderBoardTeamYear : 'teams?order_by=porn_free_days_for_current_year',
    // leaderBoardTeamMonth : 'teams?order_by=porn_free_days_for_current_month',
    // leaderBoardTeamWeek : 'teams?order_by=porn_free_days_for_current_week',

    leaderBoardTeamOverall : 'team-rankings',
    leaderBoardTeamYear : 'team-rankings?sort_by=porn_free_days:current_year',
    leaderBoardTeamMonth : 'team-rankings?sort_by=porn_free_days:current_month',
    leaderBoardTeamWeek : 'team-rankings?sort_by=porn_free_days:current_week',

    helpPost: 'help/posts/',
    metaData: 'meta/',
    userDetail: 'user/',
    letters: 'letters/',
    meditation: 'meditation/',

    postAdvicePagination: 'advice-posts',
    reportPost: 'report',

    helpPostPagination: 'help-posts',
    helpPostCommentPagination: 'comments',
    teamChatPagination: 'team-chats',

    mutes: 'mutes',
    mute: 'mute',
    users: 'users/',

    getDetails: "https://api.ipdata.co",
    user: 'user', //delete user key

    //Create User Archive Notification
    userArchiveNotification: 'user-archive-notifications',
    teamAchievements: 'team-achievements',

    //Community profile
    events: '/events',
    globals: 'globals',

    //change team
    teamList: 'teams',
    teamSwap: 'team-swap',
    createTeam: 'team',
    inviteInTeam: 'invites',
    getInvites: 'invites',
    acceptInvites: 'accept-invite',
    deleteMember: 'team/members/',

    //Professional chat
    professionalListing:'support-chats/professionals',
    userProfessionCurrentStatus:'support-chats/status',
    requestToProfessionalUser:'support-chats/request-professional',
    requestToRandomUser:'support-chats/request-random-professional',
    cancelRequestByUser: 'support-requests/',
    professionTeamchatPagination:'support-chats/',
    professionTeamchatSendMessage:'support-chats/',
    acceptRejectMoreTimeInvtation: 'support-chats/',
    userEndCurrentChatSession: 'support-chats/',
    postReview: 'support-chats/',
};