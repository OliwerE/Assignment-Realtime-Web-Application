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
      console.log('auth!')
      next()
    }
  }

  index (req, res, next) {
    console.log('i hook index')
    
    //console.log(req.body.object_attributes)

    req.body = {
      description: req.body.object_attributes.title,
      done: false
    }
    

    console.log('börjar next')
    next()
  }

  postFromWebhook(req, res, next) {
    console.log('Got post from gitlab webhook!')

    //console.log(req.body.object_attributes.test)

    console.log(req.body.description) // namn på issue

    
    res.io.emit('issue', { // sends data to clients using websocket
      desc: req.body.description // Sends title of issue to all clients (when modified/created or moved open-closed)
    })
    
    

    res.status(200).send('Post confirmed')
  }
}

/* Skicka data till websocket
  res.io.emit('issue', {
    desc: 'test'
  })
*/
