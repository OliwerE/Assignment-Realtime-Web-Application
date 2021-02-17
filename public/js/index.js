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

      table.insertBefore(newIssue, table.firstChild)

      console.log(table)
    } else if (arg.action === 'reopen') {
      console.log('REOPEN!')

      const string = arg.id.toString()
      const selectTr = document.querySelector(`#issue${string} #issueStatus`)
      selectTr.textContent = '' // Removes old status
      const newStatusTextNode = document.createTextNode(arg.status)
      selectTr.appendChild(newStatusTextNode)

    } else if (arg.action === 'close') {
      console.log('ISSUE CLOSED!')

      const string = arg.id.toString()
      const selectTr = document.querySelector(`#issue${string} #issueStatus`)
      selectTr.textContent = '' // Removes old status
      const newStatusTextNode = document.createTextNode(arg.status)
      selectTr.appendChild(newStatusTextNode)

    } else if (arg.action === 'update') {
      // verifiera även om något har ändrats.. skickas även när öppnas/stängs issues..
      console.log('UPDATE!')
    } else {
      console.error('Something went wrong! (issue action)')
    }

    
  })
} else {
  console.log('not issues page!') // ta bort sen!
}
