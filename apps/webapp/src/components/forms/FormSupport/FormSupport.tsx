import { createQuery } from '@tanstack/solid-query'
import { fetchBalance, fetchSigner, getProvider } from '@wagmi/core'
import { ethers } from 'ethers'
import { Match, Show, splitProps, Switch } from 'solid-js'
import Button from '~/components/system/Button'
import FormField from '~/components/system/FormField'
import FormInput from '~/components/system/FormInput'
import FormSelect from '~/components/system/FormSelect'
import { formFieldLabel } from '~/design-system/form-field'
import { useAuthentication } from '~/hooks/useAuthentication'
import { Framework } from '@superfluid-finance/sdk-core'
interface FormSupportProps {
  storeForm: any
  status: string
}
export const FormSupport = (props: FormSupportProps) => {
  const [local] = splitProps(props, ['storeForm'])
  const { currentUser } = useAuthentication()
  const { form } = local.storeForm
  const queryGetSuperTokenBalance = createQuery(
    () => ['balance-supertoken', currentUser()?.address, local?.storeForm?.data()?.super_token_symbol],
    async () => {
      try {
        const provider = await getProvider()
        const signer = await fetchSigner()
        const sf = await Framework.create({
          chainId: 80001,
          provider: provider,
        })
        const token = await sf.loadSuperToken(local?.storeForm?.data()?.super_token_symbol)
        const balance = await token.balanceOf({
          account: currentUser()?.address,
          providerOrSigner: signer,
        })
        return ethers.utils.formatEther(balance)
      } catch (e) {
        console.error(e)
      }
    },
    {
      get enabled() {
        return currentUser()?.address ? true : false
      },
    },
  )
  const queryGasTokenBalance = createQuery(
    () => ['user-balance', currentUser()?.address],
    async () => {
      try {
        const balance = await fetchBalance({
          address: currentUser()?.address,
        })

        return balance
      } catch (e) {
        console.error(e)
      }
    },
    {
      get enabled() {
        return currentUser()?.address ? true : false
      },
    },
  )

  return (
    <>
      <Show when={parseFloat(queryGasTokenBalance.data?.formatted) === 0}>
        <p class="text-start xs:text-center mt-6 mb-4 font-medium text-2xs bg-secondary-3 py-2 rounded-md mx-auto w-fit-content px-4 text-secondary-11">
          You need enough <span class="font-bold">MATIC (gas tokens)</span> to perform this action ! <br />
          To be able to support this artist directly, top-up your MATIC balance in your dashboard.
        </p>
      </Show>
      <div class="text-xs mb-6 max-w-prose mx-auto">
        <p class="">
          Superloud uses Superfluid and SuperTokens under the hood to transfer assets easily and in a secure manner.
        </p>
        <p>
          You can swap your token for the wrapped, streamable version, called Supertokens (for instance, the wrapped
          version of DAI is DAIx.). You can head to{' '}
          <a class="link" target="_blank" href="https://app.superfluid.finance/wrap">
            Superfluid's website
          </a>{' '}
          if needed.
        </p>
      </div>
      {/* @ts-ignore */}
      <form class="flex flex-col justify-center sm:items-center " use:form>
        <input hidden disabled name="recipient_wallet_address" />

        <div class="flex flex-col">
          <p class={formFieldLabel({ class: 'justify-start sm:justify-center pb-2' })}>Support monthly</p>
          <div class="relative flex flex-col sm:flex-row">
            <FormField.Label
              class="sr-only"
              hasError={local.storeForm.errors()?.super_token_amount_per_month?.length > 0 ? true : false}
              for="super_token_amount_per_month"
            >
              Amount of token to send (will be streamed every second)
            </FormField.Label>
            <FormField.Description class="sr-only" id="super_token_amount_per_month-description">
              The total amount of rewards that will be split between voters.
            </FormField.Description>
            <FormInput
              class="mb-2 sm:mb-0 sm:rounded-ie-none"
              type="number"
              min={0}
              step="any"
              name="super_token_amount_per_month"
              id="super_token_amount_per_month"
              hasError={false}
            />
            <FormField.Label
              class="sr-only"
              hasError={local.storeForm.errors()?.super_token_symbol?.length > 0 ? true : false}
              for="super_token_symbol"
            >
              Super token
            </FormField.Label>
            <FormField.Description class="sr-only" id="super_token_symbol-description">
              The Super token you want to send.
            </FormField.Description>
            <div>
              <FormSelect
                classInput="sm:rounded-is-none sm:border-is-0"
                name="super_token_symbol"
                id="super_token_symbol"
                hasError={local.storeForm.errors()?.super_token_symbol?.length > 0 ? true : false}
              >
                <option value="MATICx">MATICx (MATIC)</option>
                <option value="fDAIx">fDAIx (DAI)</option>
                <option value="fUSDCx">fUSDCx (USDC)</option>
              </FormSelect>
              <p class="w-full absolute top-full translate-y-2  inline-start-0 mb-6 font-medium text-[0.7rem]">
                <Show when={currentUser()?.address} fallback={'Connect to check your balance'}>
                  <span>Your balance:&nbsp;</span>

                  <Switch>
                    <Match when={queryGetSuperTokenBalance?.isSuccess}>
                      <span>
                        ~
                        {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 9 }).format(
                          parseFloat(queryGetSuperTokenBalance?.data),
                        )}
                        &nbsp;
                        {local.storeForm.data()?.super_token_symbol}
                      </span>
                    </Match>
                    <Match when={queryGetSuperTokenBalance?.isError}>Something went wrong.</Match>
                    <Match when={queryGetSuperTokenBalance?.isLoading}>
                      <span class="font-bold animate-pulse">fetching...</span>
                    </Match>
                  </Switch>
                </Show>
              </p>
            </div>
          </div>
        </div>

        <div class="w-full mt-12 mx-auto flex flex-col">
          <Button
            isLoading={['loading', 'success'].includes(props.status)}
            disabled={
              !currentUser()?.address ||
              queryGasTokenBalance.isLoading ||
              parseFloat(queryGasTokenBalance.data?.formatted) === 0 ||
              ['loading', 'success'].includes(props.status)
            }
            class="mx-auto"
            scale="sm"
            type="submit"
          >
            <span
              classList={{
                'pis-1ex': ['loading', 'success'].includes(props.status),
              }}
            >
              <Switch fallback="Send">
                <Match when={props.status === 'loading'}>Sending...</Match>
                <Match when={props.status === 'success'}>Syncing...</Match>
                <Match when={props.status === 'error'}>Try again </Match>
              </Switch>
            </span>
          </Button>
          <p class="italic text-neutral-5 text-center pt-6 text-2xs">
            The distribution is automatic and powered by{' '}
            <a class="link" href="https://superfluid.finance/" rel="nofollow noreferrer" target="_blank">
              Superfluid
            </a>
          </p>
        </div>
      </form>
    </>
  )
}

export default FormSupport
