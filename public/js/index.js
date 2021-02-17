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

      // Add content

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
