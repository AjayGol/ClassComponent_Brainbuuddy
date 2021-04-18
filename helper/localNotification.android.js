import moment from 'moment';
import MessageList from '../screens/today/checkup/dailyCheckUp';
import PushNotification from 'react-native-push-notification';
import {getCurrentMonth} from "./appHelper";

const iconName = 'ic_stat_onesignal_default';

//Manage notification
export function manageNotification(checkupTime, lastCheckupDate, userName, settingNotifications, streakMessage) {
    //Clear all notification

    PushNotification.cancelAllLocalNotifications();

    //Morning Motivation
    if (settingNotifications.length > 0 && settingNotifications[0].isSelected) {
        let selectedTime = settingNotifications[0].hours || settingNotifications[0].selectedTime;

        if (selectedTime.toString().includes('am')){
            selectedTime = parseInt(selectedTime);
        }else if (selectedTime.toString().includes('pm')){
            selectedTime = parseInt(selectedTime) + 12;
        }

        manageMorningNotification(userName, 9, settingNotifications[0].minute, userName);
        manageDailyCheckUpNotification(selectedTime, lastCheckupDate, settingNotifications[0].minute, userName);
    }

    //Daily checkup
    if (settingNotifications.length > 0 && settingNotifications[0].isSelected) {
        // manageDailyCheckUpNotification(checkupTime, lastCheckupDate, settingNotifications[0].minute, userName);
        //missing Checkup
        missingYesterday(lastCheckupDate, userName, settingNotifications[0].minute);
    }

    //goal complete
    if (settingNotifications.length > 0 && settingNotifications[1].isSelected) {
        if (streakMessage !== "") {
            let streakTime = moment().add(1, 'days').toDate();
            streakTime.setHours(7);
            streakTime.setMinutes(0);
            streakTime.setSeconds(0);
            PushNotification.localNotificationSchedule({
                message: streakMessage,
                date: streakTime,
                largeIcon: iconName,
                smallIcon: iconName,
            });
        }
    }
    //Monthly Notification
    // setMonthlyNotification()
}

//Yesterday missing
export function missingYesterday(lastCheckupDate, userName, minute = 0) {
    let todayDate = moment().format("YYYY-MM-DD");
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let dayBeforeYesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');
    let hour = new Date().getHours();

   if (lastCheckupDate != todayDate) {
        let missedCheckupMessage = "Hi, " + userName + " " + 'You missed checkup yesterday. Complete now.' + "";
        let missedCheckupTime = moment().add(1, 'days').toDate();
        missedCheckupTime.setHours(9);
        missedCheckupTime.setMinutes(0);
        missedCheckupTime.setSeconds(0);
        PushNotification.localNotificationSchedule({
            message: missedCheckupMessage,
            date: missedCheckupTime,
            largeIcon: iconName,
            smallIcon: iconName,
        });
        let notDoneCheckupMessage = "Hi, " + userName + " " + 'You missed checkup yesterday. Complete now.' + "";
        let notDoneCheckup = moment().add(1, 'days').toDate();
        notDoneCheckup.setHours(18);
        notDoneCheckup.setMinutes(0);
        notDoneCheckup.setSeconds(0);
        PushNotification.localNotificationSchedule({
            message: notDoneCheckupMessage,
            date: notDoneCheckup,
            largeIcon: iconName,
            smallIcon: iconName,
        });
    }
}


//daily checkup message
export function manageDailyCheckUpNotification(checkupTime, lastCheckupDate, minute = 0, userName = '') {
    let hour = new Date().getHours();
    let todayDate = moment().format("YYYY-MM-DD");

    if (lastCheckupDate !== todayDate && hour < checkupTime) {
        setCheckUpData(checkupTime, 0, minute, userName);
    }
    // if(hour < checkupTime){
    //     setCheckUpData(checkupTime,0);
    // }
    setCheckUpData(checkupTime, 1, minute, userName);
    setCheckUpData(checkupTime, 2, minute, userName);
}

export function setCheckUpData(checkupTime, afterDay, minute = 0, userName = '') {
    try {

        let notificationDate = moment().toDate();
        if (afterDay > 0) {
            notificationDate = moment().add(afterDay, 'days').toDate();
        }
        notificationDate.setHours(checkupTime);
        notificationDate.setMinutes(minute);
        notificationDate.setSeconds(0);
        let notificationMessage = "Hi, " + userName + " " + "Your checkup time.";
        PushNotification.localNotificationSchedule({
            message: notificationMessage,
            date: notificationDate,
            largeIcon: iconName,
            smallIcon: iconName,
        });
        // console.log("---------Set Daily checkup notification after Days "+ afterDay + '-----------' )
    } catch (ex) {

    }
}

//Morning Motivation
export function manageMorningNotification(userName, motivationTime, minute = 0,) {
    let hour = new Date().getHours();
    let index = parseInt(moment.duration(moment(new Date()).diff(moment().startOf('year'))).asDays());
    let today = index;
    let tomorrow = 0;
    let dayAfterTomorrow = 0;
    if (index < 364) {
        tomorrow = index + 1;
        dayAfterTomorrow = index + 2;
    } else if (index === 364) {
        tomorrow = index + 1;
        dayAfterTomorrow = 1;
    } else if (index === 365) {
        tomorrow = 1;
        dayAfterTomorrow = 2;
    }
    if (hour < 9) {
        setMorningData(userName, today, 0, 9, minute, userName)
    }
    setMorningData(userName, tomorrow, 1, motivationTime, minute, userName);
    setMorningData(userName, dayAfterTomorrow, 2, motivationTime, minute, userName);
}

export function setMorningData(userName, index, afterDay, motivationHour, minute = 0) {
    try {

        let intHours = 8;
        if (typeof motivationHour == "number") {
            intHours = parseInt(motivationHour);
        }
        let motivationTime = moment().toDate();
        if (afterDay > 0) {
            motivationTime = moment().add(afterDay, 'days').toDate();
        }
        motivationTime.setHours(intHours);
        motivationTime.setMinutes(minute);
        motivationTime.setSeconds(0);

        let maximun = MessageList.length, minimum = 0;
        let randomnumber = Math.floor(Math.random() * (maximun - minimum)) + minimum;
        let quote = MessageList[randomnumber] || "";
        let motivationMessage = "Good morning " + userName + ". '" + quote + "'";

        PushNotification.localNotificationSchedule({
            message: motivationMessage,
            date: motivationTime,
            largeIcon: iconName,
            smallIcon: iconName,
        });
        //console.log("---------Set Daily Morning notification after Days "+ afterDay + 'with Quote '+ quote+ 'and index'+index+ '-----------' )
    } catch (ex) {
    }
}

export function setMonthlyNotification() {
    try {
        let nextYearMonth = 1;
        let startingLoop = 2;
        if (new Date().getDate() == 1 && new Date().getHours() < 8) {
            startingLoop = 2;
        }
        for (var i = startingLoop; i <= 7; i++) {
            let nextMonth = new Date().getMonth() + i;
            let year = new Date().getFullYear();
            if (nextMonth > 12) {
                nextMonth = nextYearMonth;
                nextYearMonth += 1;
                year = year + 1;
            }
            let monthFullname = getCurrentMonth(nextMonth - 1);

            let monthString = (nextMonth.toString().length == 1) && "0" + nextMonth || nextMonth;
            let dateString = year + "-" + monthString + "-" + "01";

            let monthlyDate = moment(dateString).toDate();  //YYYY-MM-DD
            monthlyDate.setHours(8);
            monthlyDate.setMinutes(0);
            monthlyDate.setSeconds(0);
            let monthlyMessage = monthFullname + " is here. Complete the " + monthFullname + " challenge and make this an amazing month.";
            PushNotification.localNotificationSchedule({
                message: monthlyMessage,
                date: monthlyDate,
                largeIcon: iconName,
                smallIcon: iconName,
            });
        }
    } catch (ex) {
    }
}
