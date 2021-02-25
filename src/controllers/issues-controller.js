/**
 * Module represents the Issues controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Class represents a controller for the issues.
 */
export class IssuesController {
  /**
   * Method gets issues from gitlab.
   *
   * @param {string} url - An url used to fetch issues from Gitlab.
   * @returns {Array} - An array with the fetched issues and number of pages.
   */
  async fetchIssues (url) {
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

  /**
   * Method gets issues from gitlab then renders a html page with a table as response.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async index (req, res, next) {
    const firstFetch = await this.fetchIssues(process.env.GITLAB_REPO_URL) // Array with number of pages & array of issues

    // console.log(issues)
    // console.log(firstFetch)

    let issues = firstFetch[0]
    const pages = firstFetch[1]

    if (pages > 1) {
      for (let i = 1; i < pages; i++) {
        const url = process.env.GITLAB_REPO_URL + '?page=' + (i + 1)
        const newIssuePage = await this.fetchIssues(url)
        issues = [...issues, ...newIssuePage[0]]
      }
    }

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

    res.render('issues/index', { issuesToView })
  }

  /**
   * Method gets a specific issue and renders a page with all edit alternatives.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getIssuePage (req, res, next) {
    try {
      console.log('GET ISSUE!!', req.params.id)
      const url = process.env.GITLAB_REPO_URL + '?iids[]=' + req.params.id

      const issue = await this.fetchIssues(url)

      console.log(issue[0][0])

      const viewData = {
        title: issue[0][0].title,
        iid: issue[0][0].iid
      }

      if (issue[0][0].state === 'opened') {
        viewData.status = issue[0][0].state
      }
      res.render('issues/issue', { viewData })
    } catch (err) {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * Method renders a confirm close issue page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
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

  /**
   * Method Close an issue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async postCloseIssue (req, res, next) {
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
    } else {
      const error = new Error('Internal Server Error') // Byt error? = när anv tar sig runt confirmbox!
      error.status = 500
      next(error)
    }
    res.redirect('./')
  }

  /**
   * Method Renders a confirm reopen page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
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

  /**
   * Method Reopens an issue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async postReopenIssue (req, res, next) {
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
    } else {
      const error = new Error('Internal Server Error') // Byt error? = när anv tar sig runt confirmbox!
      error.status = 500
      next(error)
    }
    res.redirect('./')
  }
}
