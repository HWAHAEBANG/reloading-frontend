import React from "react";
import styles from "./AboutUs.module.css";
import SpiderWebDemo from "../ui/SpiderWebDemo";
import { useInView } from "react-intersection-observer";

export default function AboutUs() {
  const { ref: page1Ref, inView: page1IsVisible /* entry */ } = useInView();
  const { ref: page2Ref, inView: page2IsVisible /* entry */ } = useInView();
  const { ref: page3Ref, inView: page3IsVisible /* entry */ } = useInView();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.title}>ABOUT US</div>
        <div className={`${styles.inner} scrollBar`}>
          <div className={styles.wholeContentsArea}>
            <div className={styles.pageIntroArea1}>
              <div className={styles.imgSection1}>
                <img
                  src={process.env.PUBLIC_URL + "/image/sketch1.png"}
                  alt='city'
                />
              </div>
              <div className={styles.textSection1} ref={page1Ref}>
                <p
                  className={`${styles.subTitle1} ${
                    page1IsVisible ? styles.animateextend1 : ""
                  }`}
                >
                  기회는 다시 돌아온다. <br />그 날을 위해 <span>"재장전"</span>
                  하라!
                </p>
                <p
                  className={`${styles.text1} ${
                    page1IsVisible ? styles.animateextend2 : ""
                  }`}
                >
                  부동산 시장에서 한 차례의 폭등장이 끝이나고, 하락장에
                  접어들었습니다. <br />
                  부동산 시장이 긴 싸이클을 가지고 등락을 반복하듯, 반등의
                  기회는 또 다시 돌아올 것 입니다.
                  <br />
                  <span>"Reloading"</span>은 우리 말로 <span>"재장전"</span>을
                  의미합니다. <br />
                  재장전이 되어있는 사람만이 돌아오는 기회를 잡을 수 있을 것
                  입니다.
                  <br />
                  <span>RE:LOADING</span>은 부동산 시장의 상황을 진단할 수 있는
                  다양한 데이터를 분석하고 시각화하여 제공함으로써 재장전을
                  지원하겠습니다.
                </p>
                <p
                  className={`${styles.postScript1} ${
                    page1IsVisible ? styles.animateextend3 : ""
                  }`}
                >
                  <span>RE:LOADING</span> 은&nbsp;
                  <img
                    className={styles.logo2}
                    src={process.env.PUBLIC_URL + "/image/logo.png"}
                    alt='월부로고'
                  />
                  &nbsp;의 <span>팬 페이지</span>로서, 모든 소스는
                  <span> 월부 회원</span>에게 <span>무료</span>로 제공됩니다.
                  <br />
                  페이지의 모든 내용은 월급쟁이 부자들의 공식 Youtube영상에
                  근거하고 있으며, <span>저작권은 월급쟁이 부자들에 있음</span>
                  을 알려드립니다.
                </p>
              </div>
            </div>
            <div className={styles.pageIntroArea2}>
              <div className={styles.textSection2} ref={page2Ref}>
                <p
                  className={`${styles.subTitle2}  ${
                    page2IsVisible ? styles.animateleft1 : ""
                  }`}
                >
                  데이터는 항상 말하고있다.
                  <br />
                  귀를 기울여라!
                </p>
                <p
                  className={`${styles.text2}  ${
                    page2IsVisible ? styles.animateleft2 : ""
                  }`}
                >
                  부동산 시장의 상태를 진단할 수 있는 다양한 지표들이 있습니다.
                  <br />
                  <span>RE:LOADING</span>은 부동산 시장의 이 지표들을 실시간으로
                  추적하여
                  <br />
                  차트로 표현하고, 결합하여 유의미한 결론은 도출합니다.
                  <br />
                  이를 통해 사용자가 최적의 매수 시기를 판단할 수 있도록
                  조력합니다.
                </p>
                <p
                  className={`${styles.alertScript2} ${
                    page2IsVisible ? styles.animateleft3 : ""
                  }`}
                >
                  시장은 수많은 요인이 복합적으로 작용합니다.
                  <br /> RE:LOADING 의 모든 데이터는 반드시 보조지표로만
                  활용하시기 바랍니다.
                </p>
              </div>
              <div className={styles.imgSection2}>
                <SpiderWebDemo />
              </div>
            </div>
            <div className={styles.pageIntroArea3} ref={page3Ref}>
              <div className={styles.imgSection3}>
                <img
                  src={process.env.PUBLIC_URL + "/image/sketch2.png"}
                  alt='city'
                />
              </div>
              <div className={styles.textSection3}>
                <p
                  className={`${styles.subTitle3} ${
                    page3IsVisible ? styles.animateright1 : ""
                  }`}
                >
                  시장은 예측할 수 없다. <br />
                  예견하지 말라.
                </p>
                <p
                  className={`${styles.text3} ${
                    page3IsVisible ? styles.animateright2 : ""
                  }`}
                >
                  시장은 예측할 수 없습니다.
                  <br />
                  시장반등의 <span> “신호”</span>가 아닌 시장반등의
                  <span> “증상”</span>을 진단할 수 있을 뿐입니다.
                  <br />
                  <span>RE:LOADING</span>은 시장의 미래를 예측하는 것이 아닌
                  현재의 시황을 분석하여, <br />
                  투자판단에 유용한 정보를 제공합니다.
                </p>
                <p
                  className={`${styles.alertScript3}  ${
                    page3IsVisible ? styles.animateright3 : ""
                  }`}
                >
                  투자는 투자자 개인의 판단에 따라 진행되어야하며, 관련한 모든
                  책임은 투자자에게 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className={styles.pageIntroArea2}>
<div className={styles.imgSection2}>
  <SpiderWebDemo />
</div>
<div className={styles.textSection2}>
  <p className={styles.subTitle2}>
    부동산 시장의 상태를 진단할 수 있는 다양한 지표들이 있습니다.
  </p>
  <p>
    <span>RE:LOADING</span>은 부동산 시장의 이 지표들을 실시간으로 추적하여 도표로 표현하고, 결합하여 유의미한 결론은 도출하며, 
    <br/>이를 통해 사용자가 최적의 매수 시기를 판단할 수 있도록 조력합니다.
</div>
</div>
<div className={styles.pageIntroArea3}>
<div className={styles.imgSection3}>
  <SpiderWebDemo />
</div>
<div className={styles.textSection3}>
  <p className={styles.subTitle3}>
    기회는 다시 돌아온다. <br />그 날을 위해 <span>"재장전"</span>
    하라!
  </p>
  <p>
  
  </p>
</div>
</div> */
}
