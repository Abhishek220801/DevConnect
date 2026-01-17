import { useSelector } from "react-redux"
import { Navigate } from "react-router";

const ProtectedRoute = ({children}) => {
    const {data: user, loaded} = useSelector((store) => store.user);
    if(!loaded) return null;
    if(!user) return <Navigate to='/login' replace/>
    return children;
}

export default ProtectedRoute;