import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issueTemplate')

/**
 * Runs websocket on the issue list page.
 */
const issueTable = function () {
  const socketPath = document.querySelector('base').getAttribute('href') + 'socket.io'
  const socketConnection = window.io('/', { path: socketPath }) // Creates a websocket connection

  socketConnection.on('issue', arg => { // When an issue is recieved
    if (arg.action === 'open') { // If new issue
      const table = document.querySelector('tbody')

      // Creates clone of issue template
      const newIssue = issueTemplate.content.cloneNode(true)

      // Add id
      newIssue.querySelector('tr').setAttribute('id', `issue${arg.id}`)

      // Add title
      newIssue.querySelector('#issueName a').textContent = arg.title

      // Add description
      if (arg.desc !== null) { // If an description exists
        newIssue.querySelector('#issueDescNewText').textContent = arg.desc
      }

      // Add gravatar url
      newIssue.querySelector('#gravatar').setAttribute('src', arg.avatar)

      // Add issue status
      newIssue.querySelector('#issueStatus').textContent = arg.status

      // Add issue url
      const td = newIssue.querySelectorAll('td a')
      for (let i = 0; i < 4; i++) {
        td[i].setAttribute('href', `./issues/issue/${arg.iid}/close`)
      }

      table.insertBefore(newIssue, table.firstChild) // Adds new issue in the table
    } else if (arg.action === 'reopen' || arg.action === 'close') { // When issue is closed or reopened
      // Changes issue status (opened or closed)
      const string = arg.id.toString()
      document.querySelector(`#issue${string} #issueStatus`).textContent = arg.status

      let url
      // Changes url to open or close form
      if (arg.action === 'close') {
        url = `./issues/issue/${arg.iid}/reopen`
      } else if (arg.action === 'reopen') {
        url = `./issues/issue/${arg.iid}/close`
      }

      const issueTd = document.querySelectorAll(`#issue${string} td a`)
      for (let i = 0; i < 4; i++) {
        issueTd[i].setAttribute('href', url)
      }
    } else if (arg.action === 'update') {
      const string = arg.id.toString()
      const issueTitle = document.querySelector(`#issue${string} #issueName a`)
      const issueDesc = document.querySelector(`#issue${string} #issueDesc a pre`)

      if (issueTitle.textContent !== arg.title) { // If name is changed
        issueTitle.textContent = arg.title
      }

      if (issueDesc.textContent !== arg.desc) { // If description is changed
        issueDesc.textContent = arg.desc
      }
    } else {
      console.error('Something went wrong! (websocket message)')
    }
  })
}

if (issueTemplate) { // Runs websocket if the issue template exist on the current webpage.
  issueTable()
}
