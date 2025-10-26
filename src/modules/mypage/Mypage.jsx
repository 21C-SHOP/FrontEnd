import React from 'react';
import styles from './MyPage.module.css';
import userIcon from '../../assets/mypage-user.png';
import pointIcon from '../../assets/mypage-point.png';
import couponIcon from '../../assets/mypage-coupon.png';
import orderIcon from '../../assets/mypage-order.png';
import reviewIcon from '../../assets/mypage-review.png';
import inquiryIcon from '../../assets/mypage-inquiry.png';
import infoIcon from '../../assets/mypage-info.png';
import deleteIcon from '../../assets/mypage-delete.png';
import {useNavigate} from "react-router-dom";

// 임시 데이터 (나중에 API로 받아옴)
const userData = {
    level: '일반회원',
    points: 5500,
    coupons: 2,
    pendingOrders: 1, // 주문 준비 중
};

const orderStatus = {
    paymentComplete: 1, // 주문 완료
    preparingDelivery: 0, // 배송 준비 중
    shipping: 0, // 배송 중
    deliveryComplete: 1, // 배송 완료
    returns: 1, // 반품
    refunds: 1, // 환불
};

const userActivity = {
    reviews: 12,
    inquiries: 4,
};

function MyPage() {

    const navigate = useNavigate();

    return (
        <div className={styles.myPageContainer}>
            <section className={styles.summarySection}>
                <div className={styles.summaryBox}>
                    <img src={userIcon} alt="회원등급" className={styles.icon}/>
                    <span className={styles.label}>회원등급</span>
                    <span className={styles.value}>{userData.level}</span>
                </div>
                <div className={styles.summaryBox}>
                    <img src={pointIcon} alt="적립금" className={styles.icon}/>
                    <span className={styles.label}>적립금</span>
                    <span className={styles.value}>₩{userData.points.toLocaleString()}</span>
                </div>
                <div className={styles.summaryBox}>
                    <img src={couponIcon} alt="쿠폰" className={styles.icon}/>
                    <span className={styles.label}>쿠폰</span>
                    <span className={styles.value}>{userData.coupons}개</span>
                </div>
                <div className={styles.summaryBox}>
                    <img src={orderIcon} alt="주문" className={styles.icon}/>
                    <span className={styles.label}>주문</span>
                    <span className={styles.value}>{userData.pendingOrders}건</span>
                </div>
            </section>

            <section className={styles.orderSection}>
                <h3 className={`${styles.sectionTitle} ${styles.firstRow}`}>주문 내역</h3>
                <div className={styles.orderStatusGrid}>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.paymentComplete}</span>
                        <span className={styles.orderLabel}>주문 완료</span>
                    </div>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.preparingDelivery}</span>
                        <span className={styles.orderLabel}>배송 준비 중</span>
                    </div>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.shipping}</span>
                        <span className={styles.orderLabel}>배송 중</span>
                    </div>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.deliveryComplete}</span>
                        <span className={styles.orderLabel}>배송 완료</span>
                    </div>
                </div>
                <div className={`${styles.orderStatusGrid} ${styles.secondRow}`}>
                    <div className={styles.orderStatusBox}></div>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.returns}</span>
                        <span className={styles.orderLabel}>반품</span>
                    </div>
                    <div className={styles.orderStatusBox}>
                        <span className={styles.orderCount}>{orderStatus.refunds}</span>
                        <span className={styles.orderLabel}>환불</span>
                    </div>
                    <div className={styles.orderStatusBox}></div>
                </div>
            </section>

            <section className={styles.actionSection}>
                <div className={styles.actionBox}>
                    <img src={reviewIcon} alt="리뷰" className={styles.icon}/>
                    <span className={styles.label}>리뷰</span>
                    <span className={styles.value}>{userActivity.reviews}건</span>
                </div>
                <div className={styles.actionBox}>
                    <img src={inquiryIcon} alt="문의" className={styles.icon}/>
                    <span className={styles.label}>문의</span>
                    <span className={styles.value}>{userActivity.inquiries}건</span>
                </div>
                <div
                    className={styles.actionBox}
                    onClick={() => navigate('/user-info')}
                >
                    <img src={infoIcon} alt="정보 수정" className={styles.icon}/>
                    <span className={styles.label}>정보 수정</span>
                </div>
                <div className={styles.actionBox}>
                    <img src={deleteIcon} alt="회원 탈퇴" className={styles.icon}/>
                    <span className={styles.label}>회원 탈퇴</span>
                </div>
            </section>

        </div>
    );
}

export default MyPage;