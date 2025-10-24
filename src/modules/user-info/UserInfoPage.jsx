import React, {useRef, useState} from 'react';
import styles from './UserInfoPage.module.css';

function UserInfoPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [phone, setPhone] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');

    const address2Ref = useRef(null);

    // TODO 초기값 불러오기

    // 회원정보 수정 버튼
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Signup attempt:', {
            email, name, zipCode, address1, address2,
            phone, birthYear, birthMonth, birthDay
        });
        // TODO: 회원정보 수정 API 호출 로직 추가
    };

    // Daum 우편번호 검색 로직
    const handleZipCodeSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    let roadAddr = data.roadAddress; // 도로명 주소 변수
                    let extraRoadAddr = ''; // 참고 항목 변수

                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraRoadAddr += data.bname;
                    }
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if(extraRoadAddr !== ''){
                        extraRoadAddr = ' (' + extraRoadAddr + ')';
                    }
                    if(roadAddr !== ''){
                        roadAddr += extraRoadAddr;
                    }

                    setZipCode(data.zonecode);
                    setAddress1(roadAddr ? roadAddr : data.jibunAddress);
                    if (address2Ref.current) {
                        address2Ref.current.focus();
                    }
                }
            }).open();
        } else {
            console.error('Daum Postcode 스크립트를 로드할 수 없습니다.');
            alert('우편번호 검색 서비스를 사용할 수 없습니다. 페이지를 새로고침 해보세요.');
        }
    };

    return (
        <div className={styles.signupContainer}>
            <h2 className={styles.title}>회원정보 수정</h2>
            <form onSubmit={handleSubmit} className={styles.signupForm}>
                {/* 이메일 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className={styles.inputField}
                    />
                </div>

                {/* 이름 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="name">이름</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                           className={styles.inputField}/>
                </div>

                {/* 주소 */}
                <div className={styles.inputGroup}>
                    <label>주소</label>
                    <div className={styles.addressRow}>
                        {/* 'id' 속성은 React에서 직접 쓸 일 없으므로 제거 가능 */}
                        <input
                            type="text"
                            placeholder="우편번호"
                            value={zipCode} // React state와 연결
                            readOnly // 직접 수정 불가
                            className={styles.zipCodeInput}
                        />
                        <button
                            type="button" // form 제출 방지
                            onClick={handleZipCodeSearch} // 핸들러 연결
                            className={styles.zipCodeButton}
                        >
                            우편번호 찾기 {/* 버튼 텍스트 변경 */}
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="주소"
                        value={address1} // React state와 연결
                        readOnly // 직접 수정 불가
                        className={styles.inputField}
                        style={{marginTop: '0.5rem'}}
                    />
                    <input
                        type="text"
                        placeholder="상세주소"
                        value={address2} // React state와 연결
                        onChange={(e) => setAddress2(e.target.value)} // 사용자가 입력 가능
                        ref={address2Ref} // ref 연결 (포커스용)
                        className={styles.inputField}
                        style={{marginTop: '0.5rem'}}
                    />
                </div>

                {/* 휴대폰 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">휴대폰</label>
                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                           className={styles.inputField}/>
                </div>

                {/* 생년월일 */}
                <div className={styles.inputGroup}>
                    <label>생년월일</label>
                    <div className={styles.birthdateRow}>
                        <input type="number" placeholder="년" value={birthYear}
                               onChange={(e) => setBirthYear(e.target.value)} required className={styles.birthInput}/>
                        <input type="number" placeholder="월" value={birthMonth}
                               onChange={(e) => setBirthMonth(e.target.value)} required className={styles.birthInput}/>
                        <input type="number" placeholder="일" value={birthDay}
                               onChange={(e) => setBirthDay(e.target.value)} required className={styles.birthInput}/>
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    수정하기
                </button>
            </form>
        </div>
    );
}

export default UserInfoPage;