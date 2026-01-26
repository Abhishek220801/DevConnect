import axios from "axios";
import { BASE_URL, STATIC_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify'
import { Mail, UserCheck, UserX, Sparkles, MapPin, Briefcase } from "lucide-react";

const Requests = () => {
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return "https://geographyandyou.com/images/user-profile.png"
    if (photoUrl.startsWith("/uploads/")) return `${STATIC_URL}${photoUrl}`
    if (photoUrl.startsWith("http")) return photoUrl
    return "https://geographyandyou.com/images/user-profile.png"
  }

  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/user/requests/received`,
        { withCredentials: true }
      );

      if (res?.data?.message === "No new connection requests") {
        setMessage("No new requests found");
        return;
      }

      setRequests(res?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch requests");
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + '/request/review/' + status + '/' + requestId,
        {},
        { withCredentials: true }
      );
      
      const newArray = requests.filter((r) => r._id !== requestId);
      setRequests(newArray);
      
      toast.success(
        status === 'accept' 
          ? '✓ Connection request accepted!' 
          : 'Request rejected'
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to process request");
    }
  }

  useEffect(() => {
    getRequests();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (message || requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-3">
              <Mail size={16} />
              <span className="text-sm font-semibold">Connection Requests</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Requests
            </h1>
          </div>

          {/* Empty State Card */}
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={48} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Pending Requests</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              You're all caught up! When developers send you connection requests, they'll appear here.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Sparkles size={18} />
              <span>Discover Developers</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Requests List
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-3">
            <Mail size={16} />
            <span className="text-sm font-semibold">Pending Requests</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Connection Requests
          </h1>
          <p className="text-gray-600">
            {requests.length} {requests.length === 1 ? 'person wants' : 'people want'} to connect with you
          </p>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-4">
          {requests.map(({ _id, fromUserId }) => (
            <div
              key={_id}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                {/* User Info */}
                <div className="flex gap-4 items-start flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-purple-500 ring-offset-2">
                      <img
                        src={getPhotoUrl(fromUserId.photoUrl)}
                        alt={`${fromUserId.firstName}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {fromUserId.firstName} {fromUserId.lastName}
                      {fromUserId.age && `, ${fromUserId.age}`}
                    </h3>

                    {(fromUserId.currentRole || fromUserId.company) && (
                      <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Briefcase size={14} />
                        <span className="text-sm font-medium">
                          {fromUserId.currentRole} {fromUserId.company && `@ ${fromUserId.company}`}
                        </span>
                      </div>
                    )}

                    {fromUserId.location && (
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <MapPin size={14} />
                        <span className="text-sm">{fromUserId.location}</span>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {fromUserId.about || "No bio available"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => reviewRequest('accept', _id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <UserCheck size={18} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => reviewRequest('reject', _id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <UserX size={18} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;