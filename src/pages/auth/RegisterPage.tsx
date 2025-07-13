import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import {
    IconUser,
    IconMail,
    IconLock,
    IconEye,
    IconEyeOff,
    IconUserPlus,
    IconLogin2,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/action/user-action';
import { AppDispatch } from '../../store';
import { toast } from '../../../utils/APIClient';

// Strong password schema
const schema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Minimum 8 characters')
        .matches(/[A-Z]/, 'At least one uppercase letter')
        .matches(/[a-z]/, 'At least one lowercase letter')
        .matches(/[0-9]/, 'At least one number')
        .matches(/[^A-Za-z0-9]/, 'At least one special character'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

const RegisterPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const passwordValue = watch('password') || '';

    // Compute password strength
    const calculateStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // toast.success( "User registered")


    const onSubmit = (data: any) => {
        console.log('Form Submitted:', data);
        dispatch(registerUser(data)).unwrap().then((response) => {
            console.log("response", response);
            toast.success(response?.message || "User registered")
            navigate("/verify-otp");
        }).catch((error) => {
            console.log("error", error);
        })
    };

    // Update password strength on every change
    React.useEffect(() => {
        setPasswordStrength(calculateStrength(passwordValue));
    }, [passwordValue]);

    // Strength meter styling
    const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
    const strengthLabel = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center px-4 py-6">
          <div className="bg-mine-shaft-900 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row text-white overflow-hidden">
            {/* ✅ Image Section */}
            <div className="flex justify-center items-center p-6 bg-mine-shaft-800">
              <img
                src="/signin-banner.png"
                alt="Banner"
                className="w-72 sm:w-80 md:w-96 lg:w-[420px]"
              />
            </div>
      
            {/* ✅ Register Form Section */}
            <div className="flex-1 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-bright-sun-400 text-center">Register</h2>
      
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm text-mine-shaft-200">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                      <IconUser size={18} />
                    </span>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      {...register('name')}
                      className={`w-full pl-10 pr-4 py-2 rounded bg-mine-shaft-800 text-white border ${errors.name ? 'border-red-500' : 'border-mine-shaft-700'} focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
      
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm text-mine-shaft-200">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                      <IconMail size={18} />
                    </span>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      className={`w-full pl-10 pr-4 py-2 rounded bg-mine-shaft-800 text-white border ${errors.email ? 'border-red-500' : 'border-mine-shaft-700'} focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
      
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-1 text-sm text-mine-shaft-200">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                      <IconLock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      {...register('password')}
                      className={`w-full pl-10 pr-10 py-2 rounded bg-mine-shaft-800 text-white border ${errors.password ? 'border-red-500' : 'border-mine-shaft-700'} focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-mine-shaft-300 hover:text-white"
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
      
                  {/* Password Strength Meter */}
                  {passwordValue && (
                    <div className="mt-1">
                      <div className="w-full h-2 rounded bg-mine-shaft-800 overflow-hidden">
                        <div
                          className={`h-2 transition-all duration-300 ${strengthColors[passwordStrength - 1]}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-mine-shaft-300">{strengthLabel[passwordStrength - 1]}</p>
                    </div>
                  )}
      
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
      
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block mb-1 text-sm text-mine-shaft-200">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                      <IconLock size={18} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className={`w-full pl-10 pr-10 py-2 rounded bg-mine-shaft-800 text-white border ${errors.confirmPassword ? 'border-red-500' : 'border-mine-shaft-700'} focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-mine-shaft-300 hover:text-white"
                    >
                      {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
      
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded transition-colors ${!isValid || isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-bright-sun-500 hover:bg-bright-sun-600'
                    }`}
                >
                  <IconUserPlus size={18} />
                  Register
                </button>
              </form>
      
              {/* Login Redirect */}
              <div className="mt-4 text-sm text-center text-mine-shaft-300">
                <p className="flex justify-center items-center gap-1">
                  <IconLogin2 size={16} className="text-bright-sun-400" />
                  <span>
                    Already have an account?{' '}
                    <Link to="/login" className="text-bright-sun-400 hover:underline">Login</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default RegisterPage;
