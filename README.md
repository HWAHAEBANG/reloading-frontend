# 1. 프로젝트 개요 (Desciption)

## 1.1. 기능

부동산과 관련된 여러 데이터를 정부 기관의 OpenAPI를 통해 받아와 하나의 차트에 나타내고 이들의 연관관계를 분석함으로써 시사점을 이끌어 냅니다.

부동산 시장의 반등시기를 진단할 수 있는 인사이트와 기준을 제공하며, 기준 충족시 페이지 내에서 신호등과 같은 시각적인 알림을 제공하며, 이메일 알림 서비스로도 해당 정보를 사용자에게 전달합니다.

데이터 최신화 및 메일 알림 서비스는 모두 자동화 되어있어, 가입만 하더라도 알림을 받을 수 있는 편리한 서비스를 제공합니다.

<br/>
<br/>

# 2. 프로젝트 구성

## 2.1. 기술 스택

<br/>
<div align="center">
<div>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
<img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=PostCSS&logoColor=black"/>
</div>

<div>
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=purple">
</div>

</div>

<br/>
<br/>

# 3. 실행환경 (Environment)

## 배포 : https://reloading.co.kr

<br/>

## 개발 환경 : yarn bulid

```
$ yarn
$ yarn start
```

<br/>
<br/>

# 4. 핵심 로직

## 4.1. 여러 데이터를 하나의 데이터에 표현

데이터의 연관 관계를 통해 시사점을 이끌어내기 위해서는 여러 데이터를 동시에 가져오는 것이 필수적입니다. 하지만 데이터의 개수가 매우 많기 때문에 차트로 표현되기 까지 시간이 소요 돼 사용자 경험을 저하시킬 우려가 있으므로, 모든 데이터가 다 받아와 질 때까지 로딩중 UI를 띄워주도록 합니다. 모든 데이터가 다 받아와질 때 까지 로딩을 유지해주는 로직은 다음과 같습니다.

Promise.all 메서드를 사용하여 여러 개의 프로미스(Promise)를 동시에 처리하고, 해당 프로미스들이 모두 완료될 때까지 기다린 후 결과를 반환하는 기능을 제공합니다.

```js
const [haiDataSeoul, setHaiDataSeoul] = useState();
const [housePriceIndexData, setHousePriceIndexData] = useState();
const [baseRateKoreaResponse, setBaseRateKoreaResponse] = useState();

// 중첩배열용
const getAverage = (arr) => {
  const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
  const avg = sum / arr.length;
  return avg;
};

const avg =
  haiDataSeoul &&
  haiDataSeoul.map((item) => [
    item[0],
    parseFloat(getAverage(haiDataSeoul).toFixed(1)),
  ]);
// const average = new Array(haiDataSeoul && haiDataSeoul.length); // 데이터 개수만큼 빈 배열을 만들고
// haiDataSeoul && average.fill(parseFloat(getAverage(haiDataSeoul).toFixed(1))); // 평균으로 다 채운다. 원본을 수정함.
//toFixed를 하면 문자열로 변환되는 것 주의!

useEffect(() => {
  Promise.all([
    axios.get(`https://reloading.co.kr/api/allCharts/hai`, {
      withCredentials: true,
    }),
    axios.get(`https://reloading.co.kr/api/allCharts/housePriceIndexSeoul`, {
      withCredentials: true,
    }),
    axios.get(`https://reloading.co.kr/api/allCharts/baseRateKorea`, {
      withCredentials: true,
    }),
  ])
    .then((responses) => {
      const haiResponse = responses[0];
      const housePriceIndexResponse = responses[1];
      const baseRateKoreaResponse = responses[2];

      setHaiDataSeoul(haiResponse.data.data);
      setHousePriceIndexData(housePriceIndexResponse.data.data);
      setBaseRateKoreaResponse(baseRateKoreaResponse.data.data);

      // 추가 작업을 수행할 수 있습니다.

      setLoading(false);
    })
    .catch((error) => {
      // 에러 처리
      console.error(error);
      setLoading(false);
    });
}, []);
```

<br/>
<br/>

## 4.2. 방문 이력별 팝업 생성

팝업을 쿠키로 관리하는 것이 아닌 계정별로 방문 이력을 저장하고 이를 토대로 맞춤형 팝업을 띄워줍니다. 처음 방문한 사람에게는 '웰컴 팝업'을, 오늘 첫 방문 한 사람이게는 공지사항이나 업데이트 내역 유무에따라 해당 팝업을 보여줍니다.

```js
{
  /* 조건별 생성 팝업  ======================================*/
}
{
  /*세개의 팝업 다 띄울게 없거나, 오늘 첫 방문이 아닐 경우 배경까지 다 없앤다. */
}
{
  (isFirstVisitTotal || hasTodayDataUpdate || hasTodayNotification) &&
  isFirstVisitToday ? (
    <div className={styles.popupBg}>
      {hasTodayDataUpdate ? (
        <DataUpdateLogPopup onClose={setHasTodayDataUpdate} />
      ) : (
        ""
      )}
      {hasTodayNotification ? (
        <ImportantNotificationPopup onClose={setHasTodayNotification} />
      ) : (
        ""
      )}
      {isFirstVisitTotal ? (
        <FirstVisitPopup onClose={setIsFirstVisitTotal} />
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  );
}
{
  /* ==========================================================*/
}
```

## 4.3 회원가입 유효성 검사

회원가입시 중복확인, 정규식 충족의 유효성 검사를 통과해야만 제출버튼이 활성화 되어 제출이 가능합니다.

```js
// 가입 제출 버튼 활성화 조건 ========================================================================================
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

const submitRequirements = // 아래 조건을 모두 충족할 시 제출 버튼 활성화.
  inputValue.id && // 아이디가 입력되었는가?
  inputValue.validId && // 아이디가 정규식에 부합하는가?
  inputValue.nonIdDuplication && // 아이디가 중복되지 않았는가?
  inputValue.pw && // 비밀번호가 입력되었는가?
  inputValue.validPw && // 비밀번호가 정규식에 부합하는가?
  inputValue.pwCheck && // 비밀번호가 입력되었는가?
  inputValue.correctPwCheck && // 비밀번호 확인이 비밀번호화 일치하는가?
  inputValue.name && // 이름이 입력되었는가?
  inputValue.nickname && // 닉네임이 입력되었는는가?
  inputValue.nonNicknameDuplication && // 닉네입이 중복되지 않았는가?
  inputValue.emailId && // 이메일 아이디를 입력하였는가?
  inputValue.emailAddress && // 이메일 도메인 주소를  선택하였는가?
  inputValue.validEmail && // 이메일이 인증되었는가? (추후 리팩토링 예정)
  inputValue.agree; // 정보제공에 동의 하였는가
// ==============================================================================================================
```

<br/>

## 4.4 조건 충족 신호등

특정 데이터들에 한해 데이트터를 실시간으로 비교하여, 시각적인 신호등 형태로 제공합니다. 데이터를 가져와 수치 자체를 특정 기준과 비교하거나, 두개의 데이터를 받아와 서로 비교하거나, 상승세 또는 하락제가 얼마의 기간동안 유지되는지를 제공하기위해, 복잡한 로직을 사용합니다. 해당 로직은 아래와 같습니다.

```js
//======================================
const [transactionVolumeSalesSeoul, setTransactionVolumeSalesSeoul] =
  useState();
const [transactionVolumeJeonseSeoul, setTransactionVolumeJeonseSeoul] =
  useState();
const [priceChangeRateData, setPriceChangeRateData] = useState({});

useEffect(() => {
  setLoading(true);
  Promise.all([
    axios.get(
      `https://reloading.co.kr/api/allCharts/transactionVolumeSalesSeoul`,
      {
        withCredentials: true,
      }
    ),
    axios.get(
      `https://reloading.co.kr/api/allCharts/transactionVolumeJeonseSeoul`,
      {
        withCredentials: true,
      }
    ),
    axios.get(`https://reloading.co.kr/api/allCharts/priceChangeRate`, {
      withCredentials: true,
    }),
  ])
    .then((responses) => {
      const transactionVolumeSalesSeoulResponse = responses[0];
      const transactionVolumeJeonseSeoulResponse = responses[1];
      const priceChangeRateResponse = responses[2];

      // 데이터 할당 =====================================================================

      // 서울 아파트 매매 거래량 =========================================================
      // 서울 아파트 매매 거래량 =========================================================
      setTransactionVolumeSalesSeoul({
        year: new Date(
          transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][0]
        ).getFullYear(),
        month:
          new Date(
            transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][0]
          ).getMonth() + 1, // +1 해주지 않으면 전달이 출력된다.
        value: transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][1],
      });
      // 서울 아파트 전세 거래량 =========================================================
      setTransactionVolumeJeonseSeoul({
        year: new Date(
          transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][0]
        ).getFullYear(),
        month:
          new Date(
            transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][0]
          ).getMonth() + 1, // +1 해주지 않으면 전달이 출력된다.
        value: transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][1],
      });

      // 서울 아파트 주간 매매지수 증감률 =================================================
      const dataList = priceChangeRateResponse.data.data; // 보기 좋기 변수에 재할당
      let lastMinusValueIndex; // 가장 마지막 음수값이 있는 인덱스를 저장할 변수

      // 배열을 뒤에서 부터 돌면서 마지막 음수값을 찾음
      for (let i = dataList.length - 1; i >= 0; i--) {
        if (dataList[i][1] < 0) {
          lastMinusValueIndex = i;
          break; // 음수 값이 발견되면 lastMinusValueIndex에 인덱스를 할당하고 반복문 종료
        } else {
          lastMinusValueIndex = -1; // 사실상 도달할 일이 없는 else문.
        }
      }

      let lastPlusValueIndex; // 가장 마지막 양수값이 있는 인덱스를 저장할 변수

      // 배열을 뒤에서 부터 돌면서 마지막 양수값을 찾음
      for (let i = dataList.length - 1; i >= 0; i--) {
        if (dataList[i][1] > 0) {
          lastPlusValueIndex = i;
          break; // 양수 값이 발견되면 lastMinusValueIndex에 인덱스를 할당하고 반복문 종료
        } else {
          lastPlusValueIndex = -1; // 사실상 도달할 일이 없는 else문.
        }
      }

      // 상승과 하락이 몇주 연속 진행되었나를 상태에 객체로 저장 (인덱스에서 인덱스를 빼주는 개념이기 때문에 배열 길이에서 1 빼주는 것임)
      setPriceChangeRateData({
        uptrend: dataList.length - 1 - lastMinusValueIndex,
        downtrend: dataList.length - 1 - lastPlusValueIndex,
      });

      setLoading(false);
    })
    .catch((error) => {
      // 에러 처리
      console.error(error);
      setLoading(false);
    });
}, []);

// ======================================================================
// 데이터 조건문 =================================================
const [isConditionMet1, setIsConditionMet1] = useState(false);
const [isConditionMet2, setIsConditionMet2] = useState(false);
const [isConditionMet3, setIsConditionMet3] = useState(false);

useEffect(() => {
  if (
    !transactionVolumeSalesSeoul ||
    !transactionVolumeJeonseSeoul ||
    !priceChangeRateData.uptrend /* 증감률 추가 */
  )
    return;
  // 매매 거래량이 10000을 초과하는가
  if (transactionVolumeSalesSeoul.value >= 10000) {
    setIsConditionMet1(true);
  } else {
    setIsConditionMet1(false);
  }

  // 매매 거개량이 전세거래량을 추월했는가?
  if (transactionVolumeSalesSeoul.value >= transactionVolumeJeonseSeoul.value) {
    setIsConditionMet2(true);
  } else {
    setIsConditionMet2(false);
  }

  // 증감율의 상승기조가 1년 이상 지속되었는가?
  if (priceChangeRateData.uptrend >= 52) {
    setIsConditionMet3(true);
  } else {
    setIsConditionMet3(false);
  }
}, [
  transactionVolumeSalesSeoul,
  transactionVolumeJeonseSeoul,
  priceChangeRateData.uptrend,
  priceChangeRateData.downtrend,
]);
```

<br/>
<br/>

# 5. 버그

- 추가적으로 확인된 버그 없음

  <br/>
  <br/>

# 6. 향후 발전사항

- 회원탈퇴 기능 구현
- 차트 마다 댓글란을 구현하여 회원끼리 소통할 수 있도록 개선.
- 알림 메일을 '조건 충족 여부'만 받을지,'데이터 업데이트 여부'까지 받을 지 선택할 수 있도록 개선.
- 시장 분위기 파악 게이지 차트 개설.
  <br/>
  <br/>

# 7. 프로그램 작성자 및 도움을 준 사람

- 방충림 (개인프로젝트)
  <br/>
  <br/>

# 8. 버전 (업데이트 소식)

- 0.1.2 - 회원 가입 관련 버그 수정 ( 2023.07.01 )
- 0.1.1 - 개발단계 버그 수정 테스트 릴리즈 ( 2023.06.04 )
- 0.1.0 - 개발단계 테스트 릴리즈 ( 2023.06.03 )

  <br/>
  <br/>

# 9. 저작권 및 사용권 정보

- 참고용 유튜브 동영상돠 차트해석 인사이트의 저작권은 (주)월급쟁이 부자들 에 있습니다.
  <br/>
  <br/>
