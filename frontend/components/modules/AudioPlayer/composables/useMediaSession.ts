export const useMediaSession = ({ nextTrack, prevTrack, seekToTrack, toggleTrack }: { nextTrack: any, prevTrack: any, seekToTrack: any, toggleTrack: any }) => {
  navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
  navigator.mediaSession.setActionHandler('seekforward', nextTrack)
  navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
  navigator.mediaSession.setActionHandler('seekbackward', prevTrack)
  navigator.mediaSession.setActionHandler('seekto', seekToTrack)
  navigator.mediaSession.setActionHandler('play', toggleTrack)
  navigator.mediaSession.setActionHandler('pause', toggleTrack)

  const setMediaSessionMetaData = (title: string, artist: string, album: string | undefined, image: string) => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: album,
      artwork: [
        {
          src: image
        }
      ]
    })
  }

  return {
    setMediaSessionMetaData
  }
}
