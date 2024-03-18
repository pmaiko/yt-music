export const useMediaSession = ({ nextTrack, prevTrack, seekToTrack, toggleTrack }: { nextTrack: any, prevTrack: any, seekToTrack: any, toggleTrack: any }) => {
  navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
  navigator.mediaSession.setActionHandler('seekforward', nextTrack)
  navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
  navigator.mediaSession.setActionHandler('seekbackward', prevTrack)
  navigator.mediaSession.setActionHandler('seekto', seekToTrack)
  navigator.mediaSession.setActionHandler('play', toggleTrack)
  navigator.mediaSession.setActionHandler('pause', toggleTrack)

  const setMediaSessionMetaData = (title: string, artist: string | null, album: string | null, image: string | null) => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist || undefined,
      album: album || undefined,
      artwork: [
        {
          src: image || ''
        }
      ]
    })
  }

  return {
    setMediaSessionMetaData
  }
}
