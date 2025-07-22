import { useContext, useEffect, useRef, useState } from "react";
import { formatMessageTime } from "../library/utils.js";
import assets from "../assets/assets.js";
import { ChatContext } from "../context/ChatContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {
    const {
        messages,
        selectedUser,
        setSelectedUser,
        sendMessage,
        getMessages,
    } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);
    const scrollEnd = useRef();
    const [input, setInput] = useState("");

    const handleSendMessage = async (event) => {
        try {
            event.preventDefault();
            const trimmedInput = input.trim();
            if (trimmedInput === "") return null;
            await sendMessage({ text: trimmedInput });
            setInput("");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSendImage = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file || !file.type.startsWith("image/")) {
                toast.error("select an image file");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                await sendMessage({ image: reader.result });
                event.target.value = "";
            };

            reader.readAsDataURL(file);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    return selectedUser ? (
        <div className="h-full overflow-auto relative backdrop-blur-lg">
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img
                    src={selectedUser.image || assets.avatar_icon}
                    alt="profilePic"
                    className="w-8 rounded-full"
                />
                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    {selectedUser.name}
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                </p>
                <img
                    src={assets.arrow_icon}
                    className="md:hidden max-w-7"
                    onClick={() => setSelectedUser(null)}
                />
                <img src={assets.help_icon} className="max-md:hidden max-w-5" />
            </div>

            <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 justify-end ${
                            message.senderId !== authUser._id &&
                            "flex-row-reverse"
                        }`}
                    >
                        {message.image ? (
                            <img
                                src={message.image}
                                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                            />
                        ) : (
                            <p
                                className={`p-2 max-w-[200px]: md:text-sm font-light rounded-lg mb-8 break-all bg-blue-600/30 ${
                                    message.senderId === authUser._id
                                        ? "rounded-br-none"
                                        : "rounded-bl-none"
                                }`}
                            >
                                {message.text}
                            </p>
                        )}
                        <div className="text-center text-xs">
                            <img
                                src={
                                    message.senderId === authUser._id
                                        ? authUser?.image || assets.avatar_icon
                                        : selectedUser?.image ||
                                          assets.avatar_icon
                                }
                                className="w-7 rounded-full"
                            />
                            <p className="text-gray-500">
                                {formatMessageTime(message.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
                    <input
                        type="text"
                        placeholder="Send a message"
                        value={input}
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none placeholder-grey-100"
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) =>
                            event.key === "Enter"
                                ? handleSendMessage(event)
                                : null
                        }
                    />
                    <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        onChange={handleSendImage}
                        hidden
                    />
                    <label htmlFor="image">
                        <img
                            src={assets.gallery_icon}
                            alt=""
                            className="w-5 mr-2 cursor-pointer"
                        />
                    </label>
                </div>
                <img
                    src={assets.send_button}
                    alt=""
                    className="w-7 cursor-pointer"
                    onClick={handleSendMessage}
                />
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
            <img src={assets.logo_icon} className="max-w-16" />
            <p className="text-lg font-medium">Chat anytime, anywhere</p>
        </div>
    );
};

export default ChatContainer;
