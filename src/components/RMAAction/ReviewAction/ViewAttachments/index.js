import React, { useState, useEffect } from "react";
import ReturnsSrv from "../../../../services/returns_srv";
import BouncyLoader from "../../../Shared/components/Loaders/BouncyLoader";
import FilesDisplay from "./FilesDisplay";
import ImageModal from "../../../Shared/components/ImageModal";

export default function ViewAttachments(props) {
  const [returnFiles, setReturnFiles] = useState({
    data: null,
    loading: false,
    error: "",
  });
  const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleToggleImagePreview = () => {
    setShowModal(!showModal);
  };
  const showImagePreview = (url) => {
    setPreviewUrl(url);
    handleToggleImagePreview();
  };
  const getFiles = () => {
    const returnsSrv = new ReturnsSrv(props.auth);
    setReturnFiles({ data: null, loading: true, error: "" });
    returnsSrv
      .getAllFiles(props.rmaId)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          setReturnFiles({ data: result, loading: false });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setReturnFiles({
          data: null,
          loading: false,
          error: "Load Product Error:" + error.message,
        });
      });
  };

  useMountEffect(getFiles);

  return (
    <div>
      <ImageModal
        showImage={showModal}
        toggleImagePreview={handleToggleImagePreview}
        imageUrl={previewUrl}
      >
        {" "}
      </ImageModal>
      {returnFiles.loading ? (
        <div className="center-child">
          <BouncyLoader />
        </div>
      ) : (
        <>
          {returnFiles.data ? (
            <FilesDisplay
              files={returnFiles.data}
              showPreview={showImagePreview}
            ></FilesDisplay>
          ) : null}
        </>
      )}
    </div>
  );
}
