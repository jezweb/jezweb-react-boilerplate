import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../../../services/auth.service';
import { LoginFormData } from '../../../models/user.model';
import { FormInput } from '../../../components/forms/FormInput';
import { FormPassword } from '../../../components/forms/FormPassword';
import { FormCheckbox } from '../../../components/forms/FormCheckbox';
import { Button } from 'primereact/button';
import { useApiEventStore, ApiEventStatus } from '../../../stores/api-event.store';

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: yup.boolean(),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const currentEvent = useApiEventStore((state) => state.currentEvent);
  
  const methods = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const isLoading = currentEvent?.status === ApiEventStatus.IN_PROGRESS;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <FormCheckbox name="rememberMe" label="Remember me" />
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              label="Sign in"
              className="w-full"
              disabled={!methods.formState.isValid || isLoading}
              loading={isLoading}
            />
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginPage;