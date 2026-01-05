'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { FiBook, FiStar, FiUsers, FiSettings, FiEdit2, FiCamera, FiUpload } from 'react-icons/fi';
import { Target } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  created_at: string;
}

interface UserBook {
  id: string;
  books?: {
    title: string;
    author: string;
    cover_url: string;
  };
  status: string;
  rating?: number;
}

interface ReadingGoal {
  id: string;
  user_id: string;
  year: number;
  goal_count: number;
  description?: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [readingGoal, setReadingGoal] = useState<ReadingGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalCount, setEditGoalCount] = useState(12);
  const [editGoalDescription, setEditGoalDescription] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

       if (data && !error) {
         console.log('Profile fetched:', data);
         console.log('Image URL:', data.image);
         setProfile(data);
         setEditBio(data.bio || '');
         setProfilePictureUrl(data.image || null);
      } else {
        // User doesn't exist in users table yet, or there's an error
        console.log('User profile not found, creating profile...');
        try {
           const { data: newUser, error: createError } = await supabase
             .from('users')
             .insert({
               id: user?.id,
               username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
               full_name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
               bio: '',
             })
             .select()
             .single();

          if (newUser && !createError) {
            setProfile(newUser);
            setEditBio('');
            setProfilePictureUrl(null);
            console.log('User profile created successfully');
          } else {
            console.error('Error creating user profile:', createError);
            // If profile creation fails, create a minimal profile object
            const fallbackProfile = {
              id: user?.id || '',
              username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
              full_name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
              bio: '',
              created_at: user?.created_at || new Date().toISOString(),
            };
            setProfile(fallbackProfile);
            setEditBio('');
            setProfilePictureUrl(null);
          }
        } catch (createError) {
          console.error('Exception creating user profile:', createError);
          // Fallback to auth user data
          const fallbackProfile = {
            id: user?.id || '',
            username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
            full_name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
            bio: '',
            created_at: user?.created_at || new Date().toISOString(),
          };
          setProfile(fallbackProfile);
          setEditBio('');
          setProfilePictureUrl(null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserBooks();
      fetchReadingGoal();
    }
  }, [user, fetchProfile]);

  const fetchUserBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_books')
        .select('*, books(*)')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (data && !error) {
        setUserBooks(data as any);
      }
    } catch (error) {
      console.error('Error fetching user books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadingGoal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch('/api/reading-goals', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (data.goal) {
        setReadingGoal(data.goal);
        setEditGoalCount(data.goal.goal_count);
        setEditGoalDescription(data.goal.description || '');
      }
    } catch (error) {
      console.error('Error fetching reading goal:', error);
    }
  };

  const updateBio = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ bio: editBio })
        .eq('id', user?.id);

      if (!error) {
        setProfile(prev => prev ? { ...prev, bio: editBio } : null);
        setIsEditing(false);
      } else {
        console.error('Error updating bio:', error);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const updateReadingGoal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session token available');
        return;
      }

      const response = await fetch('/api/reading-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          goal_count: editGoalCount,
          description: editGoalDescription,
          year: new Date().getFullYear(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data.error || 'Unknown error');
        alert('Error saving goal: ' + (data.error || 'Unknown error'));
        return;
      }

      if (data.goal) {
        setReadingGoal(data.goal);
        setIsEditingGoal(false);
        console.log('Goal saved successfully:', data.goal);
      } else {
        console.error('No goal in response:', data);
        alert('Failed to save goal - no data returned');
      }
    } catch (error) {
      console.error('Error updating reading goal:', error);
      alert('Error saving goal: ' + String(error));
    }
  };

  const getBooksByStatus = (status: string) => {
    return userBooks.filter(book => book.status === status);
  };

  const booksReadThisYear = getBooksByStatus('READ').filter(book => {
    if (!book.books) return false;
    return true;
  }).length;


  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingPicture(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Authentication required. Please sign in again.');
        return;
      }

      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

       if (data.success) {
         console.log('Upload response:', data);
         console.log('Setting profilePictureUrl to:', data.profilePictureUrl);
         setProfilePictureUrl(data.profilePictureUrl);
         setProfile(prev => {
           console.log('Updating profile state');
           return prev ? { ...prev, image: data.profilePictureUrl } : null;
         });
         console.log('Calling fetchProfile...');
         await fetchProfile();
         console.log('Profile picture updated successfully');
       }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload profile picture: ' + String(error));
    } finally {
      setUploadingPicture(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
          
          <div className="px-8 pb-8">
            <div className="flex items-start gap-6 -mt-16 mb-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative ring-4 ring-white shadow-lg">
                  <img 
                    src={profilePictureUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%2318b8a6' width='128' height='128'/%3E%3C/svg%3E"} 
                    alt="Profile" 
                    className="h-32 w-32 object-cover rounded-full relative z-10"
                    style={{ display: 'block', opacity: 1, zIndex: 999 }}
                  />
                </div>
                <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 z-20">
                  <FiCamera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadingPicture}
                    className="hidden"
                  />
                </label>
                {uploadingPicture && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin">
                      <FiUpload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 mt-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-gray-500 mb-1">@{user.user_metadata?.username || profile?.username || user.email?.split('@')[0] || 'user'}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <FiUsers className="w-4 h-4" />
                  Member since {new Date(user.created_at || profile?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <FiBook className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-emerald-700 mb-1">{getBooksByStatus('READ').length}</div>
                <div className="text-sm font-medium text-emerald-600">Books Read</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <FiBook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-1">{getBooksByStatus('CURRENTLY_READING').length}</div>
                <div className="text-sm font-medium text-blue-600">Currently Reading</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <FiStar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-700 mb-1">{getBooksByStatus('WANT_TO_READ').length}</div>
                <div className="text-sm font-medium text-amber-600">Want to Read</div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-gray-900">About</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-teal-600 transition-colors p-1 rounded hover:bg-white"
                    aria-label="Edit bio"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={updateBio}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditBio(profile?.bio || '');
                      }}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {profile?.bio || 'No bio yet. Click the edit button to add one!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reading Goal Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{new Date().getFullYear()} Reading Goal</h2>
            </div>
            {!isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditingGoal ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Books Goal
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={editGoalCount}
                  onChange={(e) => setEditGoalCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={editGoalDescription}
                  onChange={(e) => setEditGoalDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={2}
                  placeholder="e.g., Focus on sci-fi and fantasy..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={updateReadingGoal}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  Save Goal
                </button>
                <button
                  onClick={() => {
                    setIsEditingGoal(false);
                    if (readingGoal) {
                      setEditGoalCount(readingGoal.goal_count);
                      setEditGoalDescription(readingGoal.description || '');
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-teal-600">{editGoalCount}</div>
                <div className="text-sm text-teal-700 mt-1">Books Goal</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{booksReadThisYear}</div>
                <div className="text-sm text-blue-700 mt-1">Read This Year</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{Math.round((booksReadThisYear / editGoalCount) * 100)}%</div>
                <div className="text-sm text-purple-700 mt-1">Progress</div>
              </div>
            </div>
          )}
          {readingGoal?.description && !isEditingGoal && (
            <p className="text-gray-600 text-sm mt-4 italic">&quot;{readingGoal.description}&quot;</p>
          )}
        </div>

        {/* Reading Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currently Reading */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiBook className="w-5 h-5 mr-2 text-teal-600" />
              Currently Reading
            </h2>
            <div className="space-y-3">
              {getBooksByStatus('CURRENTLY_READING').map((userBook) => (
                <div key={userBook.id} className="flex items-center space-x-3">
                  <img
                    src={(userBook.books as any)?.cover_url || '/placeholder-book.png'}
                    alt={(userBook.books as any)?.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {(userBook.books as any)?.title}
                    </p>
                    <p className="text-sm text-gray-600">{(userBook.books as any)?.author}</p>
                  </div>
                </div>
              ))}
              {getBooksByStatus('CURRENTLY_READING').length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 rounded-full mb-3">
                    <FiBook className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="text-gray-500 text-sm mb-3">No books in progress</p>
                  <Link href="/search" className="inline-block px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                    Start Reading
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Want to Read */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiStar className="w-5 h-5 mr-2 text-yellow-600" />
              Want to Read
            </h2>
            <div className="space-y-3">
              {getBooksByStatus('WANT_TO_READ').slice(0, 5).map((userBook) => (
                <div key={userBook.id} className="flex items-center space-x-3">
                  <img
                    src={(userBook.books as any)?.cover_url || '/placeholder-book.png'}
                    alt={(userBook.books as any)?.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {(userBook.books as any)?.title}
                    </p>
                    <p className="text-sm text-gray-600">{(userBook.books as any)?.author}</p>
                  </div>
                </div>
              ))}
              {getBooksByStatus('WANT_TO_READ').length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-full mb-3">
                    <FiStar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-gray-500 text-sm mb-3">No books on your wishlist</p>
                  <Link href="/search" className="inline-block px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                    Discover Books
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recently Read */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiBook className="w-5 h-5 mr-2 text-green-600" />
              Recently Read
            </h2>
            <div className="space-y-3">
              {getBooksByStatus('READ').slice(0, 5).map((userBook) => (
                <div key={userBook.id} className="flex items-center space-x-3">
                  <img
                    src={(userBook.books as any)?.cover_url || '/placeholder-book.png'}
                    alt={(userBook.books as any)?.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {(userBook.books as any)?.title}
                    </p>
                    <p className="text-sm text-gray-600">{(userBook.books as any)?.author}</p>
                  </div>
                </div>
              ))}
              {getBooksByStatus('READ').length === 0 && (
                <p className="text-gray-500 text-sm">No books read yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
