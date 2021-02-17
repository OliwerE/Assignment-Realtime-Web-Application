import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issueTemplate')

if (issueTemplate) { // if issue template exist, the websocket connection is opened.
  console.log('Issues page!') // ta bort sen!
  const socketConnection = window.io()

  socketConnection.on('issue', arg => {
    // console.log('Fick data från socket!')

    console.log(arg)
  })
} else {
  console.log('not issues page!') // ta bort sen!
}
