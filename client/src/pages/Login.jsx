import { useEffect, useState, useContext } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
    const data = useActionData();
    const navigate = useNavigate();
    const { authUser, login, loading } = useContext(AuthContext);
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [mode, setMode] = useState("signup"); // 'signup' or 'login'
    const [step, setStep] = useState(0); // 0: start, 1: next step
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
    });

    useEffect(() => {
        if (
            data?.success &&
            !authUser &&
            agreed &&
            ((mode === "signup" && step === 1) || mode === "login")
        ) {
            login(mode, data.credentials || null);
        }
    }, [data, mode, login]);

    useEffect(() => {
        if (authUser && !loading) {
            navigate("/");
        }
    }, [authUser, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const switchMode = () => {
        setMode((prev) => (prev === "signup" ? "login" : "signup"));
        setStep(0);
        setFormData({ name: "", email: "", password: "", bio: "" });
        setAgreed(false);
        setShowPassword(false);
    };

    const issignup = mode === "signup";
    const isNextStep = step === 1;

    return (
        <div className="border-2 border-gray-500 rounded-2xl h-full bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-[760px]:flex-col backdrop-blur-2xl">
            <img src={assets.logo_big} className="w-50 max-[800px]:w-20" />

            <Form
                method="post"
                className="border-5 bg-white/8 text-white border-transparent p-3 flex flex-col gap-3 rounded-lg shadow-lg"
                onSubmit={(e) => {
                    if (issignup && !isNextStep) {
                        e.preventDefault(); // Prevent submission on step 0
                        setStep(1);
                    } else if (!agreed) {
                        e.preventDefault(); // Block submit without agreement
                        toast.error(
                            "Please agree to terms and conditions before continuing."
                        );
                    }
                }}
            >
                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {mode}
                    {issignup && isNextStep && (
                        <img
                            src={assets.arrow_icon}
                            className="w-5 cursor-pointer"
                            onClick={() => setStep(0)}
                        />
                    )}
                </h2>

                {/* Step 0: name, email, password */}
                {issignup && !isNextStep && (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="p-2 border border-gray-500 rounded-md focus:outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="p-2 border border-gray-500 rounded-md w-full pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                                )}
                            </button>
                        </div>
                    </>
                )}

                {/* Step 1: bio */}
                {issignup && isNextStep && (
                    <>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Provide a short bio..."
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        ></textarea>

                        {/* Hidden fields */}
                        {["name", "email", "password"].map((key) => (
                            <input
                                type="hidden"
                                key={key}
                                name={key}
                                value={formData[key]}
                            />
                        ))}
                    </>
                )}

                {/* Login Mode */}
                {mode === "login" && (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="p-2 border border-gray-500 rounded-md w-full pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                                )}
                            </button>
                        </div>
                    </>
                )}

                {/* Action Button */}
                <button
                    type="submit"
                    className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer flex items-center justify-center text-xl"
                >
                    {issignup
                        ? isNextStep
                            ? "Create Account"
                            : "Next"
                        : "Login Now"}
                </button>

                {(isNextStep || mode === "login") && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <p>Agree to the terms of use & privacy policy.</p>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">
                        {mode === "signup"
                            ? "Already have an account? "
                            : "Create an account "}
                        <span
                            className="font-medium text-violet-500 cursor-pointer"
                            onClick={switchMode}
                        >
                            {mode === "signup" ? "Login here" : "Click here"}
                        </span>
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default Login;
