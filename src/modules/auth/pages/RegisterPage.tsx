import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../../../services/auth.service';
import { RegisterFormData } from '../../../models/user.model';
import { FormInput } from '../../../components/forms/FormInput';
import { FormPassword } from '../../../components/forms/FormPassword';
import { FormCheckbox } from '../../../components/forms/FormCheckbox';
import { Button } from 'primereact/button';
import { useApiEventStore, ApiEventStatus } from '../../../stores/api-event.store';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const currentEvent = useApiEventStore((state) => state.currentEvent);
  
  const methods = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const isLoading = currentEvent?.status === ApiEventStatus.IN_PROGRESS;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="firstName"
              label="First name"
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
            
            <FormInput
              name="lastName"
              label="Last name"
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
          </div>

          <FormInput
            name="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
          />

          <FormPassword
            name="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
          />

          <FormPassword
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          <FormCheckbox
            name="acceptTerms"
            label="I accept the terms and conditions"
          />

          <div>
            <Button
              type="submit"
              label="Create account"
              className="w-full"
              disabled={!methods.formState.isValid || isLoading}
              loading={isLoading}
            />
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterPage;