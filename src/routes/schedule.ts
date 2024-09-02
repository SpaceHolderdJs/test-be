import express from 'express';
import { CronJob } from 'cron';
import { transporter } from '../nodemailer';

export const scheduleRoute = express.Router();

scheduleRoute.post('/', async (req, res) => {
  const {
    notificationInterval, // '1h' | '2h' | '3h' | '4h' | '5h' | '12h' | '24h' | ''
    notificationDay, // e.g., 'monday'
    notificationTime, // "HH:MM" format
    emailList, // Comma-separated string of email addresses
    search, // Search query
    score, // Relevancy score or any other relevant data
  } = req.body;

  const emails = emailList.split(',').map((email: string) => email.trim());

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
  } else {
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
    new CronJob(
      cronExpression,
      async () => {
        for await (const email of emails) {
          await transporter.sendMail({
            to: email,
            from: { name: 'Igor Sergienko', address: 'sergienko339@gmail.com' },
            subject: ``,
            html: `
                <h2>Hello!</h2>
                <p>
                    This is Igor Sergienko. You’ve requested notifications about ${search}.
                    Have a great day, Igor Sergienko
                </p>
            `,
          });
        }

        console.log(
          `Notification sent to ${emails.join(
            ', '
          )} at ${new Date().toISOString()}`
        );
      },
      null,
      true,
      'America/New_York'
    );

    res.status(200).json({
      message: `Notification scheduled successfully with interval ${
        notificationInterval || 'weekly'
      }`,
      cronExpression,
    });
  } catch (error) {
    console.error('Error scheduling cron job:', error);
    res.status(500).json({ message: 'Failed to schedule notification', error });
  }
});
