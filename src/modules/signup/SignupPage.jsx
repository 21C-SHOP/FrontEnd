import React, {useEffect, useRef, useState} from 'react';
import styles from './SignupPage.module.css';
import axiosInstance from "@/api/axiosInstance.js";
import {useNavigate} from "react-router-dom";

function SignupPage() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(''); // 인증번호
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
    const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
    const [timer, setTimer] = useState(0);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
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
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

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
        if (passwordConfirm && newPassword !== passwordConfirm) {
            setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordConfirmError('');
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const newConfirmPassword = e.target.value;
        setPasswordConfirm(newConfirmPassword);
        // (실시간 일치 검사)
        if (password !== newConfirmPassword) {
            setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordConfirmError('');
        }
    };

    // 회원가입 버튼
    const handleSubmit = async (event) => {
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

        // 생년월일 조합 및 유효성 검사
        let birthDate = null;
        if (birthYear && birthMonth && birthDay) {
            const month = birthMonth.padStart(2, '0');
            const day = birthDay.padStart(2, '0');
            birthDate = `${birthYear}-${month}-${day}`;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
                alert('올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)');
                return;
            }
        } else {
            alert('생년월일을 모두 입력해주세요.');
            return;
        }

        const signupDto = {
            email: email,
            password: password,
            name: name,
            zipCode: zipCode,
            address1: address1,
            address2: address2,
            phoneNumber: phone,
            birth: birthDate
        }

        try {
            await axiosInstance.post('/v1/users/sign-up', signupDto);
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    // Daum 우편번호 검색 로직
    const handleZipCodeSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    let roadAddr = data.roadAddress; // 도로명 주소 변수
                    let extraRoadAddr = ''; // 참고 항목 변수

                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraRoadAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if (extraRoadAddr !== '') {
                        extraRoadAddr = ' (' + extraRoadAddr + ')';
                    }
                    if (roadAddr !== '') {
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
    const handleRequestCode = async () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        const emailDto = {
            email: email
        }

        try {
            alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
            await axiosInstance.post('/v1/users/verifications', emailDto);
            setIsCodeSent(true);
            setTimer(180);
        } catch (error) {
            const errorMessage = error.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            alert('인증번호를 입력해주세요.');
            return;
        }

        const verifyDto = {
            email: email,
            verificationCode: verificationCode
        }

        try {
            const response = await axiosInstance.post('/v1/users/verifications/confirm', verifyDto);
            if (response.data.result.isAvailable) {
                setIsVerified(true); // 인증 완료 상태로 변경
                setTimer(0);
                alert('이메일 인증이 완료되었습니다.');
            } else {
                alert('인증번호가 올바르지 않습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || '인증번호 확인 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    const isSubmitDisabled =
        !email ||
        !isVerified ||
        !password ||
        !passwordConfirm ||
        !name ||
        !zipCode ||
        !address1 ||
        !address2 ||
        !phone ||
        !birthYear ||
        !birthMonth ||
        !birthDay ||
        !!passwordError ||
        !!passwordConfirmError;

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
                        <div className={styles.labelTimerWrapper}>
                            <label htmlFor="verificationCode">인증번호</label>
                            {timer > 0 && (
                                <span className={styles.timer}>
                                    유효시간 {formatTime(timer)}
                                </span>
                            )}
                        </div>
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
                        {timer === 0 && <p className={styles.timerExpired}>인증 시간이 만료되었습니다. '재전송' 버튼을 눌러주세요.</p>}
                    </div>
                )}
                {/* 인증 완료 메시지 (선택 사항) */}
                {isVerified && (
                    <p className={styles.verifiedMessage}>이메일 인증이 완료되었습니다.</p>
                )}

                {/* 비밀번호 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호 (특수문자 포함, 10자 이상)</label>
                    <input id="password" type="password" value={password} onChange={handlePasswordChange} required
                           className={styles.inputField}/>
                    {passwordError && <p className={styles.errorText}>{passwordError}</p>}
                </div>

                {/* 비밀번호 확인 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={handlePasswordConfirmChange}
                        required
                        className={styles.inputField}
                    />
                    {passwordConfirmError && <p className={styles.errorText}>{passwordConfirmError}</p>}
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

                <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>
                    가입하기
                </button>
            </form>
        </div>
    );
}

export default SignupPage;