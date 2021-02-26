/**
 * Module represents the Issues router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// All issues
router.get('/', (req, res, next) => controller.index(req, res, next))

// Close issue
router.get('/issue/:id/close', (req, res, next) => controller.openedOrClosed(req, res, next, 'opened'), (req, res, next) => controller.getCloseIssue(req, res, next))
router.post('/issue/:id/close', (req, res, next) => controller.openedOrClosed(req, res, next, 'opened'), (req, res, next) => controller.postCloseIssue(req, res, next))

// Reopen issue
router.get('/issue/:id/reopen', (req, res, next) => controller.openedOrClosed(req, res, next, 'closed'), (req, res, next) => controller.getReopenIssue(req, res, next))
router.post('/issue/:id/reopen', (req, res, next) => controller.openedOrClosed(req, res, next, 'closed'), (req, res, next) => controller.postReopenIssue(req, res, next))

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
