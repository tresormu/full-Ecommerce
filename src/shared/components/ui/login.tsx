import React, { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", phone: "", password: "", UserType: "customer" as "admin" | "vendor" | "customer" });
  const [userIntent, setUserIntent] = useState<"customer" | "vendor">("customer");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLoginView) {
        const response = await userService.LoginUser(loginData);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onLoginSuccess?.();
        onClose();
        navigate("/");
      } else {
        const response = await userService.createUser({ ...registerData, UserType: userIntent });
        if (response.token) localStorage.setItem("token", response.token);
        if (response.user) localStorage.setItem("user", JSON.stringify(response.user));
        onLoginSuccess?.();
        onClose();
        navigate("/");
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 404) setError("Invalid email or password.");
      else if (err.response?.status === 500) setError("Server error. Try again later.");
      else if (err.message === "Network Error") setError("Network error. Check your connection.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchView = () => {
    setIsLoginView(!isLoginView);
    setShowPassword(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[95vh] overflow-y-auto">

        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 transition-colors shadow-sm">
          <X size={18} />
        </button>

        {/* Left panel */}
        <div className="bg-blue-600 text-white p-8 sm:p-10 sm:w-[42%] flex flex-col justify-between shrink-0">
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {isLoginView ? "Welcome back" : "Join us today"}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              {isLoginView
                ? "Sign in to access your orders, wishlist and personalized recommendations."
                : "Create your account and start shopping or selling in minutes."}
            </p>
          </div>

          <div className="mt-8 hidden sm:block">
            <p className="text-blue-200 text-xs mb-3">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={switchView}
              className="w-full border border-white/40 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              {isLoginView ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 sm:p-10 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {isLoginView ? "Sign in" : "Create account"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {isLoginView ? "Enter your credentials to continue" : "Fill in your details to get started"}
          </p>

          {error && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${error.includes("created") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Register-only fields */}
            {!isLoginView && (
              <>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="text"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="tel"
                    placeholder="Phone number"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="email"
                placeholder="Email address"
                value={isLoginView ? loginData.email : registerData.email}
                onChange={(e) => isLoginView
                  ? setLoginData({ ...loginData, email: e.target.value })
                  : setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={isLoginView ? loginData.password : registerData.password}
                onChange={(e) => isLoginView
                  ? setLoginData({ ...loginData, password: e.target.value })
                  : setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Account type — register only */}
            {!isLoginView && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">I want to</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["customer", "vendor"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserIntent(type)}
                      className={`flex items-center gap-2 p-3 border-2 rounded-xl text-sm font-medium transition-all ${
                        userIntent === type
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {type === "customer" ? <ShoppingBag size={15} /> : <Store size={15} />}
                      {type === "customer" ? "Buy products" : "Sell products"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Forgot password */}
            {isLoginView && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Please wait..." : isLoginView ? "Sign in" : "Create account"}
            </button>

            {/* Mobile switch */}
            <p className="text-center text-sm text-gray-500 sm:hidden pt-1">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={switchView} className="text-blue-600 font-semibold hover:underline">
                {isLoginView ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
