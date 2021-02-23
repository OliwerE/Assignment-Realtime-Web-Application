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
        iid: issues[i].iid,
        status: issues[i].state
      }

      issuesToView.push(tempObj)
      tempObj = {}
  }

    // console.log(issuesToView)

    res.render('issues/index', { issuesToView })
  }

  async getIssuePage (req, res, next) {
    try {
      console.log('GET ISSUE!!', req.params.id)
      const url = process.env.GITLAB_REPO_URL + '?iids[]=' + req.params.id
  
      const issue = await this.fetchIssues(url)
  
      console.log(issue[0][0])
  
      const viewData = {
        title: issue[0][0].title,
        description: issue[0][0].description,
        // avatar: issue[0].author.avatar_url,
        // id: issues[i].id,
        iid: issue[0][0].iid,
        status: issue[0][0].state
      }
  
      console.log(viewData)
  
      res.render('issues/issue', { viewData })
    } catch (err) {
      const error = new Error('Not Found')
      error.status = 404
      next(error)

    }


  }

  async getCloseIssue (req, res, next) {
    console.log('CLOSE PAGE!', req.params.id)

    const url = process.env.GITLAB_REPO_URL + '?iids[]=' + req.params.id

    const issue = await this.fetchIssues(url)

    console.log(issue[0][0])

    const viewData = {
      title: issue[0][0].title,
      iid: issue[0][0].iid
    }

    res.render('issues/close', { viewData })
  }

  async postCloseIssue (req, res, next) {
    console.log('POST987!')

    console.log(req.body.confirmBox)

    if (req.body.confirmBox === 'on') {

      const closeUrl = process.env.GITLAB_REPO_URL + '/' + req.params.id + '?state_event=close'

      await fetch(closeUrl, { // använd fetch metoden ist?
        method: 'put',
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })


      // close issue
    } else {
      const error = new Error('Internal Server Error') // Byt error? = när anv tar sig runt confirmbox!
      error.status = 500
      next(error)
    }

    res.redirect('./')
  }

  async getReopenIssue (req, res, next) {
    console.log('get reopen!')
    console.log(req.params.id)

    const url = process.env.GITLAB_REPO_URL + '?iids[]=' + req.params.id

    const issue = await this.fetchIssues(url) // liknar close issue! skapa delad metod?

    console.log(issue[0][0])

    const viewData = {
      title: issue[0][0].title,
      iid: issue[0][0].iid
    }

    res.render('issues/reopen', { viewData })
  }

  async postReopenIssue (req, res, next) {
    console.log('post reopen!')
    console.log(req.body.confirmBox)

    if (req.body.confirmBox === 'on') { // OBS NEDAN LIKNAR POST CLOSE ISSUE! slå ihop?

      const closeUrl = process.env.GITLAB_REPO_URL + '/' + req.params.id + '?state_event=reopen'

      await fetch(closeUrl, {
        method: 'put',
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })


      // close issue
    } else {
      const error = new Error('Internal Server Error') // Byt error? = när anv tar sig runt confirmbox!
      error.status = 500
      next(error)
    }

    res.redirect('./')
  }
}

