import { forwardRef, useCallback } from 'react';
import { ChangeEventHandler } from 'react';
import { parseCurrencyString, toCurrencyString } from '../lib/localization';

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'inputMode'
  > {
  defaultValue?: number;
}

const InputCurrency = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { onChange } = props;

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const value = parseCurrencyString(event.currentTarget.value);
      event.currentTarget.value = toCurrencyString(value, true);
      if (onChange) onChange(event);
    },
    [onChange]
  );

  return (
    <input
      {...props}
      ref={ref}
      type="numeric"
      inputMode="decimal"
      onChange={onInputChange}
      defaultValue={toCurrencyString(props.defaultValue ?? 0, true)}
    />
  );
});
export default InputCurrency;
