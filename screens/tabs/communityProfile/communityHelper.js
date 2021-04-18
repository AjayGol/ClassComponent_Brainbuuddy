//Community helper
import {strLocale} from "locale";

const getCommunityTitle = (isCurrentUser, item) => {
    try {
        let name = isCurrentUser && strLocale("You") || item.user.name;

        switch (item.type) {
            case "posted_advice":
                return strLocale("statistic.name posted in Advice",{name});

            case "posted_help":
                return strLocale("statistic.name posted in Get Help",{name});

            case "posted_advice_comment":
                return strLocale("statistic.name commented in Advice",{name});

            case "posted_help_comment":
                return strLocale("statistic.name commented in Get Help",{name});

            case "received_advice_reply":
                return strLocale("statistic.name replied to your comment",{name: item.user.name});

            case "received_help_reply":
                return strLocale("statistic.name replied to your comment",{name: item.user.name});

            case "received_advice_heart":
                return strLocale("statistic.name hearted your post",{name: item.user.name});

            case "received_help_heart":
                return strLocale("statistic.name hearted your comment",{name: item.user.name});

            case "received_advice_comment_heart":
                return strLocale("statistic.name hearted your comment",{name: item.user.name});

            case "received_help_comment_heart":
                return strLocale("statistic.name hearted your comment",{name: item.user.name});

            case "received_advice_post_reply":
                return strLocale("statistic.name replied to your post",{name: item.user.name});

            case "received_help_post_reply":
                return strLocale("statistic.name replied to your comment",{name: item.user.name});

            case "received_team_invite":
                return strLocale("statistic.You invited name to join your team",{name: item.user.name});

            case "sent":
                return strLocale("statistic.You invited name to your team",{name: item.recipient.name});

            case "received":
                return strLocale("statistic.Invite to the name",{name: item.team.name});
        }
    } catch (e) {
        return "";
    }
}

const getCommunitySubTitle = (item) => {
    try {
        if (item.type === 'sent') {
            return strLocale("statistic.You invited name to join the team",{name: item.recipient.name,teamName: item.team.name});

        } else if (item.type === 'received') {
            if(item.sender.avatar_id < 46){
                return strLocale("statistic.name invited you to join his team",{name: item.sender.name});
            }
            return strLocale("statistic.name invited you to join her team",{name: item.sender.name});

        } else if (item.type === 'received_team_invite') {
            return strLocale("statistic.You invited name to join the team",{name: item.user.name,teamName: item.entity.team.name});
        }
        return item.entity.content || "";

    } catch (e) {
        return "";
    }
}

const alertType = {
    createNewTeam: 'createNewTeam',
    inviteUser: 'inviteUser',
    muteUnMute: 'muteUnMute',
    removeUser: 'removeUser',
    cancelInvite: 'cancelInvite',
    toomany:'toomany',
    fullTeamInvite:'fullTeamInvite',
    fullTeamAccept:'fullTeamAccept'
};

const alertData = (strLocale) => {
    return {
        createPrivateTeam: {
            objData: [{
                title: strLocale("alert.Create a private team first"),
                description: strLocale("alert.Create a private team first message")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        inYourTeam: {
            objData: [{
                title: strLocale("alert.Remove from team?"),
                description: strLocale("alert.Remove from team message")
            }],
            left: 'Cancel',
            right: 'Remove',
            isSinglebtn: false
        },
        toomanyInvites: {
            objData: [{
                title: strLocale("alert.Unable To Invite"),
                description: strLocale("alert.Unable To Invite message")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        fullTeamInvite: {
            objData: [{
                title: strLocale("alert.Your team is full"),
                description: strLocale("alert.Your team is full message")
            }],
            left: 'Okay',
            isSinglebtn: true
        },
        fullTeamAccept: {
            objData: [{
                title: strLocale("alert.The team is full"),
                description: strLocale("alert.The team is full message")
            }],
            left: 'Okay',
            isSinglebtn: true
        }
    }
}

export {
    getCommunitySubTitle,
    getCommunityTitle,
    alertData,
    alertType
};