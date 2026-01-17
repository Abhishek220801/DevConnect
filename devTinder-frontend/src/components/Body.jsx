import { Outlet } from "react-router"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useAuth } from "../hooks/useAuth"
import { Suspense} from "react"
import {MoonLoader} from 'react-spinners'

const Body = () => {
  useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1 bg-black">
        <Suspense fallback={<MoonLoader/>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default Body
