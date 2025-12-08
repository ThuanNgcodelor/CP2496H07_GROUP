import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../../api/auth.js";

export default function ProtectedRoute({ allowedRoles, children }) {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const roleOrRoles = getUserRole();
    const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles].filter(Boolean);

    const hasAccess = roles.some((r) => allowedRoles.includes(r));
    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }

    return children;
}


