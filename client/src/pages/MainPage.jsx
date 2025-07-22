import assets from "../assets/assets.js";
import "../App.css";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const MainPage = () => {
    return (
        <div
            className="w-screen h-screen bg-cover bg-center sm:px-[15%] sm:py-[5%]"
            style={{ backgroundImage: `url(${assets.bgImage2})` }}
        >
            <header></header>
            <Toaster />
            <Outlet />
            <footer></footer>
        </div>
    );
};

export default MainPage;
