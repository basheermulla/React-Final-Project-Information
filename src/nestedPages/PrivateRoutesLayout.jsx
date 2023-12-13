import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function PrivateRoutesLayoutComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const location = useLocation();

    return userLogin ? (<Outlet />) : (
        <Navigate to='/login' state={{ from: location }} replace />
    )
}

export default PrivateRoutesLayoutComp