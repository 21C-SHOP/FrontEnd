import React, {useState} from 'react';
import styles from './LoginPage.module.css';
import kakaoIcon from '../../assets/kakao.png';
import naverIcon from '../../assets/naver.png';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login attempt:', {email, password});
    };

    const handleSocialLogin = (platform) => {
        console.log(`Social login with: ${platform}`);
    }

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>로그인</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="아이디"
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
                <button type="submit" className={`${styles.btn} ${styles.btnLogin}`}>
                    로그인
                </button>
            </form>
            <div className={styles.socialLogin}>
                <div className={styles.socialButtonWrapper} onClick={() => handleSocialLogin('kakao')}>
                    <img src={kakaoIcon} alt="카카오 로그인" className={styles.socialIcon}/>
                </div>
                <div className={styles.socialButtonWrapper} onClick={() => handleSocialLogin('naver')}>
                    <img src={naverIcon} alt="네이버 로그인" className={styles.socialIcon}/>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;