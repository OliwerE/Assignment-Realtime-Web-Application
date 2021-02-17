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

      newIssue.querySelector('#gravatar').setAttribute('src', '#') // fixa url, skickas inte från webhook!

      table.insertBefore(newIssue, table.firstChild)

      console.log(table)
    } else if (arg.action === 'reopen') {
      console.log('REOPEN!')
    } else if (arg.action === 'close') {
      console.log('ISSUE CLOSED!')
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
