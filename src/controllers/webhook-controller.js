/**
 * Module represents the webhook controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class represents a webhook controller.
 */
export class WebhookController {
  /**
   * Method checks if the post request comes from gitlab.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  authorize (req, res, next) {
    try {
      if (req.headers['x-gitlab-token'] !== process.env.GITLAB_HOOK_SECRET) { // If gitlab token does not equal server secret
        res.status(403).send('Forbidden')
      } else {
        next()
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Method modifies the request body.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  index (req, res, next) {
    try {
      req.body = { // Create request body with wanted data
        avatar: req.body.user.avatar_url,
        title: req.body.object_attributes.title,
        desc: req.body.object_attributes.description,
        state: req.body.object_attributes.state,
        action: req.body.object_attributes.action,
        id: req.body.object_attributes.id,
        temp: req.body.object_attributes,
        done: false
      }
      next()
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  /**
   * Method confirms webhook from gitlab and sends the data to all websocket clients.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  postFromWebhook (req, res, next) {
    try {
      res.io.emit('issue', { // Sends new issue change to all connected clients using websocket
        avatar: req.body.avatar,
        title: req.body.title,
        desc: req.body.desc,
        status: req.body.state,
        action: req.body.action,
        id: req.body.id,
        iid: req.body.temp.iid
      })
      res.status(200).send('Post confirmed') // Confirms post to gitlab
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }
}
