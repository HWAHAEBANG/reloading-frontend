import React, { useEffect, useState } from "react";
import styles from "./VerifyEmailModal.module.css";
import { GoMailRead } from "react-icons/go";
import Countdown from "react-countdown";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

export default function VerifyEmailModal({
  inputValue,
  setInputValue,
  setModalToggle,
}) {
  // loading ===========================
  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  // ===================================
  const [countDownVisible, setCountDownVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  //=====================================================================================================

  const [isRunning, setIsRunning] = useState(false); // 타이머가 실행 중인지 여부를 저장하는 상태값

  const countdownTime = 10 * 60 * 1000;

  const handleComplete = () => {
    // console.log("타이머 종료");
    setIsRunning(false); // 타이머가 종료되면 실행 중인 상태를 false로 변경
  };

  useEffect(() => {
    if (isRunning) {
      // 타이머가 실행 중일 때
      const timeout = setTimeout(() => {
        setIsRunning(false); // 타이머가 종료될 때까지 10분 기다리고 실행 중인 상태를 false로 변경
      }, countdownTime);
      return () => clearTimeout(timeout); // 컴포넌트가 언마운트되면 타이머 정리
    }
  }, [isRunning]);

  // =========================================================
  // input태그가 onChange 될때마가 초기화 되는 버그로 인해 추가
  const [countdownDate, setCountdownDate] = useState(
    Date.now() + countdownTime
  );
  // =========================================================

  //=====================================================================================================
  // 이메일 요청 ================================================
  const handleSend = () => {
    setCountdownDate(Date.now() + countdownTime);
    setLoading(true);
    axios
      .post(`http://reloading.co.kr/api/users/sendEmail`, {
        method: "POST",
        withCredentials: true,
        data: {
          emailId: inputValue.emailId,
          emailAddress: inputValue.emailAddress,
        },
      })
      .then(() => {
        alert("메일이 전송되었습니다. 메일함을 확인해주세요");
        setLoading(false);
        setCountDownVisible(true);
        setResultVisible(false);
        setIsRunning(false); // 일단 false로 설정
        setTimeout(() => {
          setIsRunning(true); // 일정 시간 후에 true로 변경
        }, 0); // 0초 후에 실행되도록 설정
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert("이미 사용중인 이메일 입니다.");
          setLoading(false);
        } else {
          console.log(error);
        }
      });
  };

  //============================================================
  // 인증번호 입력값 확인 ========================================
  const [inputCode, setInputCode] = useState("");
  const handleInputCodeChange = (e) => {
    setInputCode(e.target.value);
  };

  const handleClose = () => {
    setModalToggle(false);
  };

  const handleVerify = () => {
    axios
      .post(`http://reloading.co.kr/api/users/verifyEmail`, {
        method: "POST",
        withCredentials: true,
        data: {
          inputCode: inputCode,
          emailId: inputValue.emailId,
          emailAddress: inputValue.emailAddress,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setResultVisible(true);
          setValidEmail(true);
          setInputValue((prevState) => ({ ...prevState, validEmail: true }));
          setCountDownVisible(false);
          alert("인증이 완료되었습니다.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setResultVisible(true);
          setValidEmail(false);
          setCountDownVisible(true);
          alert("틀린 인증 코드입니다.");
        } else {
          console.log(error);
        }
      });
  };
  //============

  return (
    <div className={styles.verifyEmailModal}>
      <p className={styles.title}>이메일 인증</p>

      <div className={styles.iconArea}>
        <div>
          <GoMailRead />
        </div>
        <p className={styles.explain}>
          계정 분실에 대비하여 <span>이메일 주소 인증</span>이 필요합니다.
        </p>
      </div>

      <div className={styles.sendArea}>
        <div>
          <p className={styles.email}>
            {inputValue.emailId}
            {inputValue.emailAddress}
          </p>
          <p className={styles.helperText}>위 메일로 인증코드를 전송합니다.</p>
        </div>
        {countDownVisible ? (
          loading ? (
            <button className={styles.sendBtn}>
              <RingLoader
                color='#36d7b7'
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            </button>
          ) : (
            <button className={styles.sendBtn} onClick={handleSend}>
              재전송 요청
            </button>
          )
        ) : loading ? (
          <button className={styles.sendBtn}>
            <RingLoader
              color='#36d7b7'
              loading={loading}
              cssOverride={override}
              size={20}
              aria-label='Loading Spinner'
              data-testid='loader'
            />
          </button>
        ) : (
          <button className={styles.sendBtn} onClick={handleSend}>
            전송 요청
          </button>
        )}
      </div>

      <div className={styles.inputArea}>
        <div>
          <input
            className={
              countDownVisible
                ? styles.inputBox
                : `${styles.inputBox} ${styles.inputBoxDisabled}`
            }
            type='text'
            placeholder='인증코드를 입력해주세요.'
            disabled={!countDownVisible}
            onChange={handleInputCodeChange}
          />
          <button className={styles.confirmBtn} onClick={handleVerify}>
            확인
          </button>
        </div>

        {countDownVisible && (
          <span className={styles.countDown}>
            남은시간
            <Countdown
              date={countdownDate}
              // date={Date.now() + countdownTime} input태그가 onChange 될때마가 초기화 되는 버그로 인해 수정
              onComplete={handleComplete}
              renderer={({ minutes, seconds }) => (
                <span>
                  {minutes < 10 ? "0" + minutes : minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
              )}
            />
          </span>
        )}
        {resultVisible ? (
          validEmail ? (
            <span className={styles.resultSuccess}>인증이 완료되었습니다.</span>
          ) : (
            <span className={styles.resultFail}>
              인증실패! 다시 확인해주세요.
            </span>
          )
        ) : (
          ""
        )}
      </div>
      <button className={styles.closeBtn} onClick={handleClose}>
        닫기
      </button>
    </div>
  );
}
