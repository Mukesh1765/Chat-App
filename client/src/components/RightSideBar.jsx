import { useContext } from "react";
import assets from "../assets/assets.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";

const RightSideBar = () => {
    const { logout, onlineUsers } = useContext(AuthContext);
    const { selectedUser, messages } = useContext(ChatContext);

    return (
        selectedUser && (
            <div
                className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
                    selectedUser ? "max-md:hidden" : ""
                }`}
            >
                <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
                    <img
                        src={selectedUser?.image || assets.avatar_icon}
                        className="w-20 aspect-[1/1] rounded-full"
                    />
                    <h3 className="px-1 text-xl font-medium mx-auto flex items-center gap-0">
                        {onlineUsers.includes(selectedUser._id) && (
                            <p className="w-2 h-2 rounded-full bg-green-500"></p>
                        )}
                        {selectedUser.name}
                    </h3>
                    <p className="px-10 mx-auto">{selectedUser.bio}</p>
                </div>

                <hr className="border-[#ffffff50] my-4" />

                <div className="px-5 text-xs">
                    <p>Media</p>
                    <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                        {messages
                            .filter((message) => message?.image !== null)
                            .map((message, index) => (
                                <div
                                    key={index}
                                    onClick={() => window.open(message.image)}
                                    className="cursor-pointer rounded"
                                >
                                    <img
                                        src={message.image}
                                        className="h-full rounded-md"
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                <button
                    className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
                    onClick={() => logout()}
                >
                    Logout
                </button>
            </div>
        )
    );
};

export default RightSideBar;
