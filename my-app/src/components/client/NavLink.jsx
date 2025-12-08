import { Link, useLocation } from 'react-router-dom';

export default function NavLink({ to, children, className = '', ...props }) {
    const location = useLocation();
    const isActive = location.pathname === to || 
                    (to !== '/' && location.pathname.startsWith(to));
    return (
        <Link 
            to={to} 
            className={`${className} ${isActive ? 'mega-title' : ''}`}
            {...props}
        >
            {children}
        </Link>
    );
} 