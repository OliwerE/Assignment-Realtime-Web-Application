/**
 * Module represents the webhook controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class WebhookController {
  postFromWebhook(req, res, next) {
    console.log('Got post from gitlab webhook!')
  }
}

/* Skicka data till websocket
  res.io.emit('issue', {
    desc: 'test'
  })
*/
