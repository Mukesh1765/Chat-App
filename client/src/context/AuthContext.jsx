import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get("token") || null);
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        setLoading(true);
        const existingToken = Cookies.get("token");

        if (!existingToken) {
            setAuthUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get("/api/auth/check", {
                headers: { token: existingToken },
            });

            if (data?.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                setAuthUser(null);
                Cookies.remove("token");
                delete axios.defaults.headers.common["token"];
                disconnectSocket();
            }
        } catch (error) {
            setAuthUser(null);
            Cookies.remove("token");
            delete axios.defaults.headers.common["token"];
            toast.error(error.response?.data?.message || error.message);
            disconnectSocket();
        } finally {
            setLoading(false);
        }
    };

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(
                `/api/auth/${state}`,
                credentials
            );

            if (data?.success) {
                setAuthUser(data.userData);
                Cookies.set("token", data.token, { expires: 7 });
                setToken(data.token);
                axios.defaults.headers.common["token"] = data.token;
                connectSocket(data.userData);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["token"];
        disconnectSocket();
        toast.success("Logged Out Successfully");
    };

    const updateProfile = async (body) => {
        try {
            const formData = new FormData();

            for (const key in body) {
                if (body[key] !== null && body[key] !== undefined) {
                    if (body[key] instanceof File) {
                        formData.append(key, body[key], body[key].name);
                    } else {
                        formData.append(key, body[key]);
                    }
                }
            }

            const { data } = await axios.patch(
                "/api/auth/update-profile",
                formData,
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );

            if (data?.noInputReceived) {
                toast.error("No input received to update");
                return Promise.reject(new Error("No input received"));
            }

            if (data?.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
                return Promise.resolve();
            } else {
                toast.error(data.message || "Update failed");
                return Promise.reject(
                    new Error(data.message || "Update failed")
                );
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return Promise.reject(error);
        }
    };

    const connectSocket = (userData) => {
        if (!userData) return;
        if (socketRef.current) {
            if (socketRef.current.connected) return;
            socketRef.current.disconnect();
        }

        socketRef.current = io(backendUrl, {
            auth: { userId: userData._id },
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current.on("connect", () => {
            console.log("Socket connected", socketRef.current.id);
        });

        socketRef.current.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        socketRef.current.on("disconnect", () => {
            setOnlineUsers([]);
        });

        socketRef.current.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
    };

    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setOnlineUsers([]);
        }
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        } else {
            delete axios.defaults.headers.common["token"];
            disconnectSocket();
        }
        checkAuth();

        return () => {
            disconnectSocket();
        };
    }, [token]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket: socketRef.current,
        login,
        logout,
        updateProfile,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
