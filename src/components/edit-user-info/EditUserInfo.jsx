import React, { useEffect, useState } from "react";
import styles from "./EditUserInfo.module.css";
import { Link, useNavigate } from "react-router-dom";
import RegexInfoBoxForSignup from "../ui/RegexInfoBoxForSignup";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { uploadImage } from "../../api/cloudynary";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginAction, setUserInfoAction } from "../../redux";
import VerifyEmailModal from "../verify-mail-modal/VerifyEmailModal";
import RingLoader from "react-spinners/RingLoader";
import useSound from "use-sound";
import AvatarEditorModal from "../signup/AvatarEditorModal";

export default function EditUserInfo() {
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const [move] = useSound("/sounds/move.wav", { volume: 1 });

  // 회원가입 여부와 회원정보 리덕스에 저장  =======================================

  const getAccessToken = () => {
    axios
      .get(`http://reloading.co.kr/api/users/accesstoken`, {
        method: "GET",
        withCredentials: true,
      })
      .then((response) => {
        // setIsLogin(true);
        dispatch(loginAction(true));
        dispatch(setUserInfoAction(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ======================================================================

  // loading ===========================

  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  // ===================================

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    id: userInfo.userInfo.id, //. 순서 이거 될까
    // validId: false,
    // nonIdDuplication: false,
    currentPw: "",
    authenticationStatus: false, //임시 true
    pw: "",
    validPw: false, // 입력 안되어도 통과할 수 있도록. 입력값이 생기면 false로 바뀜
    pwCheck: "",
    correctPwCheck: false, // 입력 안되어도 통과할 수 있도록. 입력값이 생기면 false로 바뀜
    name: userInfo.userInfo.name,
    nickname: userInfo.userInfo.nickname,
    validNickname: true, // 입력 안되어도 통과할 수 있도록. 입력값이 생기면 false로 바뀜
    nonNicknameDuplication: true, // 입력 안되어도 통과할 수 있도록. 입력값이 생기면 false로 바뀜
    emailId: userInfo.userInfo.email.split("@")[0],
    emailAddress: userInfo.userInfo.email.split("@")[1],
    validEmail: true, // 추후 리팩토링 예정
    profileImage: userInfo.userInfo.profile_image,
    // agree: false,
  });

  // 시진파일 URL get
  const [uploadLoading, setUploadLoading] = useState(false);

  // const getImgUrl = (e) => {
  //   setUploadLoading(true);
  //   uploadImage(e.target.files && e.target.files[0]).then((url) => {
  //     setInputValue((prevState) => ({ ...prevState, profileImage: url }));
  //     setUploadLoading(false);
  //   });
  // };

  // 정규식 모음 객체
  const inputRegexs = {
    // // 아이디 : 문자로 시작하여, 영문자, 숫자, 하이픈(-), 언더바(_)를 사용하여 3~20자 이내
    // idRegex: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
    // 비밀번호 : 최소 8자 이상, 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
    pwRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
    // 닉네임 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
    nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
  };

  const detectCapsLock = (e) => {
    if (e.getModifierState("CapsLock")) {
      setAlertMessage((prevState) => ({
        ...prevState,
        pw: "CAPS LOCK이 켜져 있습니다.",
        pwCheck: "CAPS LOCK이 켜져 있습니다.",
      }));
    } else {
      setAlertMessage((prevState) => ({
        ...prevState,
        pw: "",
        pwCheck: "",
      }));
    }
  };

  // 입력값 검증(추후 성능 테스트하여 useEffect나 useCallback 으로 리팩토링 고려 )
  const handleInputValue = (e) => {
    switch (e.target.name) {
      // ID 입력값 검증 =====================================================================================
      case "id":
        // 정규식에 부합하는 경우
        if (inputRegexs.idRegex.test(e.target.value)) {
          setInputValue((prevState) => ({ ...prevState, validId: true })); //  ...prevState 꼭 블로그 포스팅
          setPassMessage((prevState) => ({
            ...prevState,
            id: "조건을 충족하는 아이디 입니다. 중복을 확인해주세요.",
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            id: "",
          }));
        } else {
          // 정규식에 부합하지 않는 경우
          // 입력값이 존재하긴 하지만 정규식에 부합하지 않는 경우
          if (e.target.value) {
            setInputValue((prevState) => ({ ...prevState, validId: false }));
            setAlertMessage((prevState) => ({
              ...prevState,
              id: "사용할 수 없는 아이디 입니다.",
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              id: "",
            }));
          }
          // 입력값이 존재하지 않는 경우 (다 지워진 경우)
          else
            setAlertMessage((prevState) => ({
              ...prevState,
              id: "",
            }));
        }
        setInputValue((prevState) => ({
          ...prevState,
          id: e.target.value.toLowerCase(),
        }));
        break;
      // ===================================================================================================
      // currentPW 입력값 검증 =====================================================================================
      case "currentPw":
        setInputValue((prevState) => ({
          ...prevState,
          currentPw: e.target.value,
        }));
        break;
      // ===================================================================================================
      // PW 입력값 검증 =====================================================================================
      case "pw":
        // +추가) 비밀번호가 확인까지 이미 입력된 상태에서, 비밀번호를 지울 경우 핸들링
        if (inputValue.pwCheck && inputValue.pwCheck !== e.target.value) {
          setInputValue((prevState) => ({
            ...prevState,
            correctPwCheck: false,
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            pwCheck: "비밀번호가 일치하지 않습니다.",
          }));
          setPassMessage((prevState) => ({
            ...prevState,
            pwCheck: "",
          }));
          // ++추가) 비밀번호가 확인까지 이미 입력된 상태에서, 비밀번호를 지웠다가 다시 입력할 경우
        } else if (
          inputValue.pwCheck &&
          inputValue.pwCheck === e.target.value
        ) {
          setInputValue((prevState) => ({
            ...prevState,
            correctPwCheck: true,
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            pwCheck: "",
          }));
          setPassMessage((prevState) => ({
            ...prevState,
            pwCheck: "비밀번호가 일치합니다.",
          }));
        }
        // 정규식에 부합하는 경우
        if (inputRegexs.pwRegex.test(e.target.value)) {
          setInputValue((prevState) => ({ ...prevState, validPw: true }));
          setPassMessage((prevState) => ({
            ...prevState,
            pw: "사용할 수 있는 비밀번호 입니다.",
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            pw: "",
          }));
        } else {
          // 정규식에 부합하지 않는 경우
          // 입력값이 존재하긴 하지만 정규식에 부합하지 않는 경우
          if (e.target.value) {
            setInputValue((prevState) => ({ ...prevState, validPw: false }));
            setAlertMessage((prevState) => ({
              ...prevState,
              pw: "사용할 수 없는 비밀번호 입니다.",
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              pw: "",
            }));
          }
          // 입력값이 존재하지 않는 경우 (다 지워진 경우)
          else
            setAlertMessage((prevState) => ({
              ...prevState,
              pw: "",
            }));
        }
        setInputValue((prevState) => ({ ...prevState, pw: e.target.value }));
        break;
      // ===================================================================================================
      // PW Check 입력값 검증 ===============================================================================
      case "pwCheck":
        // 비밀번호 입력값과 일치하는 경우
        if (inputValue.pw === e.target.value) {
          // 입력값도 있고, 비밀번호 입력값과 일치하는 경우.
          if (e.target.value) {
            setInputValue((prevState) => ({
              ...prevState,
              correctPwCheck: true,
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              pwCheck: "비밀번호가 일치합니다.",
            }));
            setAlertMessage((prevState) => ({
              ...prevState,
              pwCheck: "",
            }));
          } else {
            // (특수 케이스) 입력값이 없는데 비밀번호 입력값이 없어서 일치하는 경우 (놓치기 쉬운 케이스)
            setInputValue((prevState) => ({
              ...prevState,
              correctPwCheck: false, // 불일치로 간주
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              pwCheck: "",
            }));
            setAlertMessage((prevState) => ({
              ...prevState,
              pwCheck: "",
            }));
          }
        } else {
          // 비밀번호 입력값과 일치하지 않는 경우
          // 입력값이 존재하긴 하지만 비밀번호와 일치하지 않는 경우
          if (e.target.value) {
            setInputValue((prevState) => ({
              ...prevState,
              correctPwCheck: false,
            }));
            setAlertMessage((prevState) => ({
              ...prevState,
              pwCheck: "비밀번호가 일치하지 않습니다.",
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              pwCheck: "",
            }));
          }
          // 입력값이 존재하지 않는 경우 (다 지워진 경우)
          else
            setAlertMessage((prevState) => ({
              ...prevState,
              pwCheck: "",
            }));
        }
        setInputValue((prevState) => ({
          ...prevState,
          pwCheck: e.target.value,
        }));
        break;
      // ===================================================================================================
      // nickname 입력값 검증 ===============================================================================
      case "nickname":
        setInputValue((prevState) => ({
          // 입력 변동감지되면 중복여부, 정규식을 false로 바꿈
          ...prevState,
          validNickname: false,
          nonNicknameDuplication: false,
        }));

        if (inputRegexs.nicknameRegex.test(e.target.value)) {
          // 정규식에 부합하는 경우
          setInputValue((prevState) => ({
            ...prevState,
            validNickname: true,
          }));
          setPassMessage((prevState) => ({
            ...prevState,
            nickname: "조건을 충족하는 닉네임 입니다. 중복을 확인해주세요.",
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            nickname: "",
          }));
        } else {
          // 정규식에 부합하지 않는 경우
          // 입력값이 존재하긴 하지만 정규식에 부합하지 않는 경우
          if (e.target.value) {
            setInputValue((prevState) => ({
              ...prevState,
              validNickname: false,
            }));
            setAlertMessage((prevState) => ({
              ...prevState,
              nickname: "사용할 수 없는 닉네임 입니다.",
            }));
            setPassMessage((prevState) => ({
              ...prevState,
              nickname: "",
            }));
          }
          // 입력값이 존재하지 않는 경우 (다 지워진 경우)
          else
            setAlertMessage((prevState) => ({
              ...prevState,
              nickname: "",
            }));
        }
        setInputValue((prevState) => ({
          ...prevState,
          nickname: e.target.value,
        }));
        break;
      case "agree":
        setInputValue((prevState) => ({
          ...prevState,
          agree: e.target.checked,
        }));
        break;
      // ===================================================================================================
      case "emailId":
      case "emailAdress":
        setInputValue((prevState) => ({
          // 입력 변동감지되면 중복여부, 정규식을 false로 바꿈
          ...prevState,
          validEmail: false,
        }));

        break;
      // 검증 불필요 항목 입력값 =============================================================================
      default:
        setInputValue((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      // ===================================================================================================
    }
  };

  // 입력 조건 (정규식)설명 텍스트
  const REGEX_INFO = {
    pw: [
      "비밀번호 정책",
      "- 최소 8자 이상",
      "- 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함",
      "- 공백은 허용하지 않음",
    ],
    nickname: [
      "닉네임 정책",
      "- 영어 대/소문자, 숫자, 한글 자모음 조합",
      "- 2~10자 이내",
    ],
  };

  /**
   * 고려할 사항
   * 1. 정규식에 부합하지 않는 아이디인 경우
   * 2. 이미 존재하는 아이디인 경우
   * 3. 정규식에 부합하지 않는 비밀번호인 경우
   * 4. 비빌번호와 비빌번호환이 일치하지 않는 경우
   * 5. 정규식에 부합하지 않는 닉네임인 경우
   * 6. 이미 존재하는 닉네임인 경우
   * 7. (이메일 인증이 미실시 또는 실패한 경우)
   */

  const submitRequirementsWithoutPw = // 아래 조건을 모두 충족할 시 제출 버튼 활성화.
    // inputValue.id && // 아이디가 입력되었는가?
    // inputValue.validId && // 아이디가 정규식에 부합하는가?
    // inputValue.currentPw && // 현재 비밀번호가 입력되었는가?
    inputValue.authenticationStatus && // 본인 인증이 되었는가?
    // inputValue.nonIdDuplication && // 아이디가 중복되지 않았는가?
    // inputValue.pw && // 비밀번호가 입력되었는가?
    // inputValue.validPw && // 비밀번호가 정규식에 부합하는가?
    // inputValue.pwCheck && // 비밀번호확 인이 입력되었는가?
    // inputValue.correctPwCheck && // 비밀번호 확인이 비밀번호화 일치하는가?
    inputValue.name && // 이름이 입력되었는가?
    inputValue.nickname && // 닉네임이 입력되었는는가?
    inputValue.nonNicknameDuplication && // 닉네입이 중복되지 않았는가?
    inputValue.emailId && // 이메일 아이디를 입력하였는가?
    inputValue.emailAddress && // 이메일 도메인 주소를  선택하였는가?
    inputValue.validEmail; // 이메일이 인증되었는가? (추후 리팩토링 예정)
  // inputValue.agree; // 정보제공에 동의 하였는가

  const submitRequirementsWithPw = // 아래 조건을 모두 충족할 시 제출 버튼 활성화.
    // inputValue.id && // 아이디가 입력되었는가?
    // inputValue.validId && // 아이디가 정규식에 부합하는가?
    // inputValue.currentPw && // 현재 비밀번호가 입력되었는가?
    inputValue.authenticationStatus && // 본인 인증이 되었는가?
    // inputValue.nonIdDuplication && // 아이디가 중복되지 않았는가?
    // inputValue.pw && // 비밀번호가 입력되었는가?
    inputValue.validPw && // 비밀번호가 정규식에 부합하는가?
    inputValue.pwCheck && // 비밀번호확 인이 입력되었는가?
    inputValue.correctPwCheck && // 비밀번호 확인이 비밀번호화 일치하는가?
    inputValue.name && // 이름이 입력되었는가?
    inputValue.nickname && // 닉네임이 입력되었는는가?
    inputValue.nonNicknameDuplication && // 닉네입이 중복되지 않았는가?
    inputValue.emailId && // 이메일 아이디를 입력하였는가?
    inputValue.emailAddress && // 이메일 도메인 주소를  선택하였는가?
    inputValue.validEmail; // 이메일이 인증되었는가? (추후 리팩토링 예정)
  // inputValue.agree; // 정보제공에 동의 하였는가

  // 조건에 부합하지 않는 경우 빨간글씨 경고
  const [alertMessage, setAlertMessage] = useState({
    id: "",
    currentPw: "본인인증 후 수정이 가능합니다.",
    pw: "",
    pwCheck: "",
    nickname: "",
    email: "",
    agree: "",
  });

  // 조건에 부합할 경우 초록글씨 경고
  const [passMessage, setPassMessage] = useState({
    id: "아이디는 변경할 수 없습니다.",
    currentPw: "",
    pw: "",
    pwCheck: "",
    nickname: "",
    email: "",
    agree: "",
  });

  // 중복확인 통과한 이후에 다시 수정할 경우 대비
  // useEffect(() => {
  //   setInputValue((prevState) => ({ ...prevState, nonIdDuplication: false }));
  // }, [inputValue.id]);

  // useEffect(() => {
  //   setInputValue((prevState) => ({
  //     ...prevState,
  //     nonNicknameDuplication: false,
  //   }));
  // }, [inputValue.nickname]);

  const [modalToggle, setModalToggle] = useState(false);

  const handleOpenEmailModal = () => {
    if (!inputValue.emailId) return alert("이메일 이이디를 입력해주세요.");
    if (!inputValue.emailAddress) return alert("이메일 도메인을 선택해주세요.");
    setModalToggle(true);
    move();
  };

  //test zone ==========================================================

  const authenticate = () => {
    axios
      .post(`http://reloading.co.kr/api/users/pwCheck`, {
        method: "POST",
        withCredentials: true,
        data: {
          inputId: inputValue.id,
          inputPw: inputValue.currentPw,
        },
      })
      .then((response) => {
        alert("본인 인증이 완료되었습니다.");
        setPassMessage((prevState) => ({
          ...prevState,
          currentPw: "본인 인증이 완료되었습니다.",
        }));
        setAlertMessage((prevState) => ({
          ...prevState,
          currentPw: "",
        }));
        setInputValue((prevState) => ({
          ...prevState,
          authenticationStatus: true,
        }));
      })
      .catch((error) => {
        alert("비밀번호가 일치하지 않습니다.");
        setAlertMessage((prevState) => ({
          ...prevState,
          currentPw: "비밀번호가 일치하지 않습니다.",
        }));
        setPassMessage((prevState) => ({
          ...prevState,
          currentPw: "",
        }));
        setInputValue((prevState) => ({
          ...prevState,
          authenticationStatus: false,
        }));
      });
  };

  const dupIdToggle = () => {
    axios
      .post(`http://reloading.co.kr/api/users/idCheck`, {
        // url: "/users/idCheck", // 안되는뎅
        method: "POST",
        withCredentials: true,
        data: {
          inputId: inputValue.id, // 생략 가능하지만 혼동 방지를 위해서 비생략.
        },
      })
      .then((response) => {
        alert("이미 사용중인 아이디 입니다.");
        setInputValue({
          ...inputValue,
          nonIdDuplication: false,
        });
        setAlertMessage((prevState) => ({
          ...prevState,
          id: "이미 사용중인 아이디 입니다.",
        }));
        setPassMessage((prevState) => ({
          ...prevState,
          id: "",
        }));
      })
      .catch((error) => {
        if (inputValue.validId) {
          alert("사용할 수 있는 아이디 입니다.");
          setInputValue({
            ...inputValue,
            nonIdDuplication: true,
          });
          setPassMessage((prevState) => ({
            ...prevState,
            id: "사용할 수 있는 아이디 입니다.",
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            id: "",
          }));
        } else {
          alert("사용할 수 없는 아이디 입니다.");
          setAlertMessage((prevState) => ({
            ...prevState,
            id: "사용할 수 없는 아이디 입니다.",
          }));
          setPassMessage((prevState) => ({
            ...prevState,
            id: "",
          }));
        }
        // setAlertMessage("존재하지 않는 계정입니다.");
        // console.log("에러코드", error.response.status, error.response.data);
      });
  };

  const dupNicknameToggle = () => {
    axios
      .post(`http://reloading.co.kr/api/users/nicknameCheck`, {
        // url: "/users/nickCheck", // 안되는뎅
        method: "POST",
        withCredentials: true,
        data: {
          inputNickname: inputValue.nickname, // 생략 가능하지만 혼동 방지를 위해서 비생략.
        },
      })
      .then((response) => {
        alert("이미 사용중인 닉네임 입니다.");
        setInputValue({
          ...inputValue,
          nonNicknameDuplication: false,
        });
        setAlertMessage((prevState) => ({
          ...prevState,
          nickname: "이미 사용중인 닉네임 입니다.",
        }));
        setPassMessage((prevState) => ({
          ...prevState,
          nickname: "",
        }));
      })
      .catch((error) => {
        if (inputValue.validNickname) {
          alert("사용할 수 있는 닉네임 입니다.");
          setInputValue({
            ...inputValue,
            nonNicknameDuplication: true,
          });
          setPassMessage((prevState) => ({
            ...prevState,
            nickname: "사용할 수 있는 닉네임 입니다.",
          }));
          setAlertMessage((prevState) => ({
            ...prevState,
            nickname: "",
          }));
        } else {
          alert("사용할 수 없는 닉네임 입니다.");
          setAlertMessage((prevState) => ({
            ...prevState,
            nickname: "사용할 수 없는 닉네임 입니다.",
          }));
          setPassMessage((prevState) => ({
            ...prevState,
            nickname: "",
          }));
        }
        // setAlertMessage("존재하지 않는 계정입니다.");
        // console.log("에러코드", error.response.status, error.response.data);
      });
  };

  // const [inputValue, setInputValue] = useState({
  //   id: userInfo.userInfo.id, //. 순서 이거 될까
  //   currentPw: "",
  //   authenticationStatus: false,
  //   pw: "",
  //   validPw: false,
  //   pwCheck: "",
  //   correctPwCheck: false,
  //   name: "",
  //   nickname: "",
  //   validNickname: false,
  //   nonNicknameDuplication: true, //  nickname 이 있으면 false줄거임
  //   emailId: "",
  //   emailAddress: "",
  //   validEmail: true, // 추후 리팩토링 예정
  //   profileImage: "",
  //   // agree: false,
  // });

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post(`http://reloading.co.kr/api/users/editUserInfo`, {
        method: "POST",
        withCredentials: true,
        data: {
          inputValue: inputValue, // 생략 가능하지만 혼동 방지를 위해서 비생략.
        },
      })
      .then((response) => {
        setLoading(false);
        alert("수정이 완료되었습니다.");
        getAccessToken();
        navigate("/");
      })
      .catch((error) => {
        // setAlertMessage("존재하지 않는 계정입니다.");
        console.log("에러코드", error.response.status, error.response.data);
      });
  };

  //test tool end=======================================================

  //select =============================================
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState(
    userInfo && userInfo.userInfo && userInfo.userInfo.email.split("@")[1]
  );

  // ===================================================
  // select ============================================
  const handleSelectSort = (e) => {
    setSelectedSort(e.target.innerText);
    setSortVisible((prev) => !prev);
    // 이메일 도메인 변경이 감지되면, validEmaild을 false로 바꿔서 제출이 막히게 함.
    setInputValue((prevState) => ({ ...prevState, validEmail: false }));
  };

  // -------===========================================
  //이메일 선택 옵션 ======================================
  const EMAIL_DOMAINS = [
    { label: "gmail.com", value: "@gmail.com" },
    { label: "naver.com", value: "@naver.com" },
    { label: "daum.net", value: "@daum.net" },
    { label: "hanmail.net", value: "@hanmail.net" },
    { label: "hotmail.com", value: "@hotmail.com" },
    { label: "yahoo.com", value: "@yahoo.com" },
    { label: "nate.com", value: "@nate.com" },
    { label: "kakao.com", value: "@kakao.com" },
    // { label: "icloud.com", value: "@icloud.com" },
    // { label: "outlook.com", value: "@outlook.com" },
  ];
  //======================================================

  useEffect(() => {
    const selectedObj = EMAIL_DOMAINS.find(
      (item) => item.label === selectedSort
    );
    if (selectedObj) {
      setInputValue((preState) => ({
        ...preState,
        emailAddress: selectedObj.value,
      }));
    }
  }, [selectedSort]);

  const [showEditorModal, setShowEditorModal] = useState(false);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        {modalToggle ? (
          <VerifyEmailModal
            inputValue={inputValue}
            setInputValue={setInputValue}
            setModalToggle={setModalToggle}
          />
        ) : (
          ""
        )}
        <div className={styles.inputArea}>
          <h1 className={styles.title}>Edit User Information</h1>
          <div className={styles.inputSection}>
            <div className={styles.wholeBox}>
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='id'>
                  ID
                </label>
                <span className={styles.alertMessage}>{alertMessage.id}</span>
                <span className={styles.passMessage}>{passMessage.id}</span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.id
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='text'
                  id='id'
                  name='id'
                  value={inputValue.id}
                  onChange={handleInputValue}
                  disabled
                  placeholder={
                    userInfo && userInfo.userInfo && userInfo.userInfo.id
                  }
                />
              </div>
            </div>
            <div className={styles.wholeBox}>
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='currentPw'>
                  Current Password
                </label>
                {/* <RegexInfoBoxForSignup textArray={REGEX_INFO.currentPw} /> */}
                <span className={styles.alertMessage}>
                  {alertMessage.currentPw}
                </span>
                <span className={styles.passMessage}>
                  {passMessage.currentPw}
                </span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.currentPw
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='password'
                  id='currentPw'
                  name='currentPw'
                  value={inputValue.currentPw}
                  onChange={handleInputValue}
                />
                <button className={styles.dupBtn} onClick={authenticate}>
                  본인 인증
                </button>
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='pw'>
                  New Password
                </label>
                <RegexInfoBoxForSignup textArray={REGEX_INFO.pw} />
                <span className={styles.alertMessage}>{alertMessage.pw}</span>
                <span className={styles.passMessage}>{passMessage.pw}</span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.pw
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='password'
                  id='pw'
                  name='pw'
                  value={inputValue.pw}
                  onChange={handleInputValue}
                  onKeyDown={detectCapsLock}
                  disabled={!inputValue.authenticationStatus}
                />
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='pwCheck'>
                  New Password Check
                </label>
                <span className={styles.alertMessage}>
                  {alertMessage.pwCheck}
                </span>
                <span className={styles.passMessage}>
                  {passMessage.pwCheck}
                </span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.pwCheck
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='password'
                  id='pwCheck'
                  name='pwCheck'
                  value={inputValue.pwCheck}
                  onChange={handleInputValue}
                  onKeyDown={detectCapsLock}
                  disabled={!inputValue.authenticationStatus}
                />
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='name'>
                  Fullname
                </label>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.name
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='text'
                  id='name'
                  name='name'
                  value={inputValue.name}
                  onChange={handleInputValue}
                  placeholder={
                    userInfo && userInfo.userInfo && userInfo.userInfo.name
                  }
                  disabled={!inputValue.authenticationStatus}
                />
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='nickname'>
                  Nickname
                </label>
                <RegexInfoBoxForSignup textArray={REGEX_INFO.nickname} />
                <span className={styles.alertMessage}>
                  {alertMessage.nickname}
                </span>
                <span className={styles.passMessage}>
                  {passMessage.nickname}
                </span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.nickname
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='text'
                  id='nickname'
                  name='nickname'
                  value={inputValue.nickname}
                  onChange={handleInputValue}
                  placeholder={
                    userInfo && userInfo.userInfo && userInfo.userInfo.nickname
                  }
                  disabled={!inputValue.authenticationStatus}
                />
                <button
                  className={styles.dupBtn}
                  onClick={
                    inputValue.authenticationStatus ? dupNicknameToggle : null
                  }
                >
                  중복 확인
                </button>
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='emailId'>
                  E-mail
                </label>
                <span className={styles.alertMessage}>
                  {alertMessage.email}
                </span>
                <span className={styles.passMessage}>{passMessage.email}</span>
              </div>
              <div className={styles.itemInputBox}>
                <input
                  className={
                    inputValue.emailId
                      ? `${styles.input}  ${styles.filled}`
                      : styles.input
                  }
                  type='text'
                  id='emailId'
                  name='emailId'
                  value={inputValue.emailId}
                  onChange={handleInputValue}
                  placeholder={
                    userInfo &&
                    userInfo.userInfo &&
                    userInfo.userInfo.email.split("@")[0]
                  }
                  disabled={!inputValue.authenticationStatus}
                />
                <span className={styles.at}>@</span>
                <div className='selectBox'>
                  <div
                    className='pl on'
                    onClick={() =>
                      inputValue.authenticationStatus &&
                      setSortVisible((prev) => !prev)
                    }
                  >
                    {selectedSort}
                    {sortVisible ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                  </div>
                  <ul
                    className={sortVisible ? "listbox  visible" : "listbox"}
                    id='listbox'
                  >
                    {EMAIL_DOMAINS.map((item, index) => (
                      <li key={index} onClick={handleSelectSort}>
                        <div className='list'>{item.label}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={styles.dupBtn}
                  onClick={handleOpenEmailModal}
                >
                  메일 인증
                </button>
              </div>
            </div>
            <div
              className={
                inputValue.authenticationStatus
                  ? styles.wholeBox
                  : `${styles.wholeBox} ${styles.disabled}`
              }
            >
              <div className={styles.itemNameBox}>
                <label className={styles.itemName} htmlFor='profileImage'>
                  Profile Image
                </label>
              </div>
              {/* 커스텀 input file 태그 ============================== */}
              <div className={styles.filebox}>
                <input // 파일의 이름을 보여주는 input태그
                  className={styles.uploadName}
                  id='profileImage'
                  value={
                    uploadLoading ? "업로드중..." : inputValue.profileImage
                  }
                  readOnly
                  disabled
                />
                <button
                  className={styles.dupBtn}
                  onClick={() => setShowEditorModal(true)}
                >
                  사진 선택
                </button>
                {/* 파일 선택 버튼 역할 */}
                {/* <label htmlFor='file'>
                  <span>파일 찾기</span>
                </label>
                {inputValue.authenticationStatus ? (
                  <input // 실제로 업로드를 해주는 input 택그
                    type='file'
                    id='file'
                    onChange={getImgUrl}
                    name='profileImage'
                  />
                ) : (
                  ""
                )} */}
              </div>
              {/* test ============================== */}
            </div>
          </div>
          <button
            className={
              inputValue.pw
                ? submitRequirementsWithPw
                  ? styles.allFilled
                  : styles.submitBtn
                : submitRequirementsWithoutPw
                ? styles.allFilled
                : styles.submitBtn
            }
            onClick={handleSubmit}
            disabled={
              inputValue.pw
                ? !submitRequirementsWithPw
                : !submitRequirementsWithoutPw
            }
          >
            {loading ? (
              <RingLoader
                color='#2D2C25'
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            ) : (
              <span>Save</span>
            )}
          </button>
          <p className={styles.link}>
            변경을 취소하시겠습니까? <Link to='/'> 홈으로 돌아가기</Link>
          </p>
        </div>
        {showEditorModal ? (
          <AvatarEditorModal
            onClose={setShowEditorModal}
            setInputValue={setInputValue}
            setUploadLoading={setUploadLoading}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
