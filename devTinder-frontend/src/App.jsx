import { BrowserRouter, Route, Routes } from "react-router"
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import Connections from "./components/Connections"
import NotFoundPage from "./components/NotFoundPage"
import Requests from "./components/Requests"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route 
              index 
              element={
              <ProtectedRoute>
                <Feed/>
              </ProtectedRoute>
            } 
            />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
            <Route path="requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFoundPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
