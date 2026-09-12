import React, { useState } from 'react';
import { UserRole } from '../../../types';
import { AlertCircle, Lock, Mail, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';
import { signIn } from '../../../services/supabase/auth';

/**
 * TEMPORARY AUTHENTICATION
 *
 * Current implementation is for prototype/testing purposes only:
 * role is guessed client-side from the email's local part (a
 * student-ID-shaped prefix like "U22107821" → student, anything else
 * → admin) and the password is never actually checked against
 * anything real. There is no session, no token, and no persistence —
 * a page refresh always returns to the login screen (see RequireRole
 * in src/app/router.tsx).
 *
 * TODO: Replace with the final authentication solution before
 * production deployment. Do not add Supabase Auth or any other real
 * auth mechanism until that is explicitly planned.
 */
interface LoginPageProps {
  onLogin?: (role: UserRole, email?: string) => void;
  onLoginSuccess?: (role: UserRole, email?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('U22107821@sharjah.ac.ae');
  const [password, setPassword] = useState<string>('••••••••');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSent, setForgotSent] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setErrorMessage('Please enter your password to continue.');
      return;
    }

    if (!trimmedEmail.toLowerCase().endsWith('@sharjah.ac.ae')) {
      setErrorMessage('Please enter a valid @sharjah.ac.ae email address');
      return;
    }

    const localPart = trimmedEmail.split('@')[0];
    const studentRegex = /^U\d+$/i;

    try {
      await signIn(trimmedEmail, trimmedPassword);
      const detectedRole: UserRole = studentRegex.test(localPart) ? 'student' : 'admin';

      if (onLogin) {
        onLogin(detectedRole, trimmedEmail);
      } else if (onLoginSuccess) {
        onLoginSuccess(detectedRole, trimmedEmail);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const handleQuickFill = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('U22107821@sharjah.ac.ae');
      setPassword('studentPass123');
    } else {
      setEmail('AMansoori@sharjah.ac.ae');
      setPassword('adminPass123');
    }
    setErrorMessage('');
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen bg-[#F3F4F6] relative overflow-x-hidden flex flex-col justify-between p-4 sm:p-8"
    >
      {/* Decorative gradient circles */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#10B981]/20 via-[#059669]/15 to-[#0284C7]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#0284C7]/20 via-[#10B981]/15 to-[#059669]/20 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Left Logo Badge */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full mb-4">
        <div className="flex items-center gap-3">
          <div
            id="login-top-logo-badge"
            className="w-[60px] h-[60px] rounded-[16px] bg-[#059669] flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white/80"
          >
            UoS
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-[#1F2937] tracking-tight">
              University of Sharjah
            </h2>
            <p className="text-xs text-[#6B7280] font-medium">Academic Portal Gateway</p>
          </div>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center my-4">
        <div
          id="login-card"
          className="w-full max-w-[460px] bg-white rounded-[24px] shadow-xl overflow-hidden border border-[#E5E7EB]/60 flex flex-col"
        >
          {/* Card Top Banner (1/5th height with gradient) */}
          <div className="bg-gradient-to-r from-[#059669] to-[#10B981] p-7 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
            <h3 className="font-extrabold text-2xl text-white tracking-tight relative z-10">
              Welcome Back
            </h3>
            <p className="text-sm text-white/85 font-medium mt-1 relative z-10">
              Sign in to continue to UoS
            </p>
          </div>

          {/* Card Body & Form */}
          <div className="p-7 flex flex-col gap-5">
            {/* Error Message Alert */}
            {errorMessage && (
              <div
                id="login-error-alert"
                className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#EF4444]/40 text-[#EF4444] text-xs font-semibold flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email-input"
                  className="text-xs font-bold text-[#1F2937] tracking-tight"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    placeholder="U22107821@sharjah.ac.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/25 focus:border-[#059669] transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Students: <span className="font-mono text-[#059669]">U[ID]@sharjah.ac.ae</span> | Staff: <span className="font-mono text-[#059669]">[Name]@sharjah.ac.ae</span>
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-password-input"
                  className="text-xs font-bold text-[#1F2937] tracking-tight"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/25 focus:border-[#059669] transition-all"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                id="login-submit-btn"
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </form>

            {/* Quick Fill Test Accounts */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[#6B7280] font-medium">Quick Demo Fill:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[11px] font-semibold text-[#15803D] flex items-center justify-center gap-1 transition-all"
              >
                <GraduationCap className="w-3 h-3" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[11px] font-semibold text-[#1D4ED8] flex items-center justify-center gap-1 transition-all"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
              <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wider">OR</span>
              <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                id="login-forgot-password-link"
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-[#6B7280] hover:text-[#059669] transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 text-center py-2 text-xs text-[#9CA3AF]">
        &copy; {new Date().getFullYear()} University of Sharjah. All Academic Portal Rights Reserved.
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          id="forgot-password-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            id="forgot-password-modal"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#E5E7EB] animate-in zoom-in-95 duration-150"
          >
            <h4 className="text-lg font-bold text-[#1F2937]">Reset Your Password</h4>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Enter your official Sharjah University email address to receive password recovery instructions.
            </p>

            {forgotSent ? (
              <div className="my-5 p-4 rounded-xl bg-[#D1FAE5] border border-[#10B981]/30 text-[#065F46] text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#059669]" />
                <div>
                  <p className="font-bold">Password Reset Link Dispatched</p>
                  <p className="text-[11px] mt-0.5">
                    We sent a verification code to <span className="font-mono font-semibold">{forgotEmail}</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-4 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Sharjah Email</label>
                <input
                  type="email"
                  placeholder="e.g. U22107821@sharjah.ac.ae"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.endsWith('@sharjah.ac.ae')) {
                      setForgotSent(true);
                    } else {
                      alert('Please enter an email ending with @sharjah.ac.ae');
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
