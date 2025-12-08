import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

export default function Logout() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Logging out...");

    useEffect(() => {
        logout();
        setMessage("You have successfully logged out!");
        const timer = setTimeout(() => {
            navigate("/login", { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="alert alert-success shadow text-center" role="alert">
                <h4 className="alert-heading">Goodbye!</h4>
                <p>{message}</p>
                <hr />
                <p className="mb-0">Redirecting to login page...</p>
            </div>
        </div>
    );
}
