import { OnRampStripe } from '~/components/_pages/Account/OnRampStripe'
import { Identity } from '~/components/_pages/Account//Identity'
import { OngoingStreams } from '~/components/_pages/OngoingStreams'

export const Dashboard = () => {
  return (
    <main class="flex flex-col flex-grow pt-12">
      <div class="max-w-prose w-full mx-auto xs:px-4">
        <h1 class="text-start xs:text-center text-2xl text-neutral-9 font-bold">Dashboard</h1>
      </div>
      <div class="w-full mx-auto xs:px-4 2xs:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl">
        <div class="px-6 py-8 bg-accent-1 rounded-lg border border-accent-5 mt-10">
          <h2 class="font-bold text-md">Your profile</h2>
          <div class="pt-4">
            <Identity />
          </div>

          <div class="pt-8">
            <h2 class="font-bold text-md">Your account balance</h2>
            <div class="pt-4">
              <OnRampStripe />
            </div>
          </div>

          <div class="pt-8">
            <h2 class="font-bold text-md">Your support</h2>
            <p>You can find below the list of artists you're currently actively supporting, as well as the list of people that are currently supporting you.</p>
            <p>You can find your complete list of ongoing Superfluid streams on the <a class="link" href="https://app.superfluid.finance/" target="_blank">Superfluid dashboard</a></p>
            <div class="pt-4">
              <OngoingStreams />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
