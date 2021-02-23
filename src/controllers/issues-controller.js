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
  async fetchIssues(url) {
    let issues
    let numberOfPages = 1
    await fetch(url, {
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
      }
    }).then(res => {
      numberOfPages = res.headers.raw()['x-total-pages']
      return res
    }).then(res => res.json()).then(json => {
      issues = json
    }).catch(err => {
      console.log(err)
    })

    return [issues, numberOfPages]
  }

  async index (req, res, next) { // fix this. then use fetchIssues instead


    const firstFetch = await this.fetchIssues(process.env.GITLAB_REPO_URL) // Array with number of pages & array of issues

    // console.log(issues)

    console.log(firstFetch)

    //const pages = parseInt(numberOfPages[0])

    //console.log(pages)

    let issues = firstFetch[0]
    const pages = firstFetch[1]


    if (pages > 1) { // OBS SAMMA ISSUES 2ggr!!
      for (let i = 1; i < pages; i++) {
        console.log('i nr: ', i)
        const url = process.env.GITLAB_REPO_URL + '?page=' + (i + 1)

        const newIssuePage = await this.fetchIssues(url)

        console.log(newIssuePage)

        issues = [...issues, ...newIssuePage[0]]
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

