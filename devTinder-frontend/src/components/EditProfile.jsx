import { useEffect, useState, useRef } from "react"
import FeedCard from "./FeedCard.jsx"
import { BASE_URL } from "../utils/constants.js"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice.js"
import axios from "axios"
import { User, Mail, MapPin, Briefcase, Github, Linkedin, Twitter, Upload, Save } from "lucide-react"

const EditProfile = ({ user }) => {
  const dispatch = useDispatch()
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState("")
  const hasInitialized = useRef(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    photoUrl: "",
    photo: null,
    age: "",
    gender: "",
    about: "",
    skills: [],
    location: "",
    currentRole: "",
    company: "",
    github: "",
    linkedin: "",
    twitter: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user || hasInitialized.current) return

    const userData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      photoUrl: user.photoUrl || "",
      photo: null,
      age: user.age || "",
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
      location: user.location || "",
      currentRole: user.currentRole || "",
      company: user.company || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
    }

    setFormData((prev) => ({ ...prev, ...userData }))
    hasInitialized.current = true
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }))

    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl)
    const blobUrl = URL.createObjectURL(file)
    setPreviewPhotoUrl(blobUrl)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.emailId) {
      setError("First name and email are required")
      return
    }
    saveProfile()
  }

  const saveProfile = async () => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      const data = new FormData()

      const fields = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "about",
        "location",
        "currentRole",
        "company",
        "github",
        "linkedin",
        "twitter",
      ]

      fields.forEach((key) => {
        if (formData[key]) data.append(key, formData[key])
      })

      data.append("skills", JSON.stringify(formData.skills || []))

      if (formData.photo) {
        data.append("photo", formData.photo)
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", data, {
        withCredentials: true,
      })

      dispatch(addUser(res.data.data))

      const updatedData = {
        ...res.data.data,
        photo: null,
      }

      if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl)
      setPreviewPhotoUrl("")
      const newPhotoUrl = res.data.data.photoUrl

      setFormData((prev) => ({
        ...prev,
        ...updatedData,
        photoUrl: newPhotoUrl,
        photo: null,
      }))

      setSuccess("Profile updated successfully! ✓")
    } catch (err) {
      console.error("Save profile error:", err)
      setError(
        err?.response?.data?.message || "Something went wrong. Try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    return () => {
      if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl)
    }
  }, [previewPhotoUrl])

  if (!user) return null

  const displayPhotoUrl = previewPhotoUrl || formData.photoUrl

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-3">
            <User size={16} />
            <span className="text-xs font-medium">Profile Settings</span>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Edit Your Profile
          </h1>
          <p className="text-gray-600">
            Update your information and see how it looks in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* EDIT FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 p-5 max-h-[75vh] overflow-y-auto">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-purple-600" />
                Personal Information
              </h2>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs">
                  {success}
                </div>
              )}

              {/* Profile Photo */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {displayPhotoUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-purple-500 ring-offset-2">
                      <img
                        src={displayPhotoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-xs text-gray-600 font-medium">
                      {formData.photo ? formData.photo.name : "Choose Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: 5MB. Formats: JPG, PNG, GIF
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email & Age */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Mail size={14} className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="25"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="preferNotToSay">Prefer not to say</option>
                </select>
              </div>

              {/* Location & Current Role */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <MapPin size={14} className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Briefcase size={14} className="inline mr-1" />
                    Current Role
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                  placeholder="Tech Corp"
                />
              </div>

              {/* About */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(", ")}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setFormData((prev) => ({
                      ...prev,
                      skills: skillsArray,
                    }))
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                  placeholder="React, Node.js, Python, MongoDB..."
                />
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Github size={14} className="inline mr-1" />
                    GitHub
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Linkedin size={14} className="inline mr-1" />
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Twitter size={14} className="inline mr-1" />
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-gray-900"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* PREVIEW */}
          <div className="sticky top-24">
            <div className="mb-4 text-center">
              <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-medium">
                Live Preview
              </span>
            </div>
            <FeedCard
              user={{
                ...formData,
                photoUrl: displayPhotoUrl,
              }}
              variant="preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile