/**
 * Module represents the Issues controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * 
 */
export class IssuesController {
  index (req, res, next) {

    // Get issues from gitlab here!

    res.render('issues/index')
  }
}
