import React, { useEffect, useRef, useState } from "react";
import styles from "./GlitchSplashScreen.module.css";
import { Link, useNavigate } from "react-router-dom";
import TypeWriterEffect from "react-typewriter-effect";
import useSound from "use-sound";
import { Howl } from "howler";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, setUserInfoAction } from "../../redux";
import FindIdModal from "../find-id-modal/FindIdModal";
import FindPwModal from "../find-pw-modal/FindPwModal";

export default function GlitchSplashScreen() {
  // 효과음 ==========================================================================================================
  const [keyboard] = useSound("/sounds/keyboard.wav", { volume: 1 });
  const [wrong] = useSound("/sounds/wrong.mp3", { volume: 1 });
  const [faidIn] = useSound("/sounds/faidin.mp3", { volume: 1 });
  const [access] = useSound("/sounds/access.mp3", { volume: 1 });
  const [disk] = useSound("/sounds/disk.wav", { volume: 1 });
  const [move] = useSound("/sounds/move.wav", { volume: 1 });
  // ================================================================================================================

  // input 태그 자동 포커스 ==========================================================================================
  const idInputRef = useRef(null);
  const pwInputRef = useRef(null);

  useEffect(() => {
    idInputRef.current.focus();
  }, []);
  // ================================================================================================================

  // 아이디, 비밀번호 입력값 핸들링 ====================================================================================
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const handleInputId = (e) => {
    keyboard();
    setInputId(e.target.value.toLowerCase());
  };

  const handleInputPw = (e) => {
    keyboard();
    setInputPw(e.target.value);
  };
  // ================================================================================================================

  // 로그인 로직 =====================================================================================================
  const [existingId, setExistingId] = useState(false);
  const [correctPw, setCorrectPw] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 아이디 확인 함수 ====================================
  const handleSubmitId = () => {
    axios
      .post(`https://reloading.co.kr/api/users/idCheck`, {
        // url: "/users/idCheck", // 안되는뎅
        method: "POST",
        withCredentials: true,
        data: {
          inputId: inputId, // 생략 가능하지만 혼동 방지를 위해서 비생략.
        },
      })
      .then((response) => {
        faidIn();
        setExistingId(true);
        pwInputRef.current.focus();
        setAlertMessage("");
      })
      .catch((error) => {
        wrong();
        setAlertMessage("존재하지 않는 계정입니다.");
        console.log("에러코드", error.response.status, error.response.data);
      });
  };
  // ===================================================

  // 비밀번호 확인 함수 ==================================
  const handleSubmitPw = () => {
    axios
      .post(`https://reloading.co.kr/api/users/pwCheck`, {
        method: "POST",
        withCredentials: true,
        data: {
          inputId: inputId,
          inputPw: inputPw,
        },
      })
      .then((response) => {
        setAlertMessage("");
        getAccessToken();

        setCorrectPw(true);
        setInputId(""); // 혹시 남아있을까봐
        setInputPw(""); // 혹시 남아있을까봐
      })
      .catch((error) => {
        wrong();
        setAlertMessage("비밀번호가 일치하지 않습니다.");
      });
  };
  // ===================================================

  // 아이디 확인 실행 ====================================
  const idCheck = (e) => {
    if (e.keyCode === 13) {
      //enter 키
      handleSubmitId();
    }
  };
  // ===================================================

  // 비밀번호 확인 실행 ==================================
  const pwCheck = (e) => {
    if (e.keyCode === 13) {
      //enter 키
      handleSubmitPw();
    }
    if (e.getModifierState("CapsLock")) {
      setAlertMessage("CAPS LOCK이 켜져 있습니다.");
    } else {
      setAlertMessage();
    }
  };
  // ===================================================
  // ================================================================================================================

  // 액세스톡큰에서  로그인 여부와 회원정보 가져와서 리덕스에 저장  =======================================================
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const getAccessToken = () => {
    // 해쉬 안받아오도록 리팩토링 요망
    axios
      .get(`https://reloading.co.kr/api/users/accesstoken`, {
        method: "GET",
        withCredentials: true,
      })
      .then((response) => {
        // setIsLogin(true);
        dispatch(loginAction() /* (true) */); // true 왜썼음?
        dispatch(setUserInfoAction(response.data));
      })
      .then(() => {
        /**
         * 다음에 페이지로 넘어가는 이 로직을 dispatch가 실행되기 전이나, 동등산 시점에 실행할 경우
         * 우선순위가 밀려, 리덕스에 저장되지 않은채 다음 페이지에서 useSelect가 실행된다.
         * 이 함수가 선언된 곳도 안되고, 이 위에 then 안에서도 안된다.
         * 반드시 then을 두개 써서 디스패치와 동기적으로 실행되게 해야한다.
         */
        setTimeout(() => {
          navigate("/users/access");
        }, 500);
        faidIn();
        setTimeout(() => access(), 1000);
        setTimeout(() => disk(), 10000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // ================================================================================================================

  // 아이디, 비밀번호 찾기 모달 토글 ===================================================================================
  const [findIdModalVisible, setFindIdModalVisible] = useState(false);
  const [findPwModalVisible, setFindPwModalVisible] = useState(false);

  const openModal = (e) => {
    move();
    switch (e.target.id) {
      case "findId":
        setFindIdModalVisible(true);
        break;
      case "findPw":
        setFindPwModalVisible(true);
        break;
    }
  };
  // ================================================================================================================

  return (
    <div className={styles.mainContainer}>
      <div
        className={
          isLoggedIn.isLoggedIn
            ? `${styles.logoArea} ${styles.rightPwTpye1ForLogin}`
            : styles.logoArea
        }
      >
        <div className={styles.box}>
          {/* 포트스잇 ========================================================================  */}
          <div className={styles.postitContainer}>
            <img
              className={styles.postit}
              src={process.env.PUBLIC_URL + "/image/postit.png"}
              alt='포스트잇'
            />
            <p>
              바쁜 시간 내시어 사이트에 방문 해주셔서
              <br />
              진심으로 감사드립니다.
              <br />
              회원가입이 번거로우시지 않도록
              <br />
              테스트 계정을 준비했습니다.
              <br />
              <br />
              <span>
                아이디 : HHB
                <br />
                비밀번호 : testUser1!
              </span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(
                대문자 U )
              </span>
              <br />
              <br />
              개선할 점을 조언해주신다면
              <br />
              바로 수정하도록하겠습니다. 감사합니다.
            </p>
          </div>
          {/* ==================================================================================== */}
          <h2 className={styles.text}>RE LOADING</h2>
          <h3 className={styles.subText}>
            <span>R</span>eal <span>E</span>state Market Price Watchtower
          </h3>
        </div>
      </div>
      {/* ============================================ */}
      <div
        className={
          isLoggedIn.isLoggedIn
            ? `${styles.loginArea} ${styles.rightPwTpye1ForLogin}`
            : styles.loginArea
        }
      >
        <div
          className={
            existingId
              ? `${styles.idContainer} ${styles.existingIdType0ForId}`
              : styles.idContainer
          }
        >
          <div
            className={
              existingId
                ? `${styles.idTitle} ${styles.existingIdType1ForId}`
                : styles.idTitle
            }
          >
            <TypeWriterEffect
              textStyle={{
                fontFamily: "PixelCaps",
                fontSize: "21.5px",
                lineHeight: "0px",
              }}
              startDelay={500}
              // cursorColor={"mediumaquamarine"}
              text='ENTER IDENTITY'
              typeSpeed={40}
              // scrollArea={myAppRef}
            />
          </div>
          <div
            className={
              existingId
                ? `${styles.idOutLine} ${styles.existingIdType2ForId}`
                : styles.idOutLine
            }
          ></div>
          <div className={styles.idInputContainer}>
            <input
              className={
                existingId
                  ? `${styles.idInput} ${styles.existingIdType3ForId}`
                  : styles.idInput
              }
              type='text'
              ref={idInputRef}
              value={inputId}
              onKeyDown={idCheck}
              onChange={handleInputId}
            />
            <div className={styles.idBlock1}></div>
          </div>
          <div className={styles.idBlock2}></div>
        </div>
        {/* ============================================================= */}
        <div
          className={
            existingId
              ? `${styles.pwContainer} ${styles.existingIdType0ForPw}`
              : styles.pwContainer
          }
        >
          <div
            className={
              existingId
                ? correctPw
                  ? styles.pwTitle
                  : `${styles.pwTitle} ${styles.existingIdType1ForPw}`
                : styles.pwTitle
            }
          >
            <TypeWriterEffect
              textStyle={{
                fontFamily: "PixelCaps",
                fontSize: "21.5px",
                lineHeight: "0px",
              }}
              startDelay={500}
              // cursorColor={"#03e9f4"}
              text='ENTER PASSWORD'
              typeSpeed={20}
              // scrollArea={myAppRef}
            />
          </div>
          <div
            className={
              existingId
                ? correctPw
                  ? styles.pwOutLine
                  : `${styles.pwOutLine} ${styles.existingIdType2ForPw}`
                : styles.pwOutLine
            }
          ></div>
          <div className={styles.pwInputContainer}>
            <input
              className={
                existingId
                  ? correctPw
                    ? styles.pwInput
                    : `${styles.pwInput} ${styles.existingIdType3ForPw}`
                  : styles.pwInput
              }
              type='password'
              ref={pwInputRef}
              value={inputPw}
              onKeyDown={pwCheck}
              onChange={handleInputPw}
            />
            <div className={styles.pwBlock1}></div>
          </div>
          <div className={styles.pwBlock2}></div>
        </div>
        <p className={styles.alert}>{alertMessage}</p>
      </div>
      {/* ====================================================================== */}
      {existingId ? (
        <button
          className={
            existingId
              ? correctPw
                ? styles.confirmPw
                : `${styles.confirmPw} ${styles.existingIdType3ForPw}`
              : styles.confirmPw
          }
          onClick={handleSubmitPw}
        >
          확인
        </button>
      ) : (
        <button
          className={
            existingId
              ? correctPw
                ? styles.confirmId
                : `${styles.confirmId} ${styles.existingIdType1ForPw}`
              : styles.confirmId
          }
          onClick={handleSubmitId}
        >
          확인
        </button>
      )}
      <div className={styles.linkContainer}>
        <p className={styles.link}>
          Forgot{" "}
          <span id='findId' onClick={openModal}>
            ID
          </span>{" "}
          or{" "}
          <span id='findPw' onClick={openModal}>
            Password
          </span>{" "}
          ?
        </p>
        <p className={styles.link}>
          Not Yet registered?{" "}
          <Link to='/users/signUp' onClick={() => move()}>
            Sign up
          </Link>
        </p>
      </div>
      {findIdModalVisible ? (
        <FindIdModal setModalToggle={setFindIdModalVisible} />
      ) : (
        ""
      )}
      {findPwModalVisible ? (
        <FindPwModal setModalToggle={setFindPwModalVisible} />
      ) : (
        ""
      )}
    </div>
  );
}
