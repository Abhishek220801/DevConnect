import { useState } from "react"
import {
  Heart,
  X,
  Code2,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { BASE_URL, STATIC_URL } from "../utils/constants"
import { removeUserFromFeed } from "../utils/FeedSlice"

const FeedCard = ({ user, variant }) => {
  const {
    _id,
    firstName,
    lastName,
    about,
    skills,
    photoUrl,
    age,
    gender,
    location,
    currentRole,
    company,
    github,
    linkedin,
    twitter,
  } = user
  const [isFlipping, setIsFlipping] = useState(false)

  const dispatch = useDispatch()
  const isPreview = variant === "preview"

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return "https://geographyandyou.com/images/user-profile.png"

    if (photoUrl.startsWith("blob:")) {
      return photoUrl
    }

    if (photoUrl.startsWith("/uploads/")) {
      return `${STATIC_URL}${photoUrl}`
    }

    if (photoUrl.startsWith("http")) {
      return photoUrl
    }

    return "https://geographyandyou.com/images/user-profile.png"
  }

  const handleSendRequest = async (status) => {
    if (isFlipping || isPreview) return
    setIsFlipping(true)
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      )
      setTimeout(() => dispatch(removeUserFromFeed(_id)), 300)
    } catch (err) {
      console.error(err)
      setIsFlipping(false)
    }
  }

  return (
    <div
      className={`w-full max-w-md transition-all duration-300 ${
        isFlipping ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {isPreview && (
          <div className="absolute top-4 right-4 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Preview
          </div>
        )}

        {/* Profile Image Section */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
          <img
            src={getPhotoUrl(photoUrl)}
            alt={`${firstName}'s profile`}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Name & Role Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {firstName} {lastName || ""} {age && `, ${age}`}
                </h2>
                {(currentRole || company) && (
                  <div className="flex items-center gap-2 text-purple-200 mb-2">
                    <Briefcase size={16} />
                    <span className="text-sm font-medium">
                      {currentRole} {company && `@ ${company}`}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-gray-200">
                    <MapPin size={14} />
                    <span className="text-xs">{location}</span>
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-400/40">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-100 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5 bg-white">
          {/* About */}
          {about && (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {about}
              </p>
            </div>
          )}

          {/* Skills */}
          {Array.isArray(skills) && skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={16} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-800">
                  Tech Stack
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    +{skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(github || linkedin || twitter) && (
            <div className="flex gap-3 pt-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-100 hover:bg-gray-800 hover:text-white rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <Github size={18} />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 border border-blue-200"
                >
                  <Linkedin size={18} className="text-blue-600 hover:text-white" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-sky-50 hover:bg-sky-500 hover:text-white rounded-xl transition-all duration-200 border border-sky-200"
                >
                  <Twitter size={18} className="text-sky-500 hover:text-white" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isPreview && (
          <div className="p-6 pt-0 bg-white">
            <div className="flex gap-4">
              <button
                disabled={isFlipping}
                onClick={() => handleSendRequest("pass")}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <X size={22} strokeWidth={2.5} />
                  <span>Pass</span>
                </span>
              </button>

              <button
                disabled={isFlipping}
                onClick={() => handleSendRequest("like")}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart size={22} strokeWidth={2.5} />
                  <span>Connect</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedCard