//@ts-ignore
import Liricle from 'liricle'
import { createEffect, createMemo, createSignal, createUniqueId, onMount } from 'solid-js'
import { createAudio, AudioState } from '@solid-primitives/audio'
import web3UriToUrl from '~/helpers/web3UriToUrl'
import { useMachine, normalizeProps } from '@zag-js/solid'
import * as slider from '@zag-js/slider'

const liricle = new Liricle()

export function useKaraokeControls(config: {
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
}) {
  // Text to display
  const [lyricsLoaded, setLyricsLoaded] = createSignal(false)
  const [lyrics, setLyrics] = createSignal<Array<any>>([])
  const [currentWord, setCurrentWord] = createSignal({
    index: undefined,
    text: undefined,
  })
  const [currentLine, setCurrentLine] = createSignal({
    index: undefined,
    text: undefined,
  })

  // Paths to files
  const [pathToLyricsFile] = createSignal(web3UriToUrl(config.lyrics.uriFile))
  const [pathToInstrumentalFile] = createSignal(web3UriToUrl(config.instrumental.uriFile))
  const [pathToVocalFile] = createSignal(web3UriToUrl(config.vocals.uriFile))

  // Player
  const [playing, setPlaying] = createSignal(config.isPlaying)
  const [volumeInstrumentalTrack] = createSignal(config.instrumental.volume.initialValue)
  const [volumeVocalTrack] = createSignal(config.vocals.volume.initialValue)
  const [instrumentalTrackAudio, actionsInstrumentalTrackAudio] = createAudio(
    pathToInstrumentalFile(),
    playing,
    volumeInstrumentalTrack,
  )
  const [vocalTrackAudio, actionsVocalTrackAudio] = createAudio(pathToVocalFile(), playing, volumeVocalTrack)
  // Vocal track volume slider
  const [stateVocalTrackVolumeSlider, sendStateVocalTrackVolumeSlider] = useMachine(
    slider.machine({
      id: createUniqueId(),
      value: volumeVocalTrack(),
      orientation: 'vertical',
      min: 0,
      max: 1,
      step: 0.01,
      onChange(details) {
        actionsVocalTrackAudio.setVolume(details.value)
      },
    }),
  )
  const apiVocalTrackVolumeSlider = createMemo(() =>
    slider.connect(stateVocalTrackVolumeSlider, sendStateVocalTrackVolumeSlider, normalizeProps),
  )

  // Instrumental track volume slider
  const [stateInstrumentalTrackVolumeSlider, sendStateInstrumentalTrackVolumeSlider] = useMachine(
    slider.machine({
      id: createUniqueId(),
      value: volumeInstrumentalTrack(),
      orientation: 'vertical',
      min: 0,
      max: 1,
      step: 0.01,
      onChange(details) {
        actionsInstrumentalTrackAudio.setVolume(details.value)
      },
    }),
  )
  const apiInstrumentalTrackVolumeSlider = createMemo(() =>
    slider.connect(stateInstrumentalTrackVolumeSlider, sendStateInstrumentalTrackVolumeSlider, normalizeProps),
  )

  // Vocal track volume slider
  const [stateSyncedTrackTimeSlider, sendStateSyncedTrackTimeSlider] = useMachine(
    slider.machine({
      id: createUniqueId(),
      value: volumeVocalTrack(),
      orientation: 'horizontal',
      onChange(details) {
        actionsInstrumentalTrackAudio.seek(details.value)
        actionsVocalTrackAudio.seek(details.value)
      },
    }),
  )
  const apiSliderTracksCurrentTimestamp = createMemo(() =>
    slider.connect(stateSyncedTrackTimeSlider, sendStateSyncedTrackTimeSlider, normalizeProps),
  )

  onMount(() => {
    liricle.on(
      'load',
      (data: {
        enhanced: boolean
        lines: Array<{
          time: number
          text: string
          word: null | string
        }>
        tags: {
          ar: string
          length: string
          ti: string
        }
      }) => {
        setLyricsLoaded(true)
        setLyrics(data.lines)
      },
    )

    // listen to on sync event
    liricle.on(
      'sync',
      (
        line: {
          text: string
          index: number
        },
        word?: {
          text: string
        },
      ) => {
        setCurrentLine({
          //@ts-ignore
          index: line.index,
          text: line.text,
        })
        //  check the word value before using it.
        //@ts-ignore
        if (word) setCurrentWord(word.text)
      },
    )

    // load lyric
    liricle.load({ url: pathToLyricsFile() })
  })

  createEffect(() => {
    liricle.sync(instrumentalTrackAudio.currentTime, true)
  })
  createEffect(() => {
    if (instrumentalTrackAudio.state === AudioState.COMPLETE && vocalTrackAudio.state === AudioState.COMPLETE) {
      setPlaying(false)
      actionsInstrumentalTrackAudio.seek(0)
      actionsVocalTrackAudio.seek(0)
    }
  })

  return {
    isPlaying: playing,
    time: {
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      api: apiSliderTracksCurrentTimestamp,
    },
    instrumental: {
      stateMachine: instrumentalTrackAudio,
      actions: actionsInstrumentalTrackAudio,
      api: apiInstrumentalTrackVolumeSlider,
    },
    vocals: {
      stateMachine: vocalTrackAudio,
      actions: actionsVocalTrackAudio,
      api: apiVocalTrackVolumeSlider,
    },
    lyrics: {
      loaded: lyricsLoaded,
      content: lyrics,
      currentLine: currentLine,
      currentWord: currentWord,
    },
  }
}
