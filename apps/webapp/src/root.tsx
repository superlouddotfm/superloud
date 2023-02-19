// @refresh reload
import { QueryClientProvider } from '@tanstack/solid-query'
import { Suspense } from 'solid-js'
import { useLocation, A, Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start'
import { queryClient } from '~/config/query-client'
import { ProviderAuthentication } from './hooks/useAuthentication'
import { LayoutBase } from './layouts/LayoutBase'
import { Buffer } from 'buffer'
import './root.css'

window.Buffer = window.Buffer || Buffer

export default function Root() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname ? 'border-sky-600' : 'border-transparent hover:border-sky-600'

  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <ProviderAuthentication>
                <LayoutBase>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </LayoutBase>
              </ProviderAuthentication>
            </QueryClientProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
