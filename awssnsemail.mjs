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

async function sendAssignmentSubmissionStatus(toEmail, assignmentName, downloadStatus) {

  let emailSubject;
  let emailBody;

  if (downloadStatus === 1)
  {
    emailSubject = 'Assignment Submission Status Successful';
    emailBody = `Assignment ${assignmentName} has been submitted successfully, stored in Google Cloud Storage`;
  }
  else
  {
    emailSubject = 'Assignment Submission Status Failure';
    emailBody = `Assignment : ${assignmentName} Submission Failed`;
  }


  const ccEmailListString = process.env.CCEMAILLIST;

  const ccEmailList = JSON.parse(ccEmailListString);

  const formattedCcList = ccEmailList.map(email => `"${email}"`).join(', ');

  const info = await transporter.sendMail({
    from: senderEmail,
    to: toEmail,
    cc: formattedCcList,
    subject: emailSubject,
    text: emailBody,
  });
  console.log(info);
  console.log(`Message sent to: ${toEmail}, messageId - ${info.messageId}.`);
}

// sendAssignmentSubmissionStatus("mohanrajaddluru@gmail.com", "assignmentName", 1)


export default sendAssignmentSubmissionStatus;