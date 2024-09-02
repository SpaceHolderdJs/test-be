"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheduleRoute = void 0;
const express_1 = __importDefault(require("express"));
const cron_1 = __importDefault(require("cron"));
exports.sheduleRoute = express_1.default.Router();
exports.sheduleRoute.post('/', async (req, res) => {
    const { notificationInterval, // '1h' | '2h' | '3h' | '4h' | '5h' | '12h' | '24h' | ''
    notificationDay, // e.g., 'monday'
    notificationTime, // "HH:MM" format
    emailList, // Comma-separated string of email addresses
    search, // Search query
    score, // Relevancy score or any other relevant data
     } = req.body;
    // Log request body for debugging purposes
    console.log(req.body, 'body');
    // Parse emailList string into an array
    const emails = emailList.split(',').map((email) => email.trim());
    const [hour, minute] = notificationTime.split(':');
    let cronExpression;
    if (notificationInterval) {
        const intervalHours = parseInt(notificationInterval.replace('h', ''), 10);
        if (isNaN(intervalHours)) {
            return res
                .status(400)
                .json({ message: 'Invalid notification interval provided.' });
        }
        cronExpression = `${minute} */${intervalHours} * * *`;
    }
    else {
        const daysOfWeek = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];
        const dayOfWeekNumber = daysOfWeek.indexOf(notificationDay.toLowerCase());
        if (dayOfWeekNumber === -1) {
            return res
                .status(400)
                .json({ message: 'Invalid notification day provided.' });
        }
        cronExpression = `${minute} ${hour} * * ${dayOfWeekNumber}`;
    }
    try {
        const job = new cron_1.default.CronJob(cronExpression, () => {
            // sendEmails(emails, search, score);
            console.log(`Notification sent to ${emails.join(', ')} at ${new Date().toISOString()}`);
        }, null, true, 'America/New_York');
        res.status(200).json({
            message: `Notification scheduled successfully with interval ${notificationInterval || 'weekly'}`,
            cronExpression,
        });
    }
    catch (error) {
        console.error('Error scheduling cron job:', error);
        res.status(500).json({ message: 'Failed to schedule notification', error });
    }
});
// const sendEmails = (emails: string[], search: string, score: string) => {
//   emails.forEach((email) => {
//     // Replace this with your actual email sending logic
//     console.log(`Sending email to: ${email}`);
//     console.log(`Search Query: ${search}`);
//     console.log(`Relevancy Score: ${score}`);
//   });
// };
