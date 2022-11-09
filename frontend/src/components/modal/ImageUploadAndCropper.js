import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
  } from "@chakra-ui/react";
  import React from "react";
  import { Crop } from "../Cropper/Cropper";
  
  const ImageUploadAndCropper = ({
    file,
    isOpen,
    onClose,
    onSuccess,
  }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crop Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Crop file={file} fromChild={onSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  export default ImageUploadAndCropper;
  