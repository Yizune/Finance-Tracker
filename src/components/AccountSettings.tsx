import { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { useApp } from '../context';

interface Props {
  onClose: () => void;
}

export default function AccountSettings({ onClose }: Props) {
  const { user, refreshUser } = useApp();

  const [name, setName] = useState(user?.user_metadata?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSave() {
    const e: typeof errors = {};
    setSuccessMsg('');

    if (!name.trim()) e.name = 'Name cannot be empty';
    if (!email.trim()) e.email = 'Email cannot be empty';

    const hasPassword = newPassword || confirmPassword;
    if (hasPassword) {
      if (newPassword.length < 6) e.password = 'Password must be at least 6 characters';
      else if (newPassword !== confirmPassword) e.password = 'Passwords do not match';
    }

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    const messages: string[] = [];

    try {
      const nameChanged = name.trim() !== (user?.user_metadata?.full_name ?? '');
      if (nameChanged) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: name.trim() },
        });
        if (error) throw error;
        messages.push('Display name updated');
      }

      const emailChanged = email.trim() !== (user?.email ?? '');
      if (emailChanged) {
        const { error } = await supabase.auth.updateUser({ email: email.trim() });
        if (error) throw error;
        messages.push('Confirmation sent to new email');
      }

      if (hasPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        messages.push('Password updated');
      }

      if (messages.length > 0) {
        await refreshUser();
        setSuccessMsg(messages.join('. ') + '!');
      } else {
        setSuccessMsg('No changes to save.');
      }
    } catch (err: any) {
      setErrors({ general: err.message ?? 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div
      className="popup"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content">
        <h2>Account Settings</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            className={errors.name ? 'has-error' : ''}
          />
          <span className="error-text">{errors.name ?? ''}</span>

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className={errors.email ? 'has-error' : ''}
          />
          <span className="error-text">{errors.email ?? ''}</span>

          <label>New Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={errors.password ? 'has-error' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <span className="error-text">{''}</span>

          <label>Confirm Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={errors.password ? 'has-error' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <span className="error-text">{errors.password ?? ''}</span>

          {errors.general && <span className="error-text">{errors.general}</span>}
          {successMsg && <span className="success-text">{successMsg}</span>}

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
