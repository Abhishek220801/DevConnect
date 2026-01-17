import { SendEmailCommand } from "@aws-sdk/client-ses"
import { sesClient } from "./sesClient.js"

const sendEmail =  async ({to, from, subject, text, html}) => {
  const command = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html
        },
        Text: {
          Charset: 'UTF-8',
          Data: text
        },
      },
    },
  })
  return sesClient.send(command);
}

export default sendEmail;
