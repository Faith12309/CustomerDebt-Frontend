import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {

        if (!username || !password) {
            alert("Please enter username and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post("/Auth/login", {
                username,
                password
            });

            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            console.log("Saved Token:", localStorage.getItem("token"));

            navigate("/dashboard");

        }
        catch (error) {

            console.log(error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Unable to connect to the server.");
            }

        }
        finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-xl rounded-xl w-96 p-8">

                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Customer Debt Management
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Sign in to continue
                </p>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-2 rounded-lg text-white transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

            </div>

        </div>
    );
}

export default Login;