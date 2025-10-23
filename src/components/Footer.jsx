import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            {/* 푸터 내용은 보통 더 복잡합니다. (회사 정보, 약관 등)
        지금은 업로드하신 이미지 하단의 저작권 고지만 간단히 넣었습니다.
      */}
            <p>&copy; {new Date().getFullYear()} 21C. All rights reserved.</p>
            <p>Business License: 123-45-67890 | E-Commerce Permit</p>
        </footer>
    );
}

export default Footer;