import PushNotificationIOS from "@react-native-community/push-notification-ios";
import moment from 'moment';
import MessageList from '../screens/today/checkup/dailyCheckUp';
import {getCurrentMonth, isValidDate} from "./appHelper";
import PushNotification from 'react-native-push-notification';
import de from "./locale/de";


//Manage notification
export function manageNotification(checkupTime, lastCheckupDate, userName, settingNotifications, streakMessage) {

    // PushNotification.cancelAllLocalNotifications();
    //
    // //Clear all notification
    // let streakTime11 = moment().toDate();
    // streakTime11.setHours(16);
    // streakTime11.setMinutes(0);
    // streakTime11.setSeconds(0);
    // PushNotification.localNotificationSchedule({
    //     //... You can use all the options from localNotifications
    //     message: "My Notification Message 16", // (required)
    //     date: streakTime11 // in 60 secs
    // });
    //

    // PushNotificationIOS.scheduleLocalNotification({
    //     fireDate: new Date(Date.now() + (30 * 1000)),
    //     alertBody: "My Notification Message",
    // });

    PushNotificationIOS.cancelAllLocalNotifications();
    PushNotification.cancelAllLocalNotifications();

    if (!lastCheckupDate && !checkupTime) {
        return;
    }

    //Daily checkup
    if (settingNotifications.length > 0 && settingNotifications[0].isSelected) {
        let selectedTime = settingNotifications[0].hours || settingNotifications[0].selectedTime;
        if (selectedTime.toString().includes('am')){
            selectedTime = parseInt(selectedTime);
        }else if (selectedTime.toString().includes('pm')){
            selectedTime = parseInt(selectedTime) + 12;
        }

        manageDailyCheckUpNotification(parseInt(selectedTime), lastCheckupDate, settingNotifications[0].minute || 0, userName);

        //missing Checkup
        missingYesterday(lastCheckupDate, userName);
    }

    // Motivation Motivation
    if (settingNotifications.length > 0 && settingNotifications[2].isSelected) {
        manageMorningNotification(userName, 9, 0);
    }

    // //goal complete
    // if (settingNotifications.length > 0 && settingNotifications[1].isSelected) {
    //     if (streakMessage !== "") {
    //         let streakTime = moment().add(1, 'days').toDate();
    //         streakTime.setHours(7);
    //         streakTime.setMinutes(0);
    //         streakTime.setSeconds(0);
    //         if (isValidDate(streakTime) && streakMessage) {
    //             PushNotification.localNotificationSchedule({
    //                 message: streakMessage,
    //                 date: streakTime
    //             });
    //         }
    //     }
    // }

    //Monthly Notification
    // setMonthlyNotification();

}

//Yesterday missing
export function missingYesterday(lastCheckupDate, userName) {

    try {
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
            if (isValidDate(missedCheckupTime) && missedCheckupMessage) {

                PushNotification.localNotificationSchedule({
                    message: missedCheckupMessage,
                    date: missedCheckupTime
                });
            }
            let notDoneCheckupMessage = "Hi, " + userName + " " + 'You missed checkup yesterday. Complete now' + "";
            let notDoneCheckup = moment().add(1, 'days').toDate();
            notDoneCheckup.setHours(18);
            notDoneCheckup.setMinutes(0);
            notDoneCheckup.setSeconds(0);
            if (isValidDate(notDoneCheckup) && notDoneCheckupMessage) {

                PushNotification.localNotificationSchedule({
                    message: notDoneCheckupMessage,
                    date: notDoneCheckup
                });
            }
        }

    } catch (e) {
        // alert('missingYesterday', e);
    }
}


//daily checkup message
export function manageDailyCheckUpNotification(checkupTime, lastCheckupDate, minute = 0, name = '') {
    let hour = new Date().getHours();
    let todayDate = moment().format("YYYY-MM-DD");

    if (lastCheckupDate !== todayDate && hour < checkupTime) {
        setCheckUpData(checkupTime, 0, minute, name);
    }
    // if(hour < checkupTime){
    //     setCheckUpData(checkupTime,0);
    // }
    setCheckUpData(checkupTime, 1, minute, name);
    setCheckUpData(checkupTime, 2, minute, name);
}

export function setCheckUpData(checkupTime, afterDay, minute = 0, name = '') {
    try {
        let notificationDate = moment().toDate();
        if (afterDay > 0) {
            notificationDate = moment().add(afterDay, 'days').toDate();
        }
        notificationDate.setHours(checkupTime);
        notificationDate.setMinutes(minute);
        notificationDate.setSeconds(0);
        let notificationMessage = "Hi, " + name + " " + "Your checkup time.";

        if (isValidDate(notificationDate) && notificationMessage) {
            PushNotification.localNotificationSchedule({
                message: notificationMessage,
                date: notificationDate
            });
        }
    } catch (ex) {
    }
}

//Morning Motivation
export function manageMorningNotification(userName, motivationTime = 9, minute) {

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
    if (hour < motivationTime) {
        console.log('set Morning notification - today')
        setMorningData(userName, today, 0, motivationTime, minute);
    }
    console.log('set Morning notification - tomorrow')
    setMorningData(userName, tomorrow, 1, motivationTime, minute);
    console.log('set Morning notification - dayAfterTomorrow')
    setMorningData(userName, dayAfterTomorrow, 2, motivationTime, minute);
}

export function setMorningData(userName, index, afterDay, motivationHour, minute) {
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

        let maximun=MessageList.length,minimum=0;
        let randomnumber = Math.floor(Math.random() * (maximun - minimum)) + minimum;
        let quote = MessageList[randomnumber] || "";
        let motivationMessage = "Good morning " + userName + ". '" + quote + "'";
        if (isValidDate(motivationTime) && motivationMessage) {

            PushNotification.localNotificationSchedule({
                message: motivationMessage,
                date: motivationTime
            });
        }
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
            let monthlyMessage = monthFullname + ', please complete challenage'

            if (isValidDate(monthlyDate) && monthlyMessage) {

                PushNotification.localNotificationSchedule({
                    message: monthlyMessage,
                    date: monthlyDate
                });
            }

        }
    } catch (ex) {
    }
}
