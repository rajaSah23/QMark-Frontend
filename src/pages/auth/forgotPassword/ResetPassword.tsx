import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconEye, IconEyeOff, IconLock, IconShieldLock } from "@tabler/icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch } from "../../../store";
import { resetPassword } from "../../../store/action/user-action";
import AuthShell from "../../../components/auth/AuthShell";
// import { resetPassword } from "../../../store/action/user-action"; ✅ use your real action
// import toaster from "@/utils/toast"; ✅ your own toast handler

const schema = yup.object().shape({
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const inputClassName = 'w-full rounded-xl border bg-mine-shaft-800/90 py-3 pl-11 pr-4 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bright-sun-500';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: any) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      // toaster.error("Invalid reset token");
      alert("Invalid token");
      return;
    }

    try {
      await dispatch(resetPassword({ token, password: data.password })).unwrap();
      console.log("Resetting password:", data.password);
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Choose a new password to secure your account and return to your workspace."
      asideTitle="Keep your account protected"
      asideDescription="Use a strong password so your questions, bookmarks, and quiz history remain secure."
      asidePoints={[
        'Use a password you do not reuse elsewhere',
        'Keep it memorable but hard to guess',
        'You will be redirected back to login after reset',
      ]}
    >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-mine-shaft-200">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                <IconLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={loading}
                className={`${inputClassName} ${
                  errors.password ? "border-red-500" : "border-mine-shaft-700"
                } pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-mine-shaft-300 hover:text-white"
              >
                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm text-mine-shaft-200">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                <IconShieldLock size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={loading}
                className={`${inputClassName} ${
                  errors.confirmPassword ? "border-red-500" : "border-mine-shaft-700"
                } pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-mine-shaft-300 hover:text-white"
              >
                {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting || loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white transition-colors ${
              !isValid || isSubmitting || loading
                ? "bg-mine-shaft-700 cursor-not-allowed"
                : "bg-bright-sun-500 hover:bg-bright-sun-600"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
    </AuthShell>
  );
};

export default ResetPassword;
