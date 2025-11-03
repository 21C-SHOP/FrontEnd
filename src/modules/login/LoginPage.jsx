import React, {useState} from 'react';
import styles from './LoginPage.module.css';
import kakaoIcon from '../../assets/kakao.png';
import naverIcon from '../../assets/naver.png';
import googleIcon from '../../assets/google.png';
import axiosInstance from "@/api/axiosInstance.js";
import {useAuth} from "@/hooks/useAuth.jsx";
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const loginDto = {
            email: email,
            password: password
        }
        axiosInstance.post('/v1/users/login', loginDto)
            .then(response => {
                const accessToken = response.headers['authorization'] || response.headers['Authorization'];
                if (accessToken) {
                    login(accessToken.replace('Bearer ', ''));
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    throw new Error('토큰이 없습니다.');
                }
            })
            .catch(error => {
                console.error('Login failed:', error);
                alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSocialLogin = (platform) => {
        console.log(`Social login with: ${platform}`);
        window.location.href = `http://localhost:8080/v1/oauth/${platform}`;
    }

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>로그인</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.links}>
                    <a href="/signup">회원가입</a> | <a href="/find-id">아이디 찾기</a> | <a href="/find-password">비밀번호 찾기</a>
                </div>
                <button type="submit" className={`${styles.btn} ${styles.btnLogin}`} disabled={isLoading}>
                    {isLoading ? <div className={styles.spinner}></div> : '로그인'}
                </button>
            </form>
            <div className={styles.socialLogin}>
                <div className={styles.socialButtonWrapper} onClick={() => handleSocialLogin('kakao')}>
                    <img src={kakaoIcon} alt="카카오 로그인" className={styles.socialIcon}/>
                </div>
                <div className={styles.socialButtonWrapper} onClick={() => handleSocialLogin('naver')}>
                    <img src={naverIcon} alt="네이버 로그인" className={styles.socialIcon}/>
                </div>
                <div className={styles.socialButtonWrapper} onClick={() => handleSocialLogin('google')}>
                    <img src={googleIcon} alt="구글 로그인" className={styles.socialIcon}/>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;