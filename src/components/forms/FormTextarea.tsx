import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  autoResize?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  name, 
  label,
  placeholder,
  rows = 3,
  disabled = false,
  autoResize = true,
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
            <InputTextarea
              id={name}
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              autoResize={autoResize}
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