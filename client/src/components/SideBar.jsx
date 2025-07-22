import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import assets from "../assets/assets.js";

const SideBar = () => {
    const { logout, onlineUsers } = useContext(AuthContext);
    const navigate = useNavigate();
    // const { selectedUser, setSelectedUser } = useContext(homeContext);
    const [input, setInput] = useState(false);

    const {
        getUsers,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    } = useContext(ChatContext);

    const filteredUsers = input
        ? users.filter((user) =>
              user.name.toLowerCase().includes(input.toLowerCase())
          )
        : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    return (
        <div
            className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll ${
                selectedUser ? "max-md:hidden" : ""
            }`}
        >
            <div className="pb-0">
                <div className="flex justify-between items-center">
                    <img
                        src={assets.logo}
                        alt="logo"
                        className="max-w-40 cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                    <div className="relative py-2 group">
                        <img
                            src={assets.menu_icon}
                            alt="menu icon"
                            className="max-h-5 cursor-pointer"
                        />
                        <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:flex flex-col">
                            <p
                                onClick={() => navigate("/profile")}
                                className="cursor-pointer text-sm"
                            >
                                Edit Profile
                            </p>
                            <hr className="my-2 border-t border-gray-500" />
                            <p
                                className="cursor-pointer text-sm"
                                onClick={() => logout()}
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                <img
                    src={assets.search_icon}
                    alt="search icon"
                    className="w-3"
                />
                <input
                    onChange={(event) => setInput(event.target.value)}
                    type="text"
                    className="bg-transparent border-none outline-none text-xs placeholder-[#c8c8c8] flex-1 overflow-hidden"
                    placeholder="Search User..."
                />
            </div>

            <div className="flex flex-col">
                {filteredUsers.map((user, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedUser(user);
                            setUnseenMessages((prev) => ({
                                ...prev,
                                [user._id]: 0,
                            }));
                        }}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                            selectedUser?._id === user._id && "bg-[#282142]/50"
                        }`}
                    >
                        <img
                            src={user?.image || assets.avatar_icon}
                            alt="profilePic"
                            className="w-[35px] aspect-[1/1] rounded-full"
                        />
                        <div className="flex flex-col leading-5">
                            <p>{user.name}</p>
                            {onlineUsers.includes(user._id) ? (
                                <span className="onlineColor text-xs">
                                    Online
                                </span>
                            ) : (
                                <span className="offlineText text-xs">
                                    Offline
                                </span>
                            )}
                        </div>
                        {unseenMessages[user._id] > 0 && (
                            <p className="absolute top-4 right-4 text-xs mt-3 h-4 w-4 flex justify-center items-center rounded-full bg-green-500/50">
                                {unseenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBar;
