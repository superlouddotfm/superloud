//@ts-ignore
import Liricle from 'liricle'
import { createEffect, createMemo, createSignal, createUniqueId, onMount } from 'solid-js'
import { createAudio, AudioState } from '@solid-primitives/audio'
import web3UriToUrl from '~/helpers/web3UriToUrl'
import { useMachine, normalizeProps } from '@zag-js/solid'
import * as slider from '@zag-js/slider'
import * as popover from '@zag-js/popover'
import * as dialog from '@zag-js/dialog'
import { createAmplitudeStream } from '@solid-primitives/stream'
import { createPermission } from '@solid-primitives/permission'
import { createMutation } from '@tanstack/solid-query'
import formatMediaDuration from '~/helpers/formatMediaDuration'
import Crunker from 'crunker'
import { ipfsClient } from '~/config/ipfs'
import { useSearchParams } from 'solid-start'

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
  recording: {
    shouldRecord: boolean
    disableControls: boolean
    startRecordingAfterBufferTime?: number
  }
}) {
  const [searchParams, setSearchParams] = useSearchParams()
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
  const [currentTime, setCurrentTime] = createSignal(formatMediaDuration(0))
  const [duration, setDuration] = createSignal('--:--')
  const [vocalTrackAudio, actionsVocalTrackAudio] = createAudio(pathToVocalFile(), playing, volumeVocalTrack)

  // Vocal track volume slider
  const [stateVocalTrackVolumeSlider, sendStateVocalTrackVolumeSlider] = useMachine(
    slider.machine({
      id: createUniqueId(),
      value: volumeVocalTrack(),
      orientation: 'vertical',
      origin: 'start',
      min: 0,
      max: 100,
      step: 1,
      onChange(details) {
        actionsVocalTrackAudio.setVolume(details.value * 0.01)
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
      origin: 'start',
      min: 0,
      max: 100,
      step: 1,
      onChange(details) {
        actionsInstrumentalTrackAudio.setVolume(details.value * 0.01)
      },
    }),
  )
  const apiInstrumentalTrackVolumeSlider = createMemo(() =>
    slider.connect(stateInstrumentalTrackVolumeSlider, sendStateInstrumentalTrackVolumeSlider, normalizeProps),
  )

  // Time slider
  const [stateSyncedTrackTimeSlider, sendStateSyncedTrackTimeSlider] = useMachine(
    slider.machine({
      id: createUniqueId(),
      value: 0,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      origin: 'start',
      onChange(details) {
        const percentage = details.value * 0.01
        const updatedTime = instrumentalTrackAudio.duration * percentage
        actionsInstrumentalTrackAudio.seek(updatedTime)
        actionsVocalTrackAudio.seek(updatedTime)
        setCurrentTime(formatMediaDuration(updatedTime))
      },
    }),
  )
  const apiSliderTracksCurrentTimestamp = createMemo(() =>
    slider.connect(stateSyncedTrackTimeSlider, sendStateSyncedTrackTimeSlider, normalizeProps),
  )

  // Recorder popover
  const [statePopoverRecorder, sendPopoverRecorder] = useMachine(
    popover.machine({
      positioning: {
        placement: 'top-end',
      },

      portalled: true,
      id: createUniqueId(),
      closeOnEsc: false,
      closeOnInteractOutside: false,
    }),
  )

  const apiPopoverRecorder = createMemo(() =>
    popover.connect(statePopoverRecorder, sendPopoverRecorder, normalizeProps),
  )

  // Session dialog
  const [stateDialogSession, sendDialogSession] = useMachine(
    dialog.machine({
      id: createUniqueId(),
    }),
  )

  const apiDialogSession = createMemo(() => dialog.connect(stateDialogSession, sendDialogSession, normalizeProps))

  const [audioConstraints, setAudioConstraints] = createSignal<MediaStreamConstraints>()
  const [level] = createAmplitudeStream(audioConstraints)
  const [isRecording, setIsRecording] = createSignal(false)
  const [recorder, setRecorder] = createSignal(null)
  const [recordedAudio, setRecordedAudio] = createSignal(null)
  const permissionAudio = createPermission('microphone')
  const mutationPermissions = createMutation(
    async (constraints: MediaStreamConstraints) => {
      try {
        const response = await navigator.mediaDevices.getUserMedia(constraints)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    {
      onSuccess(data) {
        if (data) {
          initializeRecorder(data)
        }
      },
    },
  )

  const mutationCreateSessionAudioReplay = createMutation(async () => {
    try {
      const crunker = new Crunker()
      const buffers = await crunker.fetchAudio(recordedAudio(), pathToInstrumentalFile())

      const merged = await crunker.mergeAudio(buffers)
      const output = await crunker.export(merged, 'audio/mp3')

      return output
    } catch (e) {
      console.error(e)
    }
  })
  const mutationRecordLivepeerStream = createMutation(async (name: string) => {
    try {
      const response = await fetch('https://livepeer.studio/api/stream', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_LIVEPEER_API_KEY}`,
        },
        body: JSON.stringify({
          record: true,
        }),
      })
      const result = await response.json()
      return result
    } catch (e) {
      console.error(e)
    }
  })
  const mutationCreateLivepeerStream = createMutation(async (name: string) => {
    try {
      const response = await fetch('https://livepeer.studio/api/stream', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_LIVEPEER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          profiles: [
            {
              name: '720p',
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720,
            },
            {
              name: '480p',
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480,
            },
            {
              name: '360p',
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360,
            },
          ],
        }),
      })
      const result = await response.json()
      setSearchParams({
        streamId: result?.streamKey,
        playbackId: result?.playbackId,
      })
      return result
    } catch (e) {
      console.error(e)
    }
  })
  /**
   * Initialize our recorder
   * @param stream
   */
  function initializeRecorder(stream) {
    const mimeType = 'video/webm'
    let chunks = []
    const recorder = new MediaRecorder(stream, { type: mimeType })
    recorder.addEventListener('dataavailable', (event) => {
      if (typeof event.data === 'undefined') return
      if (event.data.size === 0) return
      chunks.push(event.data)
    })
    recorder.addEventListener('stop', () => {
      const recording = new Blob(chunks, {
        type: mimeType,
      })
      renderRecording(recording)
      chunks = []
    })

    setRecorder(recorder)
  }

  function renderRecording(blob) {
    const blobUrl = URL.createObjectURL(blob)
    setRecordedAudio(blobUrl)
  }

  function startRecording() {
    setRecordedAudio(null)
    setIsRecording(true)
    recorder()?.start()
  }

  async function stopRecording() {
    setIsRecording(false)
    recorder()?.stop()
    setSearchParams({
      playbackId: searchParams?.playbackId,
    })
    await fetch(`https://livepeer.studio/api/stream/${searchParams?.streamId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LIVEPEER_API_KEY}`,
      },
    })
  }

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
    if (instrumentalTrackAudio.state === AudioState.PLAYING || instrumentalTrackAudio.state === AudioState.COMPLETE) {
      setCurrentTime(formatMediaDuration(instrumentalTrackAudio.currentTime))
    }
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

  createEffect(() => {
    if ([AudioState.STOPPED, AudioState.PAUSED, AudioState.COMPLETE].includes(instrumentalTrackAudio.state)) {
      stopRecording()
      apiPopoverRecorder().close()
      apiDialogSession().open()
    }
  })
  createEffect(() => {
    if (currentLine()?.index) {
      // Automatically scroll to the line when it changes
      const yOffset = -120
      const element = document.getElementById(`line-${currentLine()?.index}`)
      const y = element?.getBoundingClientRect()?.top + window?.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  })

  createEffect(() => {
    if (instrumentalTrackAudio.duration) {
      setDuration(formatMediaDuration(instrumentalTrackAudio?.duration))
    }
  })

  createEffect(async () => {
    if (isRecording() === true) {
      apiPopoverRecorder().open()
      apiDialogSession().close()
      setPlaying(true)
    }
  })

  return {
    mutationCreateSessionAudioReplay,
    isPlaying: playing,
    livestream: {
      mutationCreateLivepeerStream,
    },
    time: {
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      api: apiSliderTracksCurrentTimestamp,
      currentTime,
      duration,
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

    recorder: {
      apiPopoverRecorder,
      apiDialogSession,
      mutationPermissions,
      isRecording,
      start: startRecording,
      stop: stopRecording,
      permissions: {
        mic: permissionAudio,
      },
      audio: {
        permission: permissionAudio,
        recorded: recordedAudio,
        constraints: audioConstraints,
        setConstraints: setAudioConstraints,
        level,
      },
    },
  }
}
