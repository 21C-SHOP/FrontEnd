import React, {useRef, useState} from 'react';
import styles from './SignupPage.module.css';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(''); // 인증번호
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
    const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [name, setName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [phone, setPhone] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');

    const address2Ref = useRef(null);

    const validatePassword = (pw) => {
        if (pw.length < 10) {
            return "비밀번호는 10자 이상이어야 합니다.";
        }
        const specialCharRegex = /[!@#$%^&*]/;
        if (!specialCharRegex.test(pw)) {
            return "특수문자(!@#$%^&*)를 하나 이상 포함해야 합니다.";
        }
        return "";
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordError(validatePassword(newPassword));
    };

    // 회원가입 버튼
    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordError) {
            alert(passwordError);
            return;
        }

        if (!isVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        console.log('Signup attempt:', {
            email, password, name, zipCode, address1, address2,
            phone, birthYear, birthMonth, birthDay
        });
        // TODO: 회원가입 API 호출 로직 추가
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

    // --- 이메일 인증 관련 함수들 ---
    const handleRequestCode = () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        // TODO: 백엔드 API 호출 (인증번호 발송 요청)
        console.log(`인증번호 요청: ${email}`);
        setIsCodeSent(true); // 발송 상태로 변경 (UI 변경용)
        alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
    };

    const handleVerifyCode = () => {
        if (!verificationCode) {
            alert('인증번호를 입력해주세요.');
            return;
        }
        // TODO: 백엔드 API 호출 (인증번호 확인 요청)
        console.log(`인증번호 확인: ${verificationCode}`);
        // 임시로 성공 처리
        setIsVerified(true); // 인증 완료 상태로 변경
        alert('이메일 인증이 완료되었습니다.');
    };

    return (
        <div className={styles.signupContainer}>
            <h2 className={styles.title}>회원가입</h2>
            <form onSubmit={handleSubmit} className={styles.signupForm}>
                {/* 이메일 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">이메일</label>
                    <div className={styles.inputWithButton}>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.inputField}
                            disabled={isVerified}
                        />
                        {/* 인증 완료 시 버튼 숨김 */}
                        {!isVerified && (
                            <button
                                type="button"
                                onClick={handleRequestCode}
                                className={styles.inlineButton}
                            >
                                {isCodeSent ? '재전송' : '인증번호 받기'}
                            </button>
                        )}
                    </div>
                </div>
                {/* --- 👇 인증번호 입력 그룹 추가 --- */}
                {isCodeSent && !isVerified && ( // 인증번호가 발송되었고, 아직 인증 전일 때만 보임
                    <div className={styles.inputGroup}>
                        <label htmlFor="verificationCode">인증번호</label>
                        <div className={styles.inputWithButton}>
                            <input
                                id="verificationCode"
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                className={styles.emailVerifyInputField}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                className={styles.inlineButton}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}
                {/* 인증 완료 메시지 (선택 사항) */}
                {isVerified && (
                    <p className={styles.verifiedMessage}>✅ 이메일 인증이 완료되었습니다.</p>
                )}

                {/* 비밀번호 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호 (특수문자 포함, 10자 이상)</label>
                    <input id="password" type="password" value={password} onChange={handlePasswordChange} required
                           className={styles.inputField}/>
                </div>

                {/* 비밀번호 확인 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input id="passwordConfirm" type="password" value={passwordConfirm}
                           onChange={(e) => setPasswordConfirm(e.target.value)} required className={styles.inputField}/>
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

                <button type="submit" className={styles.submitButton} disabled={!isVerified}>
                    가입하기
                </button>
            </form>
        </div>
    );
}

export default SignupPage;