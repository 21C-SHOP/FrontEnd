import React, {useCallback, useEffect, useMemo, useState} from 'react';
import axiosInstance, {setupInterceptors} from '../api/axiosInstance';
import {AuthContext} from './AuthContextDefinition';
import {useNavigate} from "react-router-dom";

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const login = useCallback((token) => {
        setAccessToken(token);
        setIsLoggedIn(true);
        console.log("AuthContext: 토큰 저장됨");
    }, []);

    const logout = useCallback(async () => {
        setAccessToken(null);
        setIsLoggedIn(false);
        console.log("AuthContext: 토큰 삭제됨 (로그아웃)");
        const baseUrl = `/v1/users/logout`
        try {
            const response = await axiosInstance.post(baseUrl);
            console.log("백엔드 로그아웃 성공:", response.data);
            navigate('/');
        } catch (error) {
            console.error("백엔드 로그아웃 오류:", error.response ? error.response.data : error.message);
            navigate('/');
        }
    }, [navigate]);

    const authContextValueForInterceptor = useMemo(() => ({
        getAccessToken: () => accessToken,
        isLoggedIn,
        login,
        logout,
    }), [accessToken, isLoggedIn, login, logout]);

    useEffect(() => {
        setupInterceptors(authContextValueForInterceptor);
    }, [authContextValueForInterceptor]);

    const value = {accessToken, isLoggedIn, login, logout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};