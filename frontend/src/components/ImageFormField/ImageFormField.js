import { Center, useDisclosure } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import ImageUploadAndCropper from "../modal/ImageUploadAndCropper";
// import '../../pages/selectDoctor/selectDoctor.css'


const ImageFormField = ({ onSuccess, image, disabled, error }) => {
  const [img, setImg] = useState(image);
  const fileRef = useRef(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState();
  return (
    <>
        <Center>
          <div className="imgUpload" style={{zIndex: '1'}}>
            <Center
              verticalAlign={"center"}
              height={"100px"}
              width={"100px"}
              cursor={!disabled ? "pointer" : "not-allowed"}
              // backgroundColor={img ? "transparent" : "gray.100"}
              backgroundImage={img}
              backgroundSize={"cover"}
              onClick={() => {
                if (!disabled) fileRef?.current?.click();
              }}
              className='croppedImage'
              style={{zIndex: ''}}
            >

              {!disabled && <img src="/gimg.png" style={{ width: '70px', zIndex: '-1' }} alt='logo' />}
              <input
                hidden
                ref={fileRef}
                name="file"
                type="file"
                accept="image/*"
                disabled={isOpen}
                onChange={(event) => {
                  if (event.target.files && event.target.files.length) {
                    setSelectedFile(event.target.files[0]);
                    onOpen();
                  }
                }}
              />
            </Center>
          </div>
          <p style={{ color: "red" }}>{error}</p>
        </Center>
        {/* <p className="imgName">Choose Image</p> */}
      {isOpen && (
        <ImageUploadAndCropper
          file={selectedFile}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={(data) => {
            console.log(data);
            setImg((data || {}).img);
            onSuccess(data);
            onClose();
          }}
        />
      )}
    </>
  );
};
export default ImageFormField;
