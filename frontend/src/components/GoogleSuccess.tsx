import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const GoogleAuthSuccess = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get("token");
  const { fetchUser, setAuthToken } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (token) {
        // Put token into localStorage via context (interceptor reads it)
        setAuthToken(token);

        // Ensure user is fetched with header attached by interceptor
        await fetchUser();

        // Optional: hold the loading screen for ~5s
        setTimeout(() => navigate("/browse"), 5000);
      } else {
        setTimeout(() => navigate("/login"), 5000);
      }
    };
    run();
  }, [token, fetchUser, navigate, setAuthToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
      <svg
        className="animate-spin h-16 w-16 mb-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <h1 className="text-2xl font-semibold mb-2">
        {token ? "Signing you in..." : "Redirecting..."}
      </h1>
      <p className="text-center max-w-xs">
        Please wait while we log you into your account. If you are not
        redirected shortly, click{" "}
        <button
          className="underline hover:text-gray-200"
          onClick={() => (token ? navigate("/browse") : navigate("/login"))}
        >
          here
        </button>
        .
      </p>
    </div>
  );
};

export default GoogleAuthSuccess;
