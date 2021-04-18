import Constant from '../../helper/constant';
export const statisticDefault = {
    backup_data:{
        userName:'Unknown'
    },
    j_array: [],

    other_detail:[],

    journal_date_wise_list: {},

    pornDetail: {
        p_array: [],
        p_no_array: [],
        p_yes_array: [],
        clean_p_days_per_month:{},
        relapsed_p_days_per_weekdays:[],
        total_p_clean_days:'',
        current_p_clean_days:'',
        best_p_clean_days:'',
    },
    pornWhyIRelapse: Constant.defalutWhyChart,
    pornWhyITempted: Constant.defalutWhyChart,
    pornWhenIRelapse: Constant.defalutWhenChart,
    pornWhenITempted: Constant.defalutWhenChart,
    pornWhenIStressed: Constant.defalutWhenChart,
    mosturbutionDetail : {
        m_array: [],
        m_no_array: [],
        m_yes_array: [],
        clean_m_days_per_month:{},
        relapsed_m_days_per_weekdays:[],
        total_m_clean_days:'',
        current_m_clean_days:'',
        best_m_clean_days:'',
    },
    totalRewiringPercentage: 0,
    circularRewiringPercentage: 4,
    masturbationWhenIRelapse: Constant.defalutWhenChart,
    masturbationWhenITempted: Constant.defalutWhenChart,

    currentGoal: {
        Heading: "",
        Description: "",
        per: 4, //0 means 4%
        goalDays: 1,
        previousAchieved: 0,
        previousMessage: "",
        goalName: '',
        goalIndex: 0
    },
    journal_total: {
        right: 0,
        wrong: 0,
    },
    meditationDetail: {
        m_array:[]
    },
    meditaionYearDetail: {}
};
