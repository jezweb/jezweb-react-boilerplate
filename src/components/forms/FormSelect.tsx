import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

interface FormSelectProps {
  name: string;
  label: string;
  options: { label: string; value: any }[];
  placeholder?: string;
  disabled?: boolean;
  optionLabel?: string;
  optionValue?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  name, 
  label,
  options,
  placeholder = 'Select an option',
  disabled = false,
  optionLabel = 'label',
  optionValue = 'value',
}) => {
  const { control } = useFormContext();
  
  return (
    <div className="field">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Dropdown
              id={name}
              {...field}
              options={options}
              placeholder={placeholder}
              disabled={disabled}
              optionLabel={optionLabel}
              optionValue={optionValue}
              className={classNames(
                'w-full',
                { 'p-invalid': fieldState.invalid }
              )}
            />
            {fieldState.error && (
              <small className="p-error block mt-1">
                {fieldState.error.message}
              </small>
            )}
          </>
        )}
      />
    </div>
  );
};