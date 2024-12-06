import { renderPage } from "../../pageutils"

function Lobby() {
  return (
    <div>
      <div>
        QR Code
      </div>
      <div>
        Participants
      </div>
    </div>
  )
}

renderPage(<Lobby/>, {
  title: 'Dumber Dungeons - Lobby'
})
