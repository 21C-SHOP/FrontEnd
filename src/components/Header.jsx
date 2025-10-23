import React from 'react';
import styles from './Header.module.css';
import userIcon from '../assets/user.png';
import searchIcon from '../assets/search.png';
import cartIcon from '../assets/cart.png';

function Header() {
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
                <a href="/login">로그인</a>
                <a href="/search">
                    <img src={searchIcon} alt="검색" width={24} height={24}/>
                </a>
                <a href="/signup">
                    <img src={userIcon} alt="회원가입" width={24} height={24}/>
                </a>
                <a href="/cart">
                    <img src={cartIcon} alt="장바구니" width={24} height={24}/>
                </a>
            </div>
        </header>
    );
}

export default Header;