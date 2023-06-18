import React, { useState, useEffect } from "react";
import styles from "./TopBar.module.css";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { FaHandshake, FaRegHandshake } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfoAction, logoutAction } from "../../redux";
import axios from "axios";

export default function TopBar({
  showNav,
  setShowNav,
  setVisibleSuggestModal,
}) {
  // 로크아웃 버튼 클릭시 =============================================================================================
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // 로직상 사용될 일 없지만 만일 대비
  const enter = () => {
    navigate("/users/login");
  };

  const logout = () => {
    axios
      .post(`https://reloading.co.kr/api/users/logout`, {
        withCredentials: true,
        data: {
          presentId: userInfo.userInfo.id,
        },
      })
      .then((response) => {
        dispatch(logoutAction());
        dispatch(clearUserInfoAction());
        navigate("/users/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // ================================================================================================================

  return (
    <div className={styles.container}>
      <div
        className={styles.navBtn}
        onClick={() => setShowNav((prev) => !prev)}
      >
        {showNav ? <IoMdArrowDropleft /> : <IoMdArrowDropright />}
      </div>
      <div className={styles.logoBox}>
        <Link to='/'>
          <h2 className={styles.logo1}>RE:LOADING</h2>
        </Link>
        {/* <RxCross2 className={styles.crossIcon} /> */}
        <FaHandshake className={styles.crossIcon} />
        <a href='https://www.weolbu.com/' target='_blank'>
          <img
            className={styles.logo2}
            src={process.env.PUBLIC_URL + "/image/logo.png"}
            alt='월부로고'
          />
        </a>
      </div>
      <div>
        <button
          className={styles.suggestBtn}
          onClick={() => {
            setVisibleSuggestModal(true);
          }}
        >
          개발자에게 제안
        </button>

        {isLoggedIn.isLoggedIn ? (
          <button className={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        ) : (
          <button className={styles.logoutBtn} onClick={enter}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
