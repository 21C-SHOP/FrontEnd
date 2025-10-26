import React from 'react';
import styles from './Header.module.css';
import userIcon from '../assets/user.png';
import searchIcon from '../assets/search.png';
import cartIcon from '../assets/cart.png';
import {useAuth} from "@/hooks/useAuth.jsx";
import {useNavigate} from "react-router-dom";

function Header() {
    const {isLoggedIn, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const handleLogin = (e) => {
        e.preventDefault(); // a 태그 기본 동작 방지
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <a href="/">21C 안경 콘택트 프라자</a>
            </div>
            <nav className={styles.nav}>
                <a href="/new">NEW</a>
                <a href="/best">BEST</a>
                <a href="/sunglasses">SUNGLASSES</a>
                <a href="/glasses">GLASSES</a>
                <a href="/lens">LENS</a>
            </nav>
            <div className={styles.userMenu}>
                {isLoggedIn ? (
                    <a href="/" onClick={handleLogout} >로그아웃</a>
                ) : (
                    <a href="/login" onClick={handleLogin} >로그인</a>
                )}
                <a href="/search">
                    <img src={searchIcon} alt="검색" width={24} height={24}/>
                </a>
                {isLoggedIn ? (
                    <a href="/mypage">
                        <img src={userIcon} alt="마이페이지" width={24} height={24}/>
                    </a>
                ) : (
                    <a href="/login" onClick={handleLogin}>
                        <img src={userIcon} alt="마이페이지" width={24} height={24}/>
                    </a>
                )}
                {isLoggedIn ? (
                    <a href="/cart">
                        <img src={cartIcon} alt="장바구니" width={24} height={24}/>
                    </a>
                ) : (
                    <a href="/login" onClick={handleLogin}>
                        <img src={cartIcon} alt="장바구니" width={24} height={24}/>
                    </a>
                )}
            </div>
        </header>
    );
}

export default Header;