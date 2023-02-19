import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import { IconExclamationCircle } from '~/components/system/Icons'
import { formFieldLabel } from '~/design-system/form-field'

interface DivProps extends JSX.HTMLAttributes<HTMLDivElement> {}
interface ParagraphProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}
interface FormFieldProps extends DivProps {
  disabled?: boolean
}

const FormField = (props: FormFieldProps) => {
  const [local] = splitProps(props, ['disabled', 'children', 'class'])

  return (
    <div class={`flex flex-col ${local?.disabled === true ? 'form-field--disabled' : ''} ${local?.class ?? ''}`}>
      {local.children}
    </div>
  )
}

const InputField = (props: DivProps) => {
  const [local] = splitProps(props, ['children', 'class'])

  return <div class={`flex flex-col ${local?.class ?? ''}`}>{local?.children}</div>
}

interface FormLabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  hasError: boolean
}
const Label = (props: FormLabelProps) => {
  const [local, labelProps] = splitProps(props, ['children', 'hasError', 'class'])

  return (
    <label class={formFieldLabel({ class: local?.class ?? '' })} {...labelProps}>
      {local?.hasError && <IconExclamationCircle class="w-6 self-center animate-appear text-negative-9 mie-1" />}
      {local?.children}
    </label>
  )
}

const Description = (props: ParagraphProps) => {
  const [local, descriptionProps] = splitProps(props, ['children'])

  return (
    <p class="text-[0.85em] text-start pb-1.5 text-neutral-12" {...descriptionProps}>
      {local.children}
    </p>
  )
}

interface HelpBlockProps extends ParagraphProps {
  hasError: boolean
}

const HelpBlock = (props: HelpBlockProps) => {
  const [local, blockProps] = splitProps(props, ['hasError', 'class', 'children'])

  return (
    <p
      class={`${local.hasError === true ? 'mt-1 text-xs text-negative-11' : 'sr-only'} ${local.class}`}
      {...blockProps}
    >
      {local?.children}
    </p>
  )
}

FormField.InputField = InputField
FormField.Label = Label
FormField.Description = Description
FormField.HelpBlock = HelpBlock

export default FormField
