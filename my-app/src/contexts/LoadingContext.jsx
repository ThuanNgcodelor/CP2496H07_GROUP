import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);

    const showLoading = () => {
        setLoadingCount((prev) => prev + 1);
        setIsLoading(true);
    };

    const hideLoading = () => {
        setLoadingCount((prev) => {
            const newCount = Math.max(0, prev - 1);
            if (newCount === 0) {
                setIsLoading(false);
            }
            return newCount;
        });
    };

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        backdropFilter: 'blur(3px)'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        {/* Three Dot Spinner */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: '#ff6b6b',
                                        animation: `bounce 1.4s infinite ease-in-out both`,
                                        animationDelay: `${i * 0.16}s`
                                    }}
                                />
                            ))}
                        </div>
                        <style>
                            {`
                @keyframes bounce {
                  0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                  }
                  40% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }
              `}
                        </style>
                        <p style={{ marginTop: '16px', color: '#666', fontSize: '14px', fontWeight: 500 }}>
                            Đang tải...
                        </p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};
