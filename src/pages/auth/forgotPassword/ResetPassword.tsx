import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconEye, IconEyeOff, IconLock, IconShieldLock } from "@tabler/icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch } from "../../../store";
import { resetPassword } from "../../../store/action/user-action";
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
    <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center px-4">
      <div className="bg-mine-shaft-900 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-6 text-bright-sun-400 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ✅ Password Field */}
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
                className={`w-full pl-10 pr-10 py-2 rounded bg-mine-shaft-800 text-white border ${
                  errors.password ? "border-red-500" : "border-mine-shaft-700"
                } focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
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

          {/* ✅ Confirm Password Field */}
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
                className={`w-full pl-10 pr-10 py-2 rounded bg-mine-shaft-800 text-white border ${
                  errors.confirmPassword ? "border-red-500" : "border-mine-shaft-700"
                } focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
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

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting || loading}
            className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded transition-colors ${
              !isValid || isSubmitting || loading
                ? "bg-mine-shaft-700 cursor-not-allowed"
                : "bg-bright-sun-500 hover:bg-bright-sun-600"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
