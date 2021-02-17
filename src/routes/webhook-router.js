/**
 * Module represents the webhook router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { WebhookController } from '../controllers/webhook-controller.js'

export const router = express.Router()

const controller = new WebhookController()

router.post('/issues', controller.authorize, controller.index, controller.postFromWebhook) // lägg till authorize och verifiera webhook token!

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
