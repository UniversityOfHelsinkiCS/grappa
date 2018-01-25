const nodemailer = require('nodemailer');

const smtp = () => ({
    from: 'Grappa Robot <noreply@helsinki.fi>', // TODO: Move to env
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false // false -> TLS, true -> SSL
});

export default async function sendEmail(to, subject, body, attachments) {
    const senderSettings = smtp();
    const transporter = nodemailer.createTransport(senderSettings);

    // if you don't want to spam people/yourself use this
    if (process.env.NODE_ENV !== 'production') {
        return logMail(to, subject, body, attachments);
    }

    console.log('Email sent, in production');
    await logMail(to, subject, body, attachments);

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
                console.log(err);
                reject(err);
            } else {
                resolve(info);
            }
        });
    }).catch(err => {
        console.error('EmailSender sendEmail ERRORED:');
        console.error(err);
    });
}

const logMail = (to, subject, body, attachments) => {
    console.log('----------------');
    console.log('SETTINGS:', smtp());
    console.log('TO:', to);
    console.log('SUBJECT:', subject);
    console.log('BODY:', body);
    console.log('ATTACHMENTS:', attachments);
    console.log('----------------');
    return Promise.resolve();
};
