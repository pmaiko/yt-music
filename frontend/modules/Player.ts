export interface Playlist {
  id: string,
  src: string
}

export class Player {
  constructor(playlist: Array<Playlist>) {
    console.log(playlist)
  }
}
