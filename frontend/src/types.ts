export interface MusicItem {
  id: string,
  author: string | null,
  title: string | null,
  description: string | null,
  image: string | null,
  audio: {
    src: string | null,
  },
  youtube: {
    videoId: string | null,
  }
  links: [],
  active: boolean
}

export interface PageInfo {
  total: number | null,
  perPage: number,
  nextPageToken: | null
}

export interface Links {
  id: string,
  label: string,
  link: string
}
