import React, { useEffect, useRef } from "react";
import "./ErrorModal.css";

function ErrorModal({ handleShowModal, isModalShow, data, postData }) {
  const ref = useRef();
  const modal = document.querySelector("#modal");
  // if (isModalShow) {
  //     modal.showModal()
  // }

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
      <dialog ref={ref} id="modal" className="dialog">
        <p>{data.message}</p>
        <div className="col-md-12 mt-4 mb-4 gap-3 d-flex justify-content-center button-container">
          {data.okButton && (
            <button onClick={handleAction} className="diglog-submit-btn">
              {data.okButton}
            </button>
          )}
          {data.yesButton && (
            <button onClick={handleAction} className="diglog-submit-btn">
              {data.yesButton}
            </button>
          )}
          {data.noButton && (
            <button onClick={closeModal} className="dialog-close-btn">
              {data.noButton}
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}
export default ErrorModal;
