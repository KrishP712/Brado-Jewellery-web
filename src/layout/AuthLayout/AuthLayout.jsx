import { Outlet } from "react-router-dom";
import useAuthLayoutProvider from "./useAuthLayoutProvider";

const AuthLayout = () => {
    const { } = useAuthLayoutProvider();
    return (
        <div className="flex h-screen">
            <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
                <img src="" alt="" />
            </div>
            <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
                <div className="max-w-2xl w-full p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
};

export default AuthLayout;
