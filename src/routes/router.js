/**
 * Module represents the Router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as issuesRouter } from './issues-router.js'
import { router as webhookRouter } from './webhook-router.js'

export const router = express.Router()

router.get('/', (req, res, next) => res.send('Temp'))

router.use('/issues', issuesRouter)

router.use('/webhook', webhookRouter)

// All other pages
router.use('*', (req, res, next) => {
  next(createError(404))
})
