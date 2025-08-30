export interface MusicItem {
  id: string
  videoOwnerChannelTitle: string | null
  videoId: string
  title: string
  description: string
  src: string | null
  image: string | null
  links: Links[]
  active: boolean
}

export interface PageInfo {
  total: number | null,
  perPage: number,
  pageToken: | null
}

export interface Links {
  id: string,
  label: string,
  link: string
}
