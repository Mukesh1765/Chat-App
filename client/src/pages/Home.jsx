import { AuthContext } from "../context/AuthContext";
import RightSideBar from "../components/RightSideBar";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Home = () => {
    const { selectedUser } = useContext(ChatContext);
    const { authUser } = useContext(AuthContext);

    return (
        authUser && (
            <div
                className={`backdrop-blur-md border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
                    selectedUser
                        ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
                        : "md:grid-cols-2"
                }`}
            >
                <SideBar />
                <ChatContainer />
                {selectedUser && <RightSideBar />}
            </div>
        )
    );
};

export default Home;
