import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo'
import ENV_SETTING from '~/config/envSetting'
import path from 'path'
import fs from 'fs'
import Mustache from 'mustache'
import juice from 'juice'

// eslint-disable-next-line prefer-const
let apiInstance = new TransactionalEmailsApi()

apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, ENV_SETTING.BREVO_API_KEY)
// eslint-disable-next-line prefer-const
let verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/template-mail.html'), 'utf8')

const sendMail = async (recipientEmail: string, customSubject: string, templateData: Record<string, string>) => {
  const htmlContent = Mustache.render(verifyEmailTemplate, templateData)

  const inlineHtml = juice(htmlContent)

  // eslint-disable-next-line prefer-const
  let sendSmtpEmail = new SendSmtpEmail()
  sendSmtpEmail.sender = { email: ENV_SETTING.ADMIN_EMAIL_ADDRESS, name: ENV_SETTING.ADMIN_EMAIL_NAME }
  sendSmtpEmail.to = [{ email: recipientEmail }]
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = inlineHtml
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendMail
}
