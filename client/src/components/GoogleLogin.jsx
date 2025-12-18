import React, { useState } from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helper/firebase";
import { showToast } from "@/helper/showToast";
import { useNavigate } from "react-router-dom";
import { RouteIndex } from "@/helper/RouteName";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";


const GoogleLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse?.user;
      if (!user) {
        showToast("error", "Google login failed");
        setLoading(false);
        return;
      }

      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };

      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const url = `${base.replace(/\/$/, "")}/auth/google-login`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast("error", data?.message || "Login failed");
        setLoading(false);
        return;
      }
      dispatch(setUser(data.user))

      showToast("success", data?.message || "Login successful");
      navigate(RouteIndex, { replace: true });
    } catch (err) {
      // handle common firebase popup errors gracefully
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        showToast("info", "Popup closed — sign-in cancelled");
      } else {
        console.error("Google sign-in error:", err);
        showToast("error", "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleLogin} disabled={loading} className="flex items-center gap-2">
      <FcGoogle />
      {loading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleLogin;
