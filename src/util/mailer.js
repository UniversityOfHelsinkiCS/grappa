import logger from '../util/logger';

const nodemailer = require('nodemailer');

const smtp = () => ({
    from: 'Grappa Robot <noreply@helsinki.fi>', // TODO: Move to env
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false // false -> TLS, true -> SSL
});

export async function sendEmail(to, subject, body, attachments) {
    const senderSettings = smtp();
    const transporter = nodemailer.createTransport(senderSettings);

    // if you don't want to spam people/yourself use this
    if (process.env.NODE_ENV !== 'production') {
        return logMail(to, subject, body, attachments);
    }

    logMail(to, subject, body, attachments);

    const options = {
        from: senderSettings.from,
        to,
        subject,
        text: body,
        attachments: attachments || []
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    }).catch((err) => {
        logger.error('Send mail error', { error: err.message });
    });
}

const logMail = (to, subject, body, attachments) => {
    logger.info('Email sent', { settings: smtp(), to, subject, body, attachments });
};
