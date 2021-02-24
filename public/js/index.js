import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issueTemplate')

if (issueTemplate) { // if issue template exist, the websocket connection is opened.
  console.log('Issues page!') // ta bort sen!
  const socketConnection = window.io()

  socketConnection.on('issue', arg => {
    console.log(arg)

    if (arg.action === 'open') {
      console.log('ADD ISSUE TO LIST!')
      const table = document.querySelector('tbody')

      // Adds table row into table
      const newIssue = issueTemplate.content.cloneNode(true)

      // add id
      newIssue.querySelector('tr').setAttribute('id', arg.id)

      // Add content
      const name = newIssue.querySelector('#issueName')
      const nameTextNode = document.createTextNode(arg.title)
      name.appendChild(nameTextNode)

      if (arg.desc !== null) {
        const desc = newIssue.querySelector('#issueDesc')
        const descTextNode = document.createTextNode(arg.desc)
        desc.appendChild(descTextNode)
      }

      newIssue.querySelector('#gravatar').setAttribute('src', arg.avatar)

      const status = newIssue.querySelector('#issueStatus')
      const statusTextNode = document.createTextNode(arg.status)
      status.appendChild(statusTextNode)

      // Add url

      // FIXA MED QUERYSELECTOR ALL!
     newIssue.querySelector('#issueName').setAttribute('href', `/issues/issue/${arg.iid}`)
     newIssue.querySelector('#issueDesc').setAttribute('href', `/issues/issue/${arg.iid}`)
     newIssue.querySelector('#issueGravatar').setAttribute('href', `/issues/issue/${arg.iid}`)
     newIssue.querySelector('#issueStatus').setAttribute('href', `/issues/issue/${arg.iid}`)
     
     // url.setAttribute('href', '/issues/test')
      // url.setAttribute('href', `/issues/issue/${arg.iid}`)

      console.log('iid!: ', arg.iid)

      table.insertBefore(newIssue, table.firstChild)



      console.log(table)
    } else if (arg.action === 'reopen') {
      console.log('REOPEN!')

      // obs likt close! skapa funk ist?
      const string = arg.id.toString()
      const selectTr = document.querySelector(`#issue${string} #issueStatus`)
      selectTr.textContent = '' // Removes old status
      const newStatusTextNode = document.createTextNode(arg.status)
      selectTr.appendChild(newStatusTextNode)

    } else if (arg.action === 'close') {
      console.log('ISSUE CLOSED!')

      // obs likt reopen! skapa funk ist?
      const string = arg.id.toString()
      const selectTr = document.querySelector(`#issue${string} #issueStatus`)
      selectTr.textContent = '' // Removes old status
      const newStatusTextNode = document.createTextNode(arg.status)
      selectTr.appendChild(newStatusTextNode)

    } else if (arg.action === 'update') {
      // verifiera även om något har ändrats.. skickas även när öppnas/stängs issues..
      console.log('UPDATE!')

      const string = arg.id.toString()
      const issueTitle = document.querySelector(`#issue${string} #issueName a`)
      const issueDesc = document.querySelector(`#issue${string} #issueDesc a`)

      // console.log(issueTitle.textContent)
      // console.log(issueDesc.textContent)

      if (issueTitle.textContent !== arg.title) {
        issueTitle.textContent = arg.title
      }

      if (issueDesc.textContent !== arg.desc) {
        issueDesc.textContent = arg.desc
      }

    } else {
      console.error('Something went wrong! (issue action)')
    }

    
  })
} else {
  console.log('not issues page!') // ta bort sen!
}
