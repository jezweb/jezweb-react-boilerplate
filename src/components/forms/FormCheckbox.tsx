import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';

interface FormCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ 
  name, 
  label,
  disabled = false,
}) => {
  const { control } = useFormContext();
  
  return (
    <div className="field-checkbox">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex items-center">
            <Checkbox
              inputId={name}
              checked={field.value || false}
              onChange={(e) => field.onChange(e.checked)}
              disabled={disabled}
              className="mr-2"
            />
            <label htmlFor={name} className="text-sm text-gray-700">
              {label}
            </label>
            {fieldState.error && (
              <small className="p-error block ml-2">
                {fieldState.error.message}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
};