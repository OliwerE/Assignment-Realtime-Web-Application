import express from 'express'
import createError from 'http-errors'

export const router = express.Router()

// If not found
router.use('*', (req, res, next) => {
  next(createError(404))
})
