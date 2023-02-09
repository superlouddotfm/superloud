import { createEffect, For, splitProps } from 'solid-js'
import type { JSX, Accessor } from 'solid-js'

interface LyricsProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  isKaraokePlaying: boolean
  lyrics: {
    loaded: Accessor<boolean>
    content: Accessor<
      Array<{
        index: number
        text: string
      }>
    >
    currentLine: Accessor<{
      index: number
      text: string
    }>
    currentWord: Accessor<{
      index: number
    }>
  }
}

export const Lyrics = (props: LyricsProps) => {
  const [local, wrapperProps] = splitProps(props, ['isKaraokePlaying', 'lyrics', 'children'])

  return (
    <section {...wrapperProps}>
      <For each={local.lyrics.content()}>
        {(
          line: {
            index: number
            text: string
          },
          i,
        ) => {
          return (
            <p
              id={`line-${i()}`}
              classList={{
                'text-neutral-4': local.isKaraokePlaying === false || i() < local.lyrics.currentLine()?.index,
                'text-interactive-6 font-bold': local.lyrics.currentLine()?.index === i(),
                'font-semibold': local.lyrics.currentLine()?.index !== i(),
              }}
              class="text-lg leading-loose transition-colors"
            >
              {line?.text}
            </p>
          )
        }}
      </For>
    </section>
  )
}
