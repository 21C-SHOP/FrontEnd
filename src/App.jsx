import './App.css'
import Footer from "@/components/Footer.jsx";
import Header from "@/components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "@/modules/login/LoginPage.jsx";
import SignupPage from "@/modules/signup/SignupPage.jsx";
import UserInfoPage from "@/modules/user-info/UserInfoPage.jsx";
import OauthRedirectPage from "@/modules/oauth/OauthRedirectPage.jsx";
import {useAuth} from "@/hooks/useAuth.jsx";
import {useEffect, useState} from "react";
import axiosInstance from "@/api/axiosInstance.js";

function App() {
    const { accessToken, login } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // --- 👇 앱 로드 시 자동 로그인(토큰 재발급) 시도 ---
    useEffect(() => {
        const tryAutoLogin = async () => {
            if (accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                console.log("자동 재발급 시도...");
                const response = await axiosInstance.get('/v1/reissue');
                console.log(response)
                const newAccessToken = response.headers['authorization']?.replace('Bearer ', '');
                if (newAccessToken) {
                    login(newAccessToken);
                    console.log("자동 재발급 성공!");
                } else {
                    console.log("자동 재발급 응답에 토큰 없음 (로그아웃 상태)");
                }
            } catch (error) {
                console.error("자동 재발급 실패:", error.response ? error.response.data : error.message);
            } finally {
                setIsLoading(false); // 로딩 완료
            }
        };

        tryAutoLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Header/>
            <main className="content">
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h2>Welcome to the Main Page!</h2>
                            <p>Your page content goes here.</p>
                        </div>
                    }/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/user-info" element={<UserInfoPage/>}/>
                    <Route path="/redirect/:platform" element={<OauthRedirectPage/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
