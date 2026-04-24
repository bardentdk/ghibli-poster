import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY manquante dans server/.env')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const RESEND_CONFIG = {
  defaultFrom: process.env.RESEND_FROM || 'Ghibli Poster Studio <noreply@ghibliposter.com>',
  defaultReplyTo: process.env.RESEND_REPLY_TO || 'contact@ghibliposter.com',
}