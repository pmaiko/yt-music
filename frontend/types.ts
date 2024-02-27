export interface AudioData {
  id: string,
  audioApiURL: string,
  contentLength: number
}

export interface MusicItem {
  id: string,
  videoOwnerChannelTitle: string,
  videoId: string,
  title: string,
  description: string,
  audioData: AudioData
  search: {
    savefrom: string,
    sefon: [string]
    fm: [string]
  }
}
