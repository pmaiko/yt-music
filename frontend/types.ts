export interface MusicItem {
  id: string,
  videoOwnerChannelTitle: string,
  videoId: string,
  title: string,
  description: string,
  src: string | null
  image: string,
  links: {
    saveFrom: string,
    seFon: [string]
    fm: [string]
  }
}

export interface PageInfo {
  total: number | null,
  perPage: number,
  pageToken: | null
}
