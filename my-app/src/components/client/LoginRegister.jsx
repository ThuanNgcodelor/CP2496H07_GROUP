import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {getUserRole, isAuthenticated, login, register} from "../../api/auth.js";
import {checkEmailExists} from "../../api/user.js";
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "../../config/config.js";
import Loading from "./Loading.jsx";

export default function Auth(){
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = () => {
        const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
        });

        window.location.href = `${googleAuthUrl}?${params.toString()}`;
    };

    useEffect(() => {
        if (isAuthenticated()) {
            const roles = getUserRole();
            if (Array.isArray(roles)) {
                if (roles.includes("ROLE_ADMIN")) {
                    navigate("/admin");
                } else if (roles.includes("ROLE_SHOP_OWNER")) {
                    navigate("/shop-owner");
                } else if (roles.includes("ROLE_USER")) {
                    navigate("/information");
                }
            }
        }
    }, [from, navigate]);

    // Check if we're on login or register page
    useEffect(() => {
        const path = location.pathname;
        setIsLogin(path === '/login' || path === '/auth');
    }, [location.pathname]);

    const handleLogin = async (e) => {
        setLoginData({
            ...loginData,
            [e.target.name] : e.target.value,
        });
    };

    const handleRegister = async (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name] : e.target.value,
        });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if(loginData.email === '' || loginData.password === ''){
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            await login(loginData);
            const role = getUserRole();
            const roles = Array.isArray(role) ? role : [role].filter(Boolean);

            if(roles.includes("ROLE_ADMIN") || roles.includes("ROLE_DESIGNER")) {
                navigate("/admin");
            } else if (roles.includes("ROLE_USER")) {
                navigate("/information");
            }

        } catch(error){
            setError(error.response?.data?.message || "Login failed. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (registerData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const exists = await checkEmailExists(registerData.email);
            if (exists) {
            setError("Email already exists. Please use a different email.");
            setLoading(false);
            return;
            }

            await register(registerData);
            setSuccess("Registration successful! You can now login.");
            setRegisterData({ username: "", email: "", password: "", confirmPassword: "" });
            setFieldErrors({});
        } catch (err) {
            const responseData = err?.response?.data;
            
            if (responseData && typeof responseData === 'object' && 
                !responseData.message && !responseData.error && 
                (responseData.username || responseData.email || responseData.password || responseData._general)) {
                const newFieldErrors = {
                    username: responseData.username || '',
                    email: responseData.email || '',
                    password: responseData.password || ''
                };
                
                if (responseData._general) {
                    setError(responseData._general);
                }
                
                setFieldErrors(newFieldErrors);
                
                const errorMessages = Object.entries(responseData)
                    .filter(([key, value]) => key !== '_general' && value)
                    .map(([, value]) => value);
                    
                if (errorMessages.length > 0 && !responseData._general) {
                    setError(errorMessages.join('. '));
                }
            } else {
                const apiMsg = responseData?.message || responseData?.error || responseData?.detail || err?.message;
                setError(apiMsg || "Registration error. Please check your information.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b6b 100%)',
            padding: '40px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row justify-content-center">
                    {/* Left Side - Simple Promotional Banner */}
                    <div className="col-12 col-lg-6 d-none d-lg-block">
                        <div style={{
                            height: '100%',
                            minHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            textAlign: 'center',
                            padding: '40px'
                        }}>
                            <div style={{
                                fontSize: 'clamp(60px, 10vw, 120px)',
                                fontWeight: 700,
                                lineHeight: 1,
                                marginBottom: '20px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                12+12
                            </div>
                            
                            <div style={{
                                fontSize: 'clamp(24px, 4vw, 36px)',
                                fontWeight: 600,
                                marginBottom: '30px',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                            }}>
                                SUPER BIRTHDAY SALE
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                width: '100%',
                                maxWidth: '300px',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    VOUCHER XTRA<br />
                                    <strong>UP TO 12M VND OFF</strong>
                                </div>
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    Shopee VIP<br />
                                    <strong>UP TO 20% OFF</strong>
                                </div>
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    <strong>FREE SHIPPING</strong>
                            </div>
                        </div>
                            
                            <div style={{
                                fontSize: '14px',
                                opacity: 0.9,
                                marginTop: '20px'
                            }}>
                                Dec 2 - Dec 13
                        </div>
                    </div>
                </div>

                    {/* Right Side - Login/Register Form */}
                    <div className="col-12 col-lg-6">
                        <div style={{
                            background: 'white',
                            borderRadius: '4px',
                            padding: 'clamp(30px, 5vw, 40px)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            maxWidth: '400px',
                            margin: '0 auto',
                            width: '100%'
                        }}>
                    {error && (
                                <div style={{
                                    background: "#ffebee",
                                    color: "#c62828",
                                    padding: "12px",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    border: "1px solid #ffcdd2",
                                    fontSize: '14px'
                                }}>
                                    {error}
                        </div>
                    )}

                    {success && (
                                <div style={{
                                    background: "#e8f5e8",
                                    color: "#2e7d32",
                                    padding: "12px",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    border: "1px solid #c8e6c9",
                                    fontSize: '14px'
                                }}>
                                    {success}
                                </div>
                            )}

                            {loading && (
                                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <Loading />
                        </div>
                    )}

                            {isLogin ? (
                                <>
                                    <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '30px', color: '#222', textAlign: 'center' }}>
                                        Sign In
                                    </h2>
                                    
                                    <form onSubmit={handleLoginSubmit}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <input
                                                type="text"
                                                   name="email"
                                                   value={loginData.email}
                                                   onChange={handleLogin}
                                                placeholder="Email/Phone/Username"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        
                                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                   name="password"
                                                   value={loginData.password}
                                                   onChange={handleLogin}
                                                   placeholder="Password"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 40px 12px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#999',
                                                    padding: '4px'
                                                }}
                                            >
                                                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                            </div>
                                        
                                        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                                            <Link
                                                to="/forgot"
                                                style={{
                                                    color: '#ee4d2d',
                                                    textDecoration: 'none',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: loading ? '#ccc' : '#ee4d2d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                marginBottom: '20px',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            SIGN IN
                                            </button>
                                        
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '20px',
                                            gap: '12px'
                                        }}>
                                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                            <span style={{ color: '#999', fontSize: '12px' }}>OR</span>
                                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                        </div>
                                        
                                            <button
                                                type="button"
                                            onClick={handleGoogleLogin}
                                                style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '2px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '14px',
                                                marginBottom: '20px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#ee4d2d';
                                                e.currentTarget.style.background = '#fff5f0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#ddd';
                                                e.currentTarget.style.background = 'white';
                                            }}
                                            >
                                                <img
                                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                    alt="Google"
                                                style={{ width: 20, height: 20 }}
                                                />
                                            Google
                                            </button>

                                        <div style={{ textAlign: 'center', fontSize: '14px', color: '#222' }}>
                                            New to Shopee?{' '}
                                            <Link to="/register" style={{ color: '#ee4d2d', textDecoration: 'none' }}>
                                                Sign Up
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '30px', color: '#222', textAlign: 'center' }}>
                                        Sign Up
                                    </h2>
                                    
                                    <form onSubmit={handleRegisterSubmit}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <input
                                                type="text"
                                                   name="username"
                                                   value={registerData.username}
                                                onChange={handleRegister}
                                                   placeholder="Username"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: fieldErrors.username ? '1px solid #c62828' : '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {fieldErrors.username && (
                                                <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>
                                                    {fieldErrors.username}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div style={{ marginBottom: '20px' }}>
                                            <input
                                                type="email"
                                                   name="email"
                                                   value={registerData.email}
                                                   onChange={handleRegister}
                                                placeholder="Email"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: fieldErrors.email ? '1px solid #c62828' : '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {fieldErrors.email && (
                                                <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>
                                                    {fieldErrors.email}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div style={{ marginBottom: '20px' }}>
                                            <input
                                                type="password"
                                                   name="password"
                                                   value={registerData.password}
                                                onChange={handleRegister}
                                                   placeholder="Password"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: fieldErrors.password ? '1px solid #c62828' : '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {fieldErrors.password && (
                                                <div style={{ color: '#c62828', fontSize: '12px', marginTop: '4px' }}>
                                                    {fieldErrors.password}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <input
                                                type="password"
                                                   name="confirmPassword"
                                                   value={registerData.confirmPassword}
                                                onChange={handleRegister}
                                                   placeholder="Confirm Password"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '2px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: loading ? '#ccc' : '#ee4d2d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                marginBottom: '20px',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            REGISTER
                                        </button>
                                        
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '20px',
                                            gap: '12px'
                                        }}>
                                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                            <span style={{ color: '#999', fontSize: '12px' }}>OR</span>
                                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                        </div>
                                        
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '2px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '14px',
                                                marginBottom: '20px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#ee4d2d';
                                                e.currentTarget.style.background = '#fff5f0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#ddd';
                                                e.currentTarget.style.background = 'white';
                                            }}
                                        >
                                            <img
                                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                alt="Google"
                                                style={{ width: 20, height: 20 }}
                                            />
                                            Google
                                            </button>
                                        
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                                            By registering, you agree to Shopee's{' '}
                                            <Link to="#" style={{ color: '#ee4d2d' }}>Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link to="#" style={{ color: '#ee4d2d' }}>Privacy Policy</Link>
                                        </div>
                                        
                                        <div style={{ textAlign: 'center', fontSize: '14px', color: '#222' }}>
                                            Already have an account?{' '}
                                            <Link to="/login" style={{ color: '#ee4d2d', textDecoration: 'none' }}>
                                                Sign In
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
}
