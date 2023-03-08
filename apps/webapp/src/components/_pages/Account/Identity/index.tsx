import { useAuthentication } from '~/hooks/useAuthentication'

export const Identity = () => {
  const { currentUser } = useAuthentication()

  return (
    <section class="text-primary-11 text-xs">
      <h3 class="text-primary-12 font-semibold">Logged in as: </h3>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.name}</p>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.email}</p>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.address}</p>
    </section>
  )
}

export default Identity
