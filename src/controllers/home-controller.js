/**
 * Module represents the home controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import nodemon from "nodemon"

/**
 * 
 */
export class HomeController {
  index (req, res, next) {
    res.render('home/index')
  }
}
