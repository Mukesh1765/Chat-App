import { useEffect, useRef, useState, useContext } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { updateProfile, authUser } = useContext(AuthContext);
    const data = useActionData();
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        const updateAndNavigate = async () => {
            if (data?.success && authUser) {
                setLoadingUpdate(true);
                const credentials = data?.credentials || null;
                await updateProfile(credentials);
                setLoadingUpdate(false);
                navigate("/");
            }
        };

        updateAndNavigate();
    }, [data]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            imageRef.current = file;
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <>
            {loadingUpdate && (
                <div className="loading-spinner">
                    <h1>Updating profile...</h1>
                </div>
            )}
            <div className="min-h-full bg-cover bg-no-repeat flex items-center justify-center">
                <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-[900px]:flex-col-reverse rounded-lg">
                    <Form
                        className="flex flex-col gap-5 p-10 flex-1"
                        method="post"
                        encType="multipart/form-data"
                    >
                        <h3 className="text-lg">Profile Details</h3>

                        <label
                            htmlFor="avatar"
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="file"
                                name="image"
                                id="avatar"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleFileChange}
                            />
                            <img
                                src={previewUrl || assets.avatar_icon}
                                className={`w-12 h-12 ${
                                    previewUrl ? "rounded-full" : ""
                                }`}
                            />
                            Upload Profile Image
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Your Name"
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />

                        <textarea
                            name="bio"
                            id="bio"
                            placeholder="Write Profile Bio"
                            rows={4}
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
                        >
                            Save
                        </button>
                    </Form>

                    <img
                        src={authUser?.image || assets.logo_icon}
                        className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 max-[900px]:w-20"
                    />
                </div>
            </div>
        </>
    );
};

export default Profile;
