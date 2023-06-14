import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import {
  BsFillBellFill,
  BsYoutube,
  BsFillChatLeftHeartFill,
} from "react-icons/bs";
import { FaUserCircle, FaUserEdit } from "react-icons/fa";
import { IoIosCafe, IoIosHome, IoIosPeople } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { ImNewspaper } from "react-icons/im";
import {
  AiOutlineBarChart,
  AiFillNotification,
  AiTwotoneNotification,
} from "react-icons/ai";
import { RiMailCheckLine, RiMailCloseLine } from "react-icons/ri";
import { MdFiberNew } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction, clearUserInfoAction } from "../../redux";
import axios from "axios";
import useSound from "use-sound";

export default function NavBar({
  showNav,
  setShowNav,
  setVisibleSuggestModal,
}) {
  const [autoClose, setAutoClose] = useState(true);

  const handleChecked = (e) => {
    setAutoClose(e.target.checked);
  };

  //autoClose가 true일 때, 버튼누르면 setShowNav(false)로
  const handleEnter = (e) => {
    const textContent = e.currentTarget.querySelector("p")
      ? e.currentTarget.querySelector("p").textContent
      : "nothing";

    if (textContent === "All Charts" || textContent === "My Charts") {
      setTimeout(() => {
        grow();
      }, 1000);
    }
    move();
    autoClose && setShowNav(false);
  };

  // 로그아웃 =====================
  const navigate = useNavigate();

  const enter = () => {
    navigate("/users/login");
  };

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const logout = () => {
    axios
      .post(`http://reloading.co.kr/api/users/logout`, {
        method: "POST",
        withCredentials: true,
        data: {
          presentId: userInfo.userInfo.id,
        },
      })
      .then((Response) => {
        dispatch(logoutAction());
        dispatch(clearUserInfoAction());
        navigate("/users/login");
      });
  };

  const [toggleEmailBtn, setToggleEmailBtn] = useState(
    userInfo.userInfo.email_service_enabled
  );

  const handleClickEmailUnactive = () => {
    axios
      .post(`http://reloading.co.kr/api/users/emailServiceDisabled`, {
        method: "POST",
        withCredentials: true,
        data: {
          presentId: userInfo.userInfo.id,
        },
      })
      .then((Response) => {
        setToggleEmailBtn(false);
        alert("이메일 알림 서비스가 비활성화 되었습니다.");
        //엑세트 토큰 새로 받아와야하나? 정보수정에서 어떻게 했었지? ui에는 티 안나니까 상관없나?상관없을듯
      });
  };

  const handleClickEmailActive = () => {
    axios
      .post(`http://reloading.co.kr/api/users/emailServiceEnabled`, {
        method: "POST",
        withCredentials: true,
        data: {
          presentId: userInfo.userInfo.id,
        },
      })
      .then((Response) => {
        setToggleEmailBtn(true);
        alert(
          "이메일 알림 서비스가 활성화 되었습니다. 최신 데이터 업데이트 시 이메일로 변동 내역을 전송해드립니다."
        );
        //엑세트 토큰 새로 받아와야하나? 정보수정에서 어떻게 했었지? ui에는 티 안나니까 상관없나?상관없을듯
      });
  };

  const [visitorCnt, setVisitorCnt] = useState();
  useEffect(() => {
    axios
      .get(`http://reloading.co.kr/api/users/visitorCnt`, {
        withCredentials: true,
      })
      .then((response) => {
        setVisitorCnt(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // sound ======
  const [move] = useSound("/sounds/move.wav", { volume: 1 });
  const [grow] = useSound("/sounds/grow.wav", { volume: 1 });
  // sound ======
  return (
    <div
      className={`${styles.mainContainer} ${
        showNav ? styles.innerContainer : ""
      } scrollBar`}
    >
      <div className={styles.userInfoSection}>
        <div className={styles.visitCntBox}>
          <p className={styles.visitCntTitle}>VISITORS</p>
          <p className={styles.visitCnt}>
            <span>TODAY </span>
            {visitorCnt && visitorCnt.today}&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>TOTAL </span>
            {visitorCnt && visitorCnt.total}
          </p>
        </div>
        <div className={styles.userInfo}>
          {
            /* userInfo.avatar */ true ? (
              <div className={styles.avatarContainer}>
                <img
                  className={styles.avatar}
                  src={
                    (userInfo &&
                      userInfo.userInfo &&
                      userInfo.userInfo.profile_image) ||
                    process.env.PUBLIC_URL + "/image/unknown.png"
                  }
                  // src={process.env.PUBLIC_URL + "/image/HHB.jpg"}
                  alt='프로필 사진'
                />
              </div>
            ) : (
              <FaUserCircle className={styles.alternativeAvartarIcon} />
            )
          }
          <div>
            <p>
              환영합니다.
              <br />
              <span>
                {userInfo && userInfo.userInfo && userInfo.userInfo.nickname}
              </span>
              님
            </p>
          </div>
        </div>
        <div className={styles.buttonList}>
          <Link to='/users/editUserInfo'>
            <div onClick={handleEnter}>
              &nbsp;
              <FaUserEdit />
            </div>
          </Link>
          {toggleEmailBtn ? (
            <div onClick={handleClickEmailUnactive}>
              <RiMailCheckLine />
            </div>
          ) : (
            <div onClick={handleClickEmailActive}>
              <RiMailCloseLine />
            </div>
          )}
        </div>
      </div>
      <hr />
      <label>
        <span className={styles.toggleName}>자동 닫기</span>
        <input
          onChange={handleChecked}
          defaultChecked={autoClose}
          role='switch'
          type='checkbox'
        />
      </label>
      <div className={styles.menuSection}>
        <Link to='/'>
          <div className={styles.menuList} onClick={handleEnter}>
            <MdSpaceDashboard />
            <p>Dashboard</p>
          </div>
        </Link>
        <Link to='/aboutUs'>
          <div className={styles.menuList} onClick={handleEnter}>
            <IoIosPeople />
            <p>About Us</p>
          </div>
        </Link>
        <Link to='/allCharts'>
          <div className={styles.menuList} onClick={handleEnter}>
            <AiOutlineBarChart />
            <p>All Charts</p>
          </div>
        </Link>
        <Link to='/myCharts'>
          <div className={styles.menuList} onClick={handleEnter}>
            <BsFillChatLeftHeartFill />
            <p>My Charts</p>
          </div>
        </Link>
        <Link to='/topicNews'>
          <div className={styles.menuList} onClick={handleEnter}>
            <ImNewspaper />
            <p>Topic News</p>
          </div>
        </Link>
        <Link to='/notification'>
          <div className={styles.menuList} onClick={handleEnter}>
            <AiFillNotification />
            <p>Notification</p>
            <span className={styles.newContainer}>
              {/*박스 안커지게 하면서 위치 잡아주기 위해존재 */}
              {/* 업데이트 기준 로직 구현후 리팩토링 예정. 일단은 항상 떠있게 하기 */}
              <MdFiberNew className={styles.new} />
            </span>
          </div>
        </Link>
      </div>
      <button
        className={styles.suggestBtn}
        onClick={() => {
          setVisibleSuggestModal(true);
        }}
      >
        개발자에게 제안
      </button>
      <dir className={styles.otherLinkSection}>
        <div className={styles.linkList} onClick={handleEnter}>
          <IoIosHome />
          <a href='https://www.weolbu.com/' target='_blank'>
            공식 홈페이지
          </a>
        </div>
        <div className={styles.linkList} onClick={handleEnter}>
          <BsYoutube />
          <a href='https://www.youtube.com/@weolbu_official' target='_blank'>
            월급쟁이 부자들TV
          </a>
        </div>
        <div className={styles.linkList} onClick={handleEnter}>
          <IoIosCafe />
          <a href='https://cafe.naver.com/wecando7' target='_blank'>
            월급쟁이 부자들 네이버 카페
          </a>
        </div>
      </dir>
      {isLoggedIn ? (
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      ) : (
        <button className={styles.logoutBtn} onClick={enter}>
          Login
        </button>
      )}
      {/* <Background /> */}
    </div>
  );
}
