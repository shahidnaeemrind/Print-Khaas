import React from 'react';
import { Shield, Lock, AlertCircle, ArrowLeft, CheckCircle2, User } from 'lucide-react';
import { useAuth, BOOTSTRAPPED_ADMIN_EMAIL } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const {
    currentUser,
    adminUser,
    isAuthorizedAdmin,
    signInWithGoogle,
    logout,
    authError,
    clearAuthError,
    loading,
  } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Print Khaas Store</span>
        </button>

        <div className="text-center">
          <img
            src="/logo.svg"
            alt="Print Khaas"
            className="h-14 sm:h-16 w-auto mx-auto mb-4 object-contain"
          />
          <h2 className="font-serif text-2xl font-bold text-[#0B132B]">
            Publisher Portal Login
          </h2>
          <p className="mt-1 text-xs text-stone-600">
            Authorized administrator console for Print Khaas &bull; Est. 2014
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-stone-200">
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block mb-1">Authentication Restricted</span>
                <p className="leading-relaxed">{authError}</p>
                <button
                  onClick={clearAuthError}
                  className="mt-2 text-[11px] underline font-semibold text-rose-900 hover:text-rose-950"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Current State Indicator */}
          {currentUser ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border border-stone-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <span className="font-bold text-sm text-stone-900 block truncate">
                      {currentUser.displayName || 'Google User'}
                    </span>
                    <span className="text-xs text-stone-500 block truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200">
                  {isAuthorizedAdmin ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Print Khaas Administrator</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>Account is not on the admin allowlist</span>
                    </div>
                  )}
                </div>
              </div>

              {!isAuthorizedAdmin ? (
                <div className="text-xs text-stone-600 bg-amber-50 p-3.5 rounded-lg border border-amber-200 leading-relaxed">
                  <p className="font-semibold text-amber-900 mb-1">How to authorize this account:</p>
                  <p>
                    The bootstrapped administrator email is <strong className="font-mono">{BOOTSTRAPPED_ADMIN_EMAIL}</strong>. Please switch Google accounts, or ask the primary administrator to register your UID (<span className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">{currentUser.uid}</span>) in Firestore.
                  </p>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={logout}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Sign Out & Switch Account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs text-stone-600 leading-relaxed text-center">
                Sign in with your authorized Google Account to manage publications, update prices, view drafts, and edit business settings.
              </p>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="pt-4 border-t border-stone-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Authorized for: {BOOTSTRAPPED_ADMIN_EMAIL}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
