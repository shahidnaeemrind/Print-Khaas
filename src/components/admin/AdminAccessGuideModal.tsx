import React from 'react';
import { X, Shield, Lock, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../../context/AuthContext';

interface AdminAccessGuideModalProps {
  onClose: () => void;
}

export const AdminAccessGuideModal: React.FC<AdminAccessGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF7] border-b border-[#E8E5DD]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#B8860B]" />
            <span className="font-serif text-base font-bold text-[#0B132B]">
              Security & Administrator Authorization Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-stone-600 leading-relaxed overflow-y-auto max-h-[75vh]">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Primary Bootstrapped Administrator</span>
            </div>
            <p>
              Your verified Google account (<strong className="font-mono text-emerald-800">{BOOTSTRAPPED_ADMIN_EMAIL}</strong>) is hardcoded into the deployed Firestore Security Rules. When you sign in with this Google account, you receive instant, full administrative write access without requiring manual database edits.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>How to Authorize Additional Team Members:</span>
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>
                Ask the new team member to visit <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">/admin</span> and click &ldquo;Sign in with Google&rdquo;.
              </li>
              <li>
                Copy their Google Account <strong className="font-mono">User UID</strong> (displayed on the login screen).
              </li>
              <li>
                Open the Firebase Console &rarr; Cloud Firestore &rarr; <strong className="font-mono">admins</strong> collection.
              </li>
              <li>
                Create a new document with Document ID set to the user&apos;s <strong className="font-mono">UID</strong>.
              </li>
              <li>
                Add fields: <span className="font-mono">email: &quot;team@printkhaas.com&quot;</span>, <span className="font-mono">role: &quot;editor&quot;</span>.
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>Zero-Trust Database Enforcement</span>
            </div>
            <p>
              Public users cannot create, modify, or delete any products or settings even if they bypass the UI, because Cloud Firestore Security Rules actively block non-admin writes at the database layer. Draft products are strictly shielded from unauthenticated queries.
            </p>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0B132B] text-white text-xs font-semibold hover:bg-[#1E293B]"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
