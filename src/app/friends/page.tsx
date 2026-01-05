'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { FiUsers, FiUserPlus, FiSearch, FiBook, FiCheck, FiX } from 'react-icons/fi';

interface Friend {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  bio?: string;
  image?: string;
  created_at?: string;
}

interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const [follows, setFollows] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollows();
      fetchFollowers();
    }
  }, [user]);

   const fetchFollows = async () => {
     try {
       const { data, error } = await supabase
         .from('follows')
         .select('*')
         .eq('follower_id', user?.id);

       if (data && !error) {
         setFollows(data as Follow[]);
       }
     } catch (error) {
       console.error('Error fetching follows:', error);
     } finally {
       setLoading(false);
     }
   };

   const fetchFollowers = async () => {
     try {
       const { data, error } = await supabase
         .from('follows')
         .select('*')
         .eq('following_id', user?.id);

       if (data && !error) {
         setFollowers(data as Follow[]);
       }
     } catch (error) {
       console.error('Error fetching followers:', error);
     }
   };

   const searchUsers = async (query: string) => {
     if (!query.trim()) {
       setSearchResults([]);
       return;
     }

     try {
       const { data, error } = await supabase
         .from('users')
         .select('*')
         .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
         .neq('id', user?.id)
         .limit(10);

       if (data && !error) {
         setSearchResults(data);
       }
     } catch (error) {
       console.error('Error searching users:', error);
     }
   };

   const toggleFollow = async (followingId: string) => {
     try {
       const isFollowing = follows.some(f => f.following_id === followingId);

       if (isFollowing) {
         const { error } = await supabase
           .from('follows')
           .delete()
           .eq('follower_id', user?.id)
           .eq('following_id', followingId);

         if (!error) {
           setFollows(prev => prev.filter(f => f.following_id !== followingId));
           setSearchResults(prev => prev.map(u => u.id === followingId ? u : u));
         }
       } else {
         const { error } = await supabase
           .from('follows')
           .insert({
             follower_id: user?.id,
             following_id: followingId
           });

         if (!error) {
           setFollows(prev => [...prev, { id: `temp_${Date.now()}`, follower_id: user?.id!, following_id: followingId, created_at: new Date().toISOString() }]);
           setSearchResults(prev => prev.filter(u => u.id !== followingId));
         }
       }
     } catch (error) {
       console.error('Error toggling follow:', error);
     }
   };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchQuery);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view friends</h1>
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
        <div className="text-lg">Loading friends...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiUsers className="w-8 h-8 mr-3 text-blue-600" />
            Friends
          </h1>
          <p className="text-gray-600 mt-2">Connect with other book lovers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Users */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Friends</h2>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Search Results</h3>
                  {searchResults.map((searchUser) => (
                    <div key={searchUser.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                         <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                           <span className="text-xs text-gray-600">
                             {searchUser.name?.charAt(0) || searchUser.username?.charAt(0)?.toUpperCase()}
                           </span>
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-900">{searchUser.name || searchUser.username}</p>
                           <p className="text-xs text-gray-600">@{searchUser.username}</p>
                         </div>
                      </div>
                       <button
                         onClick={() => toggleFollow(searchUser.id)}
                         className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                       >
                         <FiUserPlus className="w-3 h-3 mr-1" />
                         Follow
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

             {/* Your Followers */}
             {followers.length > 0 && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                 <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Followers ({followers.length})</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {followers.slice(0, 6).map((follower) => (
                     <div key={follower.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                       <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0" />
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-medium text-gray-900">User</p>
                         <p className="text-xs text-gray-600">Follows you</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Following */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">
                 Following ({follows.length})
               </h2>
               {follows.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {follows.slice(0, 6).map((follow) => (
                     <div key={follow.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                       <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                         <span className="text-lg text-gray-600">U</span>
                       </div>
                       <div className="flex-1">
                         <p className="font-medium text-gray-900">User</p>
                         <p className="text-sm text-gray-600">Following since</p>
                       </div>
                       <button
                         onClick={() => toggleFollow(follow.following_id)}
                         className="text-red-600 hover:text-red-800 text-sm"
                       >
                         <FiX className="w-5 h-5" />
                       </button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-500">Not following anyone yet. Start searching for people to connect with!</p>
               )}
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
               <div className="space-y-3">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Following</span>
                   <span className="font-semibold">{follows.length}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Followers</span>
                   <span className="font-semibold">{followers.length}</span>
                 </div>
               </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Your Profile
                </Link>
                <Link
                  href="/search"
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Discover Books
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
