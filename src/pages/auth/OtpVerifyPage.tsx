import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PinInput, Text } from '@mantine/core';
import { IconKey, IconRepeat } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { resendOTP, verifyOTP } from '../../store/action/user-action';
import { toast } from '../../../utils/APIClient';

const OtpVerifyPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(10);
    const [isResending, setIsResending] = useState(false);

    // Get user from localStorage
    useEffect(() => {
        const stored = sessionStorage.getItem('registration');
        console.log("stored",stored);
        
        try {
            const parsed = stored ? JSON.parse(stored) : null;
            if (!parsed?.email) throw new Error();
            setUserData(parsed);
        } catch {
            navigate('/register');
        }
    }, [navigate]);

    // OTP Countdown Timer
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('OTP must be exactly 6 digits');
            return;
        }

        console.log('Verifying OTP:', otp, 'for', userData?.email);
        // Verify OTP logic here
        dispatch(verifyOTP({
            email:userData?.email,
            otp:otp
        })).unwrap().then(()=>{
            navigate("/");
        }).catch(()=>{

        })
    };

    const handleResend = () => {
        setIsResending(true);
        dispatch(resendOTP({email:userData?.email}))?.unwrap()?.then((response)=>{
            toast.success(response?.message||"OTP sent on mail")
            console.log('Resent OTP to:', userData?.email);
            setIsResending(false);
            setTimer(10);
        }).catch((error)=>{
            toast.error(error?.message||"Failed to send OTP")
        })

    };

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center px-4">
            <div className="bg-mine-shaft-900 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-semibold mb-2 text-bright-sun-400 text-center">Verify OTP</h2>
                <p className="text-center text-sm text-mine-shaft-300 mb-4">
                    Enter the 6-digit OTP sent to <span className="text-bright-sun-400">{userData?.email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center">
                        <PinInput
                            type="number"
                            size="lg"
                            length={6}
                            oneTimeCode
                            placeholder="•"
                            value={otp}
                            onChange={(value) => {
                                setOtp(value);
                                if (error) setError('');
                            }}
                            styles={{
                                input: {
                                    backgroundColor: '#262626',
                                    border: '1px solid #444',
                                    color: 'white',
                                },
                            }}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Countdown or Resend */}
                    <div className="text-center mt-1 text-sm text-mine-shaft-300">
                        {timer > 0 ? (
                            <span>OTP will expire in <span className="text-bright-sun-400 font-medium">{timer}s</span></span>
                        ) : (
                            <Button
                                variant="subtle"
                                size="xs"
                                className="text-bright-sun-400 hover:underline mt-2"
                                onClick={handleResend}
                                disabled={isResending}
                                leftSection={<IconRepeat size={16} />}
                            >
                                {isResending ? 'Resending...' : 'Resend OTP'}
                            </Button>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        fullWidth
                        leftSection={<IconKey size={18} />}
                        disabled={otp.length !== 6}
                        className="bg-bright-sun-500 hover:bg-bright-sun-600 transition-colors"
                    >
                        Verify OTP
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerifyPage;
