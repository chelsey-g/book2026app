'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, THEMES, type Theme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AccountFormState {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailFormState {
  newEmail: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Settings() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { currentTheme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [accountForm, setAccountForm] = useState<AccountFormState>({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [accountErrors, setAccountErrors] = useState<FormErrors>({});
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [emailForm, setEmailForm] = useState<EmailFormState>({
    newEmail: '',
  });
  const [emailErrors, setEmailErrors] = useState<FormErrors>({});
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

   useEffect(() => {
     const savedNotifications = localStorage.getItem('emailNotifications');
     if (savedNotifications !== null) {
       setEmailNotifications(savedNotifications === 'true');
     }
   }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
    }
  }, [user, authLoading]);

   const handleThemeChange = (themeName: string) => {
     setTheme(themeName);
   };

   const handleNotificationToggle = (enabled: boolean) => {
     setEmailNotifications(enabled);
     localStorage.setItem('emailNotifications', enabled.toString());
     setShowSaved(true);
     setTimeout(() => setShowSaved(false), 2000);
   };

    const handleSignOut = async () => {
      if (confirm('Are you sure you want to sign out?')) {
        await signOut();
      }
    };

    const validateAccountForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!accountForm.username && !accountForm.newPassword) {
        newErrors.general = 'Please fill in at least one field';
        return false;
      }

      if (accountForm.username && accountForm.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (accountForm.newPassword) {
        if (accountForm.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (accountForm.newPassword !== accountForm.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!accountForm.currentPassword) {
          newErrors.currentPassword = 'Current password required to change password';
        }
      }

      setAccountErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAccountSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAccountLoading(true);
      setAccountSuccess(false);
      setAccountErrors({});

      if (!validateAccountForm()) {
        setAccountLoading(false);
        return;
      }

      try {
        const { data: { session } } = await (await import('@/lib/supabase/client')).supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setAccountErrors({ general: 'Authentication error. Please sign in again.' });
          setAccountLoading(false);
          return;
        }

        const response = await fetch('/api/users/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: accountForm.username || undefined,
            currentPassword: accountForm.currentPassword || undefined,
            newPassword: accountForm.newPassword || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setAccountErrors({ general: data.error || 'Failed to update account' });
        } else {
          setAccountSuccess(true);
          setAccountForm({
            username: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setTimeout(() => setAccountSuccess(false), 3000);
        }
      } catch (error) {
        console.error('Account update error:', error);
        setAccountErrors({ general: 'An error occurred. Please try again.' });
      } finally {
        setAccountLoading(false);
      }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailLoading(true);
      setEmailSuccess(false);
      setEmailErrors({});

      if (!emailForm.newEmail) {
        setEmailErrors({ general: 'Please enter a new email address' });
        setEmailLoading(false);
        return;
      }

      if (!emailForm.newEmail.includes('@')) {
        setEmailErrors({ general: 'Invalid email address' });
        setEmailLoading(false);
        return;
      }

      try {
        const { data: { session } } = await (await import('@/lib/supabase/client')).supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setEmailErrors({ general: 'Authentication error. Please sign in again.' });
          setEmailLoading(false);
          return;
        }

        const response = await fetch('/api/users/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            newEmail: emailForm.newEmail,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setEmailErrors({ general: data.error || 'Failed to update email' });
        } else {
          setEmailSuccess(true);
          setEmailForm({ newEmail: '' });
          setTimeout(() => setEmailSuccess(false), 3000);
        }
      } catch (error) {
        console.error('Email change error:', error);
        setEmailErrors({ general: 'An error occurred. Please try again.' });
      } finally {
        setEmailLoading(false);
      }
    };

   if (authLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${THEMES.light.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.accentColor} bg-clip-text text-transparent mb-2`}>
            Settings
          </h1>
          <p className="text-lg text-gray-600">
            Customize your reading experience
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-opacity-50" style={{ borderColor: 'currentColor' }}>
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Choose Theme</h2>
            <p className="text-gray-600 mt-1">Select a color scheme for your BookTracker experience</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(THEMES).map(([key, theme]) => (
                <div
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    currentTheme.name === theme.name
                      ? 'border-gray-900 shadow-xl'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-br ${theme.bgGradient} relative overflow-hidden`}>
                    {currentTheme.name === theme.name && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-br ${theme.accentColor} rounded-lg opacity-80`}></div>
                      <div className="flex gap-2">
                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.statCards.books} rounded opacity-60`}></div>
                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.statCards.total} rounded opacity-60`}></div>
                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.statCards.reading} rounded opacity-60`}></div>
                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.statCards.rating} rounded opacity-60`}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-gray-900 text-lg">{theme.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

         <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-opacity-50 mt-6" style={{ borderColor: 'currentColor' }}>
           <div className="px-6 py-5 border-b border-gray-200">
             <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
             <p className="text-gray-600 mt-1">Manage your notification and account settings</p>
           </div>
           <div className="p-6 space-y-6">
             <div className="flex items-center justify-between pb-6 border-b border-gray-200">
               <div>
                 <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                 <p className="text-sm text-gray-600 mt-1">Receive updates about friend activity and recommendations</p>
               </div>
               <button
                 onClick={() => handleNotificationToggle(!emailNotifications)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                   emailNotifications ? 'bg-teal-600' : 'bg-gray-300'
                 }`}
               >
                 <span
                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                     emailNotifications ? 'translate-x-6' : 'translate-x-1'
                   }`}
                 />
               </button>
             </div>

             {showSaved && (
               <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                 <Check className="h-4 w-4" />
                 Preferences saved
               </div>
             )}

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Sign Out</h3>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-opacity-50 mt-6" style={{ borderColor: 'currentColor' }}>
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Account Management</h2>
              <p className="text-gray-600 mt-1">Update your username and password</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                {accountErrors.general && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{accountErrors.general}</span>
                  </div>
                )}

                {accountSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                    <Check className="h-4 w-4" />
                    Account updated successfully
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={accountForm.username}
                    onChange={(e) => {
                      setAccountForm({ ...accountForm, username: e.target.value });
                      if (accountErrors.username) {
                        setAccountErrors({ ...accountErrors, username: '' });
                      }
                    }}
                    placeholder="New username (optional)"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      accountErrors.username
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {accountErrors.username && (
                    <p className="text-red-600 text-sm mt-1">{accountErrors.username}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={accountForm.currentPassword}
                          onChange={(e) => {
                            setAccountForm({ ...accountForm, currentPassword: e.target.value });
                            if (accountErrors.currentPassword) {
                              setAccountErrors({ ...accountErrors, currentPassword: '' });
                            }
                          }}
                          placeholder="Enter current password"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 ${
                            accountErrors.currentPassword
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {accountErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-1">{accountErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={accountForm.newPassword}
                          onChange={(e) => {
                            setAccountForm({ ...accountForm, newPassword: e.target.value });
                            if (accountErrors.newPassword) {
                              setAccountErrors({ ...accountErrors, newPassword: '' });
                            }
                          }}
                          placeholder="New password (min 6 characters)"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 ${
                            accountErrors.newPassword
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {accountErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-1">{accountErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={accountForm.confirmPassword}
                          onChange={(e) => {
                            setAccountForm({ ...accountForm, confirmPassword: e.target.value });
                            if (accountErrors.confirmPassword) {
                              setAccountErrors({ ...accountErrors, confirmPassword: '' });
                            }
                          }}
                          placeholder="Confirm new password"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 ${
                            accountErrors.confirmPassword
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {accountErrors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{accountErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={accountLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {accountLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountForm({
                        username: '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setAccountErrors({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-opacity-50 mt-6" style={{ borderColor: 'currentColor' }}>
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Email Address</h2>
              <p className="text-gray-600 mt-1">Update your email address (currently: {user.email})</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {emailErrors.general && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{emailErrors.general}</span>
                  </div>
                )}

                {emailSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                    <Check className="h-4 w-4" />
                    Confirmation email sent to your new email address
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => {
                      setEmailForm({ newEmail: e.target.value });
                      if (emailErrors.general) {
                        setEmailErrors({});
                      }
                    }}
                    placeholder="Enter new email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {emailLoading ? 'Sending...' : 'Update Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailForm({ newEmail: '' });
                      setEmailErrors({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}