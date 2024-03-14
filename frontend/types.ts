export interface MusicItem {
  id: string
  videoOwnerChannelTitle: string
  videoId: string
  title: string
  description: string
  src: string | null
  image: string
  links: Links
}

export interface PageInfo {
  total: number | null,
  perPage: number,
  pageToken: | null
}

export interface Links {
  saveFrom: string
  seFon: [string]
  fm: [string]
}
