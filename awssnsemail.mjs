import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const smtpUser = process.env.SMTPUSER;
const smtpPassword = process.env.SMTPPASSWORD;
const smtpHost = process.env.SMTPHOST;
const senderEmail = process.env.SENDEREMAIL;
const smtpPort = process.env.SMTPPORT;



const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

async function sendAssignmentSubmissionStatus(toEmail, assignmentName) {
  const info = await transporter.sendMail({
    from: senderEmail,
    to: toEmail,
    subject: 'Assignment Submission Status Successful',
    text: `Assignment ${assignmentName} has been submitted successfully, stored in Google Cloud Storage`,
  });

  console.log(info);

  console.log(`Message sent to: ${toEmail}, messageId - ${info.messageId}.`);
}

// sendAssignmentSubmissionStatus('mohanawsa@gmail.com', 'Assignment 1')


export default sendAssignmentSubmissionStatus;