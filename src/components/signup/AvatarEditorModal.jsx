import React, { useState, useRef, useCallback } from "react";
import styles from "./AvatarEditorModal.module.css";
// import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { uploadImage } from "../../api/cloudynary";
//=====================================
import Cropper from "react-easy-crop";
// import ImgDialog from "./ImgDialog";
// import getCroppedImg from "./cropImage";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

export default function AvatarEditorModal({
  onClose,
  setUploadLoading,
  setInputValue,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 저장하는 코드로 변형
  const showCroppedImage = useCallback(async () => {
    if (!imageSrc) return;
    try {
      onClose(false);
      setUploadLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      // console.log("donee", { croppedImage });
      // setCroppedImage(croppedImage); // 불필요
      const fileName = "uploaded_image.jpg"; // 업로드할 파일 이름
      const file = await convertBlobUrlToFile(croppedImage, fileName);
      const getUrl = await uploadImage(file);
      setInputValue((prevState) => ({ ...prevState, profileImage: getUrl }));
      setUploadLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  // Blob URL을 File 객체로 변환하는 함수
  function convertBlobUrlToFile(blobUrl, fileName) {
    return fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => new File([blob], fileName));
  }

  //==========================================================================================
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      try {
        // apply rotation if needed
        const orientation = await getOrientation(file);
        const rotation = ORIENTATION_TO_ANGLE[orientation];
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
        }
      } catch (e) {
        console.warn("failed to detect the orientation");
      }

      setImageSrc(imageDataUrl);
    }
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  //==========================================================================================
  const [maskColorBlack, setMaskColorBlack] = useState(true);
  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.inner}>
          <p className={styles.title}>사이즈 조절</p>
          <p className={styles.helpText}>
            사진을 <span>드래그하여 위치 조절</span>이 가능합니다.
            <br />
            가이드 마스크에 따라 얼굴을 맞추시면 가장 좋습니다.
          </p>
          {/* 커스텀 input file 태그 ============================== */}
          <div className={styles.filebox}>
            <label htmlFor='file'>
              {/* 파일 선택 버튼 역할 */}
              <span>파일 선택</span>
            </label>
            <input // 실제로 업로드를 해주는 input 택그
              type='file'
              id='file'
              onChange={onFileChange}
              name='profileImage'
            />
            {/* 모달 컨포넌트는 하단에 있음 */}
          </div>
          {/* test ============================== */}
          <div className={styles.cropperSection}>
            <div className={styles.cropperContainer}>
              {/* ================================================================================================== */}
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={3 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
              {/* ================================================================================================== */}
            </div>
            {maskColorBlack ? (
              <>
                <div className={styles.whiteGuideHead}></div>
                <div className={styles.whiteGuideBody}></div>
              </>
            ) : (
              <>
                <div className={styles.blackGuideHead}></div>
                <div className={styles.blackGuideBody}></div>
              </>
            )}
          </div>

          <p>
            가이드 마스크 색상 &nbsp;&nbsp;
            <input
              type='checkbox'
              defaultChecked
              onChange={() => {
                setMaskColorBlack((prev) => !prev);
              }}
            />
          </p>

          <div className={styles.controler}>
            <p>확대/축소</p>
            <input
              name='zoom'
              type='range'
              // onChange={rotateScale}
              min='1'
              max='3'
              step='0.1'
              defaultValue='0'
              value={zoom}
              aria-labelledby='Zoom'
              onChange={(e) => setZoom(e.target.value)}
            />
            <p>회전</p>
            <input
              name='rotation'
              type='range'
              // onChange={rotateScale}
              min='0'
              max='360'
              step='1'
              defaultValue='0'
              value={rotation}
              aria-labelledby='Rotation'
              onChange={(e) => setRotation(e.target.value)}
            />
          </div>
          <img src={croppedImage} alt='' />
          <div className={styles.btnList}>
            <button className={styles.btn} onClick={showCroppedImage}>
              저장
            </button>
            <button className={styles.btn} onClick={() => onClose(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
