import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/client/auth/ForgotPassword.jsx";
import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const handleSendEmail = async (email) => {
        // Normalize email trước khi gửi và lưu state
        const normalizedEmail = email?.trim().toLowerCase();
        await forgotPassword(normalizedEmail);
        navigate("/verify-otp", { state: { email: normalizedEmail } });
    };

    return (
        <ForgotPassword
            onSendEmail={handleSendEmail}
            cooldownSec={60}
            maxResends={3}
        />
    );
}
