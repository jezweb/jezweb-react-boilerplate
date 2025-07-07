import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';

interface FormPasswordProps {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  feedback?: boolean;
}

export const FormPassword: React.FC<FormPasswordProps> = ({ 
  name, 
  label,
  placeholder,
  autoComplete,
  disabled = false,
  feedback = true,
}) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  
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
            <Password
              id={name}
              {...field}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              toggleMask
              feedback={feedback}
              className={classNames(
                'w-full',
                { 'p-invalid': fieldState.invalid }
              )}
              inputClassName="w-full"
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