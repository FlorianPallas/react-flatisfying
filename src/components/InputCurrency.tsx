import { forwardRef, useCallback } from 'react';
import { ChangeEventHandler } from 'react';

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'inputMode'
  > {
  defaultValue?: number;
  locales?: Intl.LocalesArgument;
}

const InputCurrency = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { locales, onChange } = props;

  const getLocalized = useCallback(
    (value: number) =>
      value.toLocaleString(locales, { minimumFractionDigits: 2 }),
    [locales]
  );

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const input = event.currentTarget.value;
      const isNegative = input.startsWith('-');
      const value = parseInt(input.replaceAll(/[^0-9]/g, '').padStart(3, '0'));
      event.currentTarget.value = getLocalized(
        (value / 100) * (isNegative ? -1 : 1)
      );
      if (onChange) onChange(event);
    },
    [getLocalized, onChange]
  );

  return (
    <input
      {...props}
      ref={ref}
      type="numeric"
      inputMode="decimal"
      onChange={onInputChange}
      defaultValue={getLocalized(props.defaultValue ?? 0)}
    />
  );
});
export default InputCurrency;
