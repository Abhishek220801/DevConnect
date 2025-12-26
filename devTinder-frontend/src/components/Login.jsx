import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router"
import { BASE_URL } from "../utils/constants"
import { toast } from "react-toastify"

const Login = () => {
  const [emailId, setEmailId] = useState("abhishek@gmail.com")
  const [password, setPassword] = useState("Abhi@123")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoginForm, setIsLoginForm] = useState(true)

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)

  useEffect(() => {
    if (user) navigate("/")
  }, [user, navigate])

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)
    try {
      if(isLoginForm){
        const res = await axios.post(
          BASE_URL + "/login",
          {emailId, password},
          { withCredentials: true }
        )
        dispatch(addUser(res.data))
        navigate("/feed")
      } else {
        await axios.post(
          BASE_URL + "/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true }
        )
        toast.success("Account created. Please login.");
        setIsLoginForm(true);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.response.data || "Bad credentials, Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <div className="flex justify-center my-10">
      <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-4 ">
        <legend className="fieldset-legend">
          {isLoginForm ? "Login" : "Sign Up"}
        </legend>

        {!isLoginForm && (
          <>
            <label className="label">First Name</label>
            <input
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value) + setError("")}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            <label className="label">Last Name</label>
            <input
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value) + setError("")}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </>
        )}

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value) + setError("")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value) + setError("")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {error && (
          <div className="text-error mt-2 mb-1">
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn btn-neutral mt-4 w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isLoginForm ? "Logging in..." : "Signing up..."}
            </>
          ) : (
            isLoginForm ? "Login" : "Sign Up"
          )}
        </button>

        <p className="m-auto text-gray-400">
          {isLoginForm ? "New here? " : "Already registered? "}
          <span
            className="hover:underline cursor-pointer"
            onClick={() => setIsLoginForm(!isLoginForm)}
          >
            {isLoginForm ? "Register" : "Login"}
          </span>
        </p>
      </fieldset>
    </div>
  )
}

export default Login
