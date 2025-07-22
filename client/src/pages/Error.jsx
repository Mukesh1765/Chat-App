import { useNavigate, useRouteError } from "react-router-dom";
import "../App.css";

const Error = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-gradient-to-tr from-stone-800 via-red-700 to-red-900 flex items-center justify-center px-4">
            <div className="triangle bg-yellow-400 border-4 border-yellow-600 animate-bounce-in">
                <div className="flex flex-col items-center justify-center text-center px-4 py-6 space-y-3">
                    <div className="text-6xl font-extrabold alertColor animate-pulse">
                        !
                    </div>
                    <h2 className="text-lg font-semibold alertColor leading-snug">
                        Error {error.status}
                    </h2>
                    <h2 className="text-lg font-semibold alertColor leading-snug">
                        Page Not Found
                    </h2>
                    <button
                        className="px-4 py-1.5 bg-yellow-700 hover:bg-yellow-800 text-white text-sm font-medium rounded-full shadow transition-all duration-300 hover:scale-105"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                    <h4>
                        You have entered to a page that doesnot exist, goto home
                        by clicking home
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default Error;
