/**
 * Module represents the webhook controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class WebhookController {
  authorize(req, res, next) {
    // Checks if post request comes from gitlab
    if (req.headers['x-gitlab-token'] !== process.env.GITLAB_HOOK_SECRET) {
      res.status(403).send('Forbidden')
    } else {
      next()
    }
  }

  index (req, res, next) {
    req.body = {
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
  }

  postFromWebhook(req, res, next) {
    // console.log(req.body.object_attributes.test)
    // console.log(req.body.description) // namn på issue

    // console.log(req.body.temp)

    console.log('emit!!')
    res.io.emit('issue', { // sends data to clients using websocket
      avatar: req.body.avatar,
      title: req.body.title, // Sends title of issue to all clients (when modified/created or moved open-closed)
      desc: req.body.desc,
      status: req.body.state, // opened or closed
      action: req.body.action,
      id: req.body.id,
      iid: req.body.temp.iid
    })
    res.status(200).send('Post confirmed')
  }
}
