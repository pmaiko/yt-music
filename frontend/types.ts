export interface MusicItem {
  id: string,
  videoOwnerChannelTitle: string,
  videoId: string,
  title: string,
  description: string,
  audioURL: string | null
  search: {
    savefrom: string,
    sefon: [string]
    fm: [string]
  }
}
