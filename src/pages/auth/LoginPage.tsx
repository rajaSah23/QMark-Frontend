import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import {
    IconEye,
    IconEyeOff,
    IconLogin2,
    IconMail,
    IconLock,
    IconKey,
    IconUserPlus,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginUser } from '../../store/action/user-action';

// ✅ Validation Schema
const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { loading } = useSelector((store: any) => store.user)
    const togglePassword = () => setShowPassword((prev) => !prev);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange', // ✅ Enables validation while typing for button state
    });

    const onSubmit = (data: any) => {
        console.log('Form Submitted:', data);
        // Handle login logic here
        dispatch(loginUser({ email: data?.email, password: data?.password })).unwrap().then((response) => {
            console.log("response", response);
            navigate("/");
        }).catch((err) => {
            console.log("err", err);
            if (err.statusCode == 405) {
                sessionStorage.setItem("registration", JSON.stringify({ email: data?.email}));
                navigate("/verify-otp");
            }

        })
    };

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center px-4">
            <div className="bg-mine-shaft-900 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-semibold mb-6 text-bright-sun-400 text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
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
                                className={`w-full pl-10 pr-4 py-2 rounded bg-mine-shaft-800 text-white border ${errors.email ? 'border-red-500' : 'border-mine-shaft-700'
                                    } focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
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
                                className={`w-full pl-10 pr-10 py-2 rounded bg-mine-shaft-800 text-white border ${errors.password ? 'border-red-500' : 'border-mine-shaft-700'
                                    } focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute inset-y-0 right-3 flex items-center text-mine-shaft-300 hover:text-white"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting || loading}
                        className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded transition-colors ${!isValid || isSubmitting || loading
                            ? 'bg-mine-shaft-700 cursor-not-allowed'
                            : 'bg-bright-sun-500 hover:bg-bright-sun-600'
                            }`}
                    >
                        <IconLogin2 size={18} />
                        {loading ? "please wait..." : "Login"}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-sm text-center text-mine-shaft-300 space-y-2">
                    <p className="flex justify-center items-center gap-1">
                        <IconKey size={16} className="text-bright-sun-400" />
                        <Link to="/forgot-password" className="text-bright-sun-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </p>
                    <p className="flex justify-center items-center gap-1">
                        <IconUserPlus size={16} className="text-bright-sun-400" />
                        <span>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-bright-sun-400 hover:underline">Register</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
