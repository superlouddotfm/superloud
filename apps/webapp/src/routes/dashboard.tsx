import { createEffect } from 'solid-js'
import { useAuthentication } from '~/hooks/useAuthentication'
import { useNavigate } from 'solid-start'
import Dashboard from '~/components/_pages/Dashboard'
import { ROUTE_SIGN_IN } from '~/config/routes'

export default function Page() {
  const navigate = useNavigate()
  const { currentUser } = useAuthentication()

  createEffect(() => {
    if (!currentUser()?.address) {
      navigate(ROUTE_SIGN_IN)
    }
  })

  return <Dashboard />
}
