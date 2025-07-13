import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconMail, IconArrowRight, IconLogin2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../../store";
import { forgotPassword } from "../../../store/action/user-action";
// import { forgotPassword } from "../../../store/action/user-action"; ✅ your real action

// ✅ Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ForgotPasswordFormData = {
  email: string;
};

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.user);

  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // ✅ Timer logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await dispatch(forgotPassword(data)).unwrap(); 
      console.log("Forgot password submitted:", data);
      setShowSuccess(true);
      setTimer(30);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center px-4">
      <div className="bg-mine-shaft-900 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-6 text-bright-sun-400 text-center">
          Forgot Password
        </h2>

        {showSuccess && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 text-sm rounded text-center">
            Email sent successfully! Please check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ✅ Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm text-mine-shaft-200"
            >
              Registered Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-mine-shaft-400">
                <IconMail size={18} />
              </span>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2 rounded bg-mine-shaft-800 text-white border ${
                      errors.email ? "border-red-500" : "border-mine-shaft-700"
                    } focus:outline-none focus:ring-2 focus:ring-bright-sun-500`}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s+/g, ""))
                    }
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={timer > 0 || isSubmitting || loading || !isValid}
            className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded transition-colors ${
              !isValid || loading || isSubmitting || timer > 0
                ? "bg-mine-shaft-700 cursor-not-allowed"
                : "bg-bright-sun-500 hover:bg-bright-sun-600"
            }`}
          >
            <IconArrowRight size={18} />
            {loading ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Send Reset Link"}
          </button>
        </form>

        {/* ✅ Navigation */}
        <div className="mt-6 text-sm text-center text-mine-shaft-300 space-y-2">
          <p className="flex justify-center items-center gap-1">
            <IconLogin2 size={16} className="text-bright-sun-400" />
            <Link to="/login" className="text-bright-sun-400 hover:underline">
              Back to Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
