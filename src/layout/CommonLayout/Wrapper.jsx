import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
import SubHeader from "./header/SubHeader";

const Wrapper = () => {
    return (
        <div>
            <Header />
            <SubHeader />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
};

export default Wrapper;
