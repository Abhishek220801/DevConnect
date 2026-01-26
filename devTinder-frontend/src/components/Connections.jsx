import { useEffect, useState } from 'react';
import { BASE_URL, STATIC_URL } from '../utils/constants'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Users, Sparkles, MapPin, Briefcase } from 'lucide-react';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return "https://geographyandyou.com/images/user-profile.png"

    if (photoUrl.startsWith("/uploads/")) {
      return `${STATIC_URL}${photoUrl}`
    }

    if (photoUrl.startsWith("http")) {
      return photoUrl
    }

    return "https://geographyandyou.com/images/user-profile.png"
  }

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + '/user/connections', 
        { withCredentials: true }
      );
      setConnections(res?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch connections");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, [])
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-3">
            <Users size={16} />
            <span className="text-sm font-semibold">Your Network</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Connections
          </h1>
          <p className="text-gray-600">
            {connections.length > 0 
              ? `${connections.length} ${connections.length === 1 ? 'connection' : 'connections'}`
              : 'Start building your network'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading your connections...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && connections.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={48} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Connections Yet</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Start exploring and connecting with developers to build your network!
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Sparkles size={18} />
              <span>Discover Developers</span>
            </a>
          </div>
        )}

        {/* Connections Grid */}
        {!loading && connections.length > 0 && (
          <div className="grid gap-4">
            {connections.map(({ _id, firstName, lastName, about, photoUrl, age, location, currentRole, company }) => (
              <div
                key={_id}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex gap-6 p-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-purple-500 ring-offset-2">
                      <img
                        src={getPhotoUrl(photoUrl)}
                        alt={`${firstName}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">
                          {firstName} {lastName} {age && `, ${age}`}
                        </h3>
                        {(currentRole || company) && (
                          <div className="flex items-center gap-2 text-purple-600 mt-1">
                            <Briefcase size={14} />
                            <span className="text-sm font-medium">
                              {currentRole} {company && `@ ${company}`}
                            </span>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <MapPin size={14} />
                            <span className="text-sm">{location}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Active Status */}
                      <div className="flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-700 font-medium">Active</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {about || "No bio available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Connections