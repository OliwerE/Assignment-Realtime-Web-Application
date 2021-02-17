/**
 * Module represents the Issues controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * 
 */
export class IssuesController {
fetchIssues(url) {
  console.log('Starts fetch')
  /*
  await fetch(url, {
    method: 'get',
    headers: {
    }
  }).then(response => {
    console.log(response)
    // return response.text()
  }).catch(err => {
    console.log(err)
    throw new Error('An error has occurred (getScraper)')
  })
  */
}

  async index (req, res, next) { // fix this. then use fetchIssues instead
    let issues
    await fetch('https://gitlab.lnu.se/api/v4/projects/12822/issues', {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
      }
    }).then(res => res.json()).then(json => {
      // console.log(json)
      issues = json
    }).catch(err => {
      console.log(err)
      throw new Error('An error has occurred (getScraper)')
    })

    const issuesToView = []
  for (let i = 0; i < issues.length; i++) {
      let tempObj = {
        title: issues[i].title,
        description: issues[i].description,
        avatar: issues[i].author.avatar_url
      }

      issuesToView.push(tempObj)
      tempObj = {}
  }

    console.log(issuesToView)

    res.render('issues/index', { issuesToView })
  }
}
