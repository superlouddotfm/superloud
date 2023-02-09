export interface KaraokeScreenProps {
  vocalTrackUri: string
  instrumentalTrackUri: string
  lrcFileUri: string
  configKaraokeControls: {
    isPlaying: boolean
    time: {
      disableControls: boolean
      initialValue: number
    }
    vocals: {
      uriFile: string
      disableControls: boolean
      volume: {
        disableControls: boolean
        initialValue: number
      }
    }
    instrumental: {
      uriFile: string
      volume: {
        disableControls: boolean
        initialValue: number
      }
    }
    lyrics: {
      display: boolean
      uriFile: string
    }
  }
}

export * from './useKaraokeControls'
export * from './Lyrics'
export * from './Controls'
