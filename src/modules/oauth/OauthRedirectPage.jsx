import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import styles from './OauthRedirectPage.module.css';
import axiosInstance from "@/api/axiosInstance.js";
import {useAuth} from "@/hooks/useAuth.jsx";

function OauthRedirectPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const {platform} = useParams();
    const [message, setMessage] = useState('로그인 중입니다...');
    const [isLoading, setIsLoading] = useState(true);
    const {login} = useAuth();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code && platform) {
            const loginUrl = `/v1/oauth/login/${platform}?code=${code}`;
            axiosInstance.get(loginUrl)
                .then(response => {
                    const accessToken = response.headers['authorization'] || response.headers['Authorization'];
                    if (accessToken) {
                        login(accessToken.replace('Bearer ', ''));
                    } else {
                        throw new Error('토큰이 없습니다.');
                    }
                    return response.data;
                })
                .then(data => {
                    console.log('소셜 로그인 성공:', data);
                    const isNewUser = !data.result;
                    setMessage(isNewUser ? '환영합니다! 추가 정보 입력 페이지로 이동합니다...' : '로그인 성공! 메인 페이지로 이동합니다...');
                    setTimeout(() => isNewUser ? navigate('/init-user-info') : navigate('/'), 1000);
                })
                .catch(error => {
                    console.error('소셜 로그인 오류:', error.response ? error.response.data : error.message);
                    setMessage('로그인에 실패했습니다. 다시 시도해주세요.');
                    setTimeout(() => navigate('/login'), 1000);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setMessage('잘못된 접근입니다. 로그인 페이지로 이동합니다.');
            console.error('인증 코드가 없거나 플랫폼 정보가 없습니다.');
            setTimeout(() => navigate('/login'), 1000);
        }
    }, [location, login, navigate, platform]);

    return (
        <div className={styles.callbackContainer}>
            <h2>소셜 로그인 처리</h2>
            {isLoading && <div className={styles.spinner}></div>}
            <p>{message}</p>
        </div>
    );
}

export default OauthRedirectPage;