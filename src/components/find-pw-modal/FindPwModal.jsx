import React, { useState } from "react";
import styles from "./FindPwModal.module.css";
import { GoMailRead } from "react-icons/go";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

export default function FindPwModal({ setModalToggle }) {
  // loading ===========================
  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  //============================================
  const [success, setSuccess] = useState(false);
  // 인증번호 입력값 확인 ========================================
  const [inputEmail, setInputEmail] = useState("");
  const handleInputEmailChange = (e) => {
    setInputEmail(e.target.value);
  };

  const handleClose = () => {
    setModalToggle(false);
  };

  //=====================================================================================================
  // 이메일 요청 ================================================
  const handleSend = () => {
    setLoading(true);
    axios
      .post(`http://reloading.co.kr/api/users/sendFindPwEmail`, {
        method: "POST",
        withCredentials: true,
        data: {
          inputEmail: inputEmail,
        },
      })
      .then(() => {
        alert("메일이 전송되었습니다. 메일함을 확인해주세요");
        setLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        alert("메일 전송에 실패하였습니다. 유효하지 않은 이메일입니다.");
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className={styles.findModal}>
      <p className={styles.title}>비밀번호 찾기</p>

      <div className={styles.iconArea}>
        <div>
          <GoMailRead />
        </div>
        <p className={styles.explain}>
          <span>회원가입 시</span> 등록했던 이메일을 입력해주세요 <br />
          이메일로 <span>임시 비밀번호</span>가 발송됩니다.
        </p>
      </div>

      <div className={styles.inputArea}>
        <div>
          <input
            className={styles.inputBox}
            type='text'
            placeholder='이메일을 입력해주세요.'
            onChange={handleInputEmailChange}
          />
          {loading ? (
            <button className={styles.confirmBtn} onClick={handleSend}>
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
            <button className={styles.confirmBtn} onClick={handleSend}>
              확인
            </button>
          )}
        </div>
        {success && (
          <span className={styles.resultSuccess}>
            임시 비밀번호가 이메일로 전송되었습니다.
          </span>
        )}
      </div>
      <button className={styles.closeBtn} onClick={handleClose}>
        닫기
      </button>
    </div>
  );
}
