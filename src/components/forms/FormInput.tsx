import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  name, 
  label, 
  type = 'text',
  placeholder,
  autoComplete,
  disabled = false,
}) => {
  const { control, formState: { errors } } = useFormContext();
  
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
            <InputText
              id={name}
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
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