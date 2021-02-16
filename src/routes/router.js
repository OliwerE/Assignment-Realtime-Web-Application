/**
 * Module represents the Router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './home-router.js'
import { router as issuesRouter } from './issues-router.js'
// import { CrudSnippetController } from '../controllers/crud-snippet-controller.js'

export const router = express.Router()

router.get('/', homeRouter)

router.use('/issues', issuesRouter)

// All other pages
router.use('*', (req, res, next) => {
  next(createError(404))
})
