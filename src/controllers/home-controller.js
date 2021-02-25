/**
 * Module represents the home controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class represents a controller for the issues.
 */
export class HomeController {
  /**
   * Renders start page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  index (req, res, next) {
    try {
      res.render('home/index')
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }
}
