import { A } from '@solidjs/router'
import { For, Match, Switch } from 'solid-js'
import {
  ROUTE_CATALOG,
  ROUTE_CATALOG_SONG_NEW,
  ROUTE_HOME,
  ROUTE_KARAOKE_ALL_CHALLENGES,
  ROUTE_SIGN_IN,
} from '~/config/routes'
import callToAction from '~/design-system/call-to-action'
import { useAuthentication } from '~/hooks/useAuthentication'
import { useLocation } from 'solid-start'
import { IconCatalog, IconPlaylistAdd, IconSingingMic } from '~/components/system/Icons'
import { MenuCurrentUser } from './MenuCurrentUser'
import { ToastProvider } from '~/hooks/useToast'

const routes = [
  {
    label: 'Catalog',
    href: ROUTE_CATALOG,
    icon: <IconCatalog class="w-7 h-7" />,
  },
  {
    label: 'Challenges',
    href: ROUTE_KARAOKE_ALL_CHALLENGES,
    icon: <IconSingingMic class="w-7 h-7" />,
  },
  {
    label: 'List song',
    href: ROUTE_CATALOG_SONG_NEW,
    icon: <IconPlaylistAdd class="w-7 h-7" />,
  },
]
export const LayoutBase = (props: any) => {
  const { isAuthenticated } = useAuthentication()
  const location = useLocation()
  return (
    <ToastProvider>
      <div class="flex flex-col relative grow md:flex-row">
        <nav class="fixed bottom-0 left-0 w-full border border-t-accent-4 md:border-t-transparent md:py-12 bg-accent-1 border-accent-6 md:bg-accent-4 md:h-screen md:w-16 md:border-ie md:border-accent-6 z-30">
          <A class="text-2xl fixed top-4 z-30 md:top-4 inline-start-4" href={ROUTE_HOME}>
            🎤
          </A>
          <div class="grid grid-cols-3 md:flex md:px-1.5 md:gap-6 md:h-full md:flex-col md:justify-center items-center">
            <For each={routes}>
              {(route) => {
                return (
                  <A
                    classList={{
                      'border-transparent': location.pathname !== route.href,
                      'border-primary-8': location.pathname === route.href,
                    }}
                    class="border-b-4 md:border-0 transition-all flex items-center justify-center md:aspect-square p-2 md:hover:bg-neutral-1 md:focus:bg-neutral-1 focus:border-0 focus:text-primary-8 text-neutral-6 md:rounded-lg"
                    title={route.label}
                    href={route.href}
                  >
                    <span class="sr-only">{route.label}</span>
                    {route.icon}
                  </A>
                )
              }}
            </For>
          </div>
          <div class="pointer-events-none bg-accent-2 md:bg-transparent py-4 md:pt-12 animate-appear fixed top-0  inline-start-0 w-full">
            <div class="container mx-auto flex justify-end">
              <Switch>
                <Match when={!isAuthenticated() && location.pathname !== ROUTE_SIGN_IN}>
                  <A
                    class={callToAction({ intent: 'primary-outline', scale: 'xs', class: 'pointer-events-auto' })}
                    href={ROUTE_SIGN_IN}
                  >
                    Sign-in
                  </A>
                </Match>
                <Match when={isAuthenticated()}>
                  <MenuCurrentUser />
                </Match>
              </Switch>
            </div>
          </div>
        </nav>
        <main class="flex-grow flex flex-col px-4 pt-20 pb-40">{props.children}</main>
      </div>
    </ToastProvider>
  )
}
