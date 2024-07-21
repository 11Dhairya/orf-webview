import React, { useEffect, useRef } from "react";
import "./ErrorModal.css";

function ErrorModal({ handleShowModal, isModalShow, data, postData }) {
  const ref = useRef();

  useEffect(() => {
    if (isModalShow) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isModalShow]);

  const closeModal = () => {
    ref.current?.close();
    handleShowModal(false);
  };

  const handleAction = () => {
    ref.current?.close();
    handleShowModal(false);
    postData(data.type);
  };

  return (
    <>
      <dialog ref={ref} id="error-modal" className="error-modal-dialog">
        <p className="error-modal-message">{data.message}</p>
        <div className="error-modal-button-container">
          {data.okButton && (
            <button onClick={handleAction} className="error-modal-submit-btn">
              {data.okButton}
            </button>
          )}
          {data.yesButton && (
            <button onClick={handleAction} className="error-modal-submit-btn">
              {data.yesButton}
            </button>
          )}
          {data.noButton && (
            <button onClick={closeModal} className="error-modal-close-btn">
              {data.noButton}
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}

export default ErrorModal;
