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
    let numberOfPages = 1
    await fetch(process.env.GITLAB_REPO_URL, {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
      }
    }).then(res => {
      numberOfPages = res.headers.raw()['x-total-pages']
      return res
    }).then(res => res.json()).then(json => {
      // console.log(json)
      issues = json
    }).catch(err => {
      console.log(err)
    })

    // console.log(issues)


    const pages = parseInt(numberOfPages[0])

    console.log(pages)

    if (pages > 1) {
      for (let i = 1; i < pages; i++) {
        console.log('i nr: ', i)
        const url = process.env.GITLAB_REPO_URL + '?page=' + (i + 1)
        await fetch(url, {
          method: 'get',
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
          }
        }).then(res => res.json()).then(json => {
          // console.log(typeof json)
          issues = [...issues, ...json]
        }).catch(err => {
          console.log(err)
        })
      }
    }

    console.log('result: ', issues.length)

    const issuesToView = []
  for (let i = 0; i < issues.length; i++) {
      let tempObj = {
        title: issues[i].title,
        description: issues[i].description,
        avatar: issues[i].author.avatar_url,
        id: issues[i].id,
        status: issues[i].state
      }

      issuesToView.push(tempObj)
      tempObj = {}
  }

    // console.log(issuesToView)

    res.render('issues/index', { issuesToView })
  }
}

