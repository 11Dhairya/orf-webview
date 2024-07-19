import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header/Header';
import TextBox from '../../components/TextBox/TextBox';
import TextSize from '../../components/TextSize/TextSize';
import Recording from '../../components/Recording/Recording';
import Loader from "react-js-loader";
import RecordingPlaybackPopup from '../../components/RecordingPlaybackPopup/RecordingPlaybackPopup';
import RetakeWarningPopup from '../../components/RetakeWarningPopup/RetakeWarningPopup';
import './temp.css';


import SubmitModal from '../../components/SubmitModal/Submit';
import ErrorModal from "../../components/ErrorModal/ErrorModal";

const VachanAssessment = () => {
  const color = "#386af6";
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showPlaybackPopup, setShowPlaybackPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoStartRecordingModal, setAutoStartRecordingModal] = useState(false);
  const [isErrorModalShow, setIsErrorModalShow] = useState(false);
  const [modalObj, setModalObj] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [assessmentTextData, setAssessmentTextData] = useState({});
  const [textSize, setTextSize] = useState('14px');
  const [isLoader, setIsLoader] = useState(true);
  const [audioSrc, setAudioSrc] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const countdownInterval = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  const botApiUrl = import.meta.env.VITE_BOT_BASE_URL;
  const getAssessmentTextEndpoint = import.meta.env.VITE_BOT_GET_ASSESSMENT_TEXT_ENDPOINT;
  const submitAssessmentDataEndpoint = import.meta.env.VITE_BOT_ASSESSMENT_ENDPOINT;
  const minSecondsToRecord = import.meta.env.VITE_MIN_SEC_TO_RECORD;
  const minSecTOLoadSubmittedData = import.meta.env.VITE_MIN_SEC_TO_LOAD_SUBMITTED_DATA;
  const warningTimeToRecord = import.meta.env.VITE_WARNING_TIME_TO_RECORD;
  const audioFormat = import.meta.env.VITE_AUDIO_FORMAT;

  const test = async () => {
    let payload = null;
    const searchString = window.location.search;
    payload = searchString.split("token=")[1];
    // BotExtension.getPayload((payloadData) => {
    //   payload = payloadData;
    // });
    while (payload === null) {
      await delay(0.7);
    }
    if (payload !== null) return payload;
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(1);
      await getPayloadData();
    };
    fetchData();
  }, []);

  const getPayloadData = async () => {
    try {
      setIsLoader(false);
      // const payloadValue = await test();
      let payloadValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjoic3R1ZGVudF9pZF8xIiwibW9kZSI6ImFzc2Vzc21lbnQiLCJzdHVkZW50X25hbWUiOiJkaGFpcnlhIiwidGVhY2hlcl9pZCI6InRlYWNoZXJfaWRfMSIsImFwcF9sYW5ndWFnZSI6ImVuIiwiYXNzZXNzbWVudF9sYW5ndWFnZSI6ImVuIiwiZ3JhZGUiOjEsIm9yZ2FuaXNhdGlvbl9pZCI6Im9yZ19pZF8xIiwiZGV2aWNlX2lkIjoiVTJGc2RHVmtYMS91bDlCdUJDNFdsZVVmWGNiTVVYdzFKVStxV3dldFhndz0iLCJsYXQiOjEwLCJsb25nIjoxMCwic2Nob29sX2lkIjoic2Nob29sX2lkXzEiLCJvcmZfYXVkaW9fdGVzdF92YWxpZGF0aW9uX3ZhbHVlIjoxLCJkYXRlIjoiMTYtMDctMjAyNCIsImlhdCI6MTcyMTA3NzMxNH0.EJkEPtxBXEYIAohp0etgrLRX9vgC40eUDDDAqKlPXA4";
      console.log("getPayloadData, payloadValue = ", payloadValue);
      setIsLoader(false);
      if (payloadValue !== null) {
        // await handleCreateSession(payloadValue);
        localStorage.setItem("Tpayload", payloadValue);
        const textData = localStorage.getItem("TtextData");

        if (!textData) 
          await getAssessmentText(payloadValue);
        else 
          setAssessmentTextData(textData);

      } else {
        const obj = {
          message: "Session expired due to inactivity.",
          okButton: "ok",
        };
        setModalObj(obj);
        setIsErrorModalShow(true);
      }
    } catch (error) {
      const obj = {
        message: "Session expired due to inactivity.",
        okButton: "ok",
      };
      setModalObj(obj);
      setIsErrorModalShow(true);
    }
  };

  const handleCreateSession = async (payloadValue) => {
    try {
      const res = await axios.post(`${botApiUrl}/create-session?token=${payloadValue}`, {});
      localStorage.setItem("Tpayload", payloadValue);
      if (res.status === 200) {
      }
    } catch (error) {
      const obj = {
        message: error.response.data.message,
        okButton: "ok",
      };
      setModalObj(obj);
      setIsErrorModalShow(true);
    }
  };

  const getAssessmentText = async (payloadValue) => {
    try {
      const config = {
        method: 'get',
        url: `${botApiUrl}/${getAssessmentTextEndpoint}`,
        params: { token: payloadValue },
        data: null,
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await axios(config);
      if (!response.data || !response.data.textData) throw new Error('Incorrect data received from orf bot, response.data = ', response.data);
      
      const textData = response.data.textData;
      // textData = { textId, text, language }

      localStorage.setItem("TtextData", textData);
      setAssessmentTextData(textData);

    } catch (error) {
      const obj = {
        message: error.response.data.message,
        okButton: "ok",
      };
      setModalObj(obj);
      setIsErrorModalShow(true);
    }
  };

  useEffect(() => {
    if (autoStartRecordingModal) {
      startCountdown();
    }
  }, [autoStartRecordingModal]);

  const startCountdown = () => {
    setCountdown(warningTimeToRecord);
    countdownInterval.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval.current);
          handleStartRecording();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
  const handleStartRecording = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          audioChunks.current = [];
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };
          mediaRecorder.current.onstop = () => {
            const blob = new Blob(audioChunks.current, { type: `audio/${audioFormat}` });
            setAudioBlob(blob);
            setAudioSrc(URL.createObjectURL(blob));
            setIsRecorded(true);
            setShowPlaybackPopup(true);
            setIsRecording(false);
            clearInterval(timerInterval.current);
          };
          mediaRecorder.current.start();
          setIsRecording(true);
          setTimer(0);
          timerInterval.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
          }, 1000);
        })
        .catch((error) => {
          const obj = {
            message: "The following error occurred in start/stop recording " + error,
            okButton: "ok",
          };
          setModalObj(obj);
          setIsErrorModalShow(true);
        });
    }
  };

  const handleStopRecording = () => {
    if (isRecording && timer>0) {
      mediaRecorder.current.stop();
      clearInterval(timerInterval.current);
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setShowDeletePopup(false);
    setShowPlaybackPopup(false);
    setShowWarningPopup(true);
  };

  const handleConfirmRetake = () => {
    setAutoStartRecordingModal(true);
    setShowWarningPopup(false);
    setAudioSrc(null);
    setTimer(0);
    setIsRecorded(false);
  };

  const handleCancelRetake = () => {
    setShowPlaybackPopup(true);
    setShowWarningPopup(false);
    setAutoStartRecordingModal(false);
  };

  const showDeleteWarning = () => {
    setShowWarningPopup(true);
    setShowDeletePopup(true);
    setShowPlaybackPopup(false);
  };

  const handleDeleteRecording = () => {
    setAutoStartRecordingModal(false);
    setShowWarningPopup(false);
    setAudioSrc(null);
    setTimer(0);
    setIsRecorded(false);
  };

  const handleCancelDeleteRecording = () => {
    setShowPlaybackPopup(true);
    setAutoStartRecordingModal(false);
    setShowWarningPopup(false);
  };
  const uploadFile = async (audioBlob) => {
    try {
    //   const payloadValue = localStorage.getItem('Tpayload');
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.mp3");
    //   const textData = localStorage.getItem('textData');
    //   formData.append('textData', textData);
    //   localStorage.setItem("TformData", formData);
      const config = {
        method: 'get',
        url: 'http://localhost:3001/sample',
        // params: null,
        // data: formData,
        // headers: { 'Content-Type': 'multipart/form-data' },
      };
      const response = await axios(config);
      console.log(response);
      return response;
    } catch (error) {
      const obj = {
        message: "Error sending audio to backend",
        okButton: "ok",
      };
      setModalObj(obj);
      setIsErrorModalShow(true);
      setIsSubmitModalOpen(false);
    }
  };

  const postUserData = (type) => {
    if (type == "webView") {
      BotExtension.close();
    }
  };



  const handleSave = async () => {
    try {
        if (!audioBlob) {
          console.error("No recorded audio to submit.");
          return;
        }
        const response = await uploadFile(audioBlob);
        console.log("Audio uploaded successfully:", response.data);
        // setShowPlaybackPopup(true);
        setTimeout(() => {
          if (response.status === 200) {
            setIsLoading(false);
            postUserData('webView');
          } else {
            const obj = {
              message: "Error sending audio to backend",
              okButton: "ok",
            };
            setModalObj(obj);
            setIsErrorModalShow(true);
            setIsSubmitModalOpen(false);
          }
        }, minSecTOLoadSubmittedData*1000); 
      } catch (error) {
        const obj = {
          message: "Error sending audio to backend" + error,
          okButton: "ok",
        };
        setModalObj(obj);
        setIsErrorModalShow(true);
        setIsSubmitModalOpen(false);
      }
  }

  const handleShowErrorModal = () => {
    setIsErrorModalShow(false);
  };

  return (
    <>
    {isLoader && (
        <div
          className="d-flex justify-content-center align-content-center"
          style={{ height: "70vh" }}
        >
          <Loader
            type="spinner-default"
            bgColor={color}
            color={color}
            size={100}
          />
        </div>
      )}
      {!isLoader && (<div className="vachan-assessment">
        <ErrorModal
              handleShowModal={handleShowErrorModal}
              isModalShow={isErrorModalShow}
              data={modalObj}
              postData={postUserData}
            />
      {!showWarningPopup && <Header />}
      {!showWarningPopup && (
        <TextBox text="There once was a boy who grew bored while watching over the village sheep. He wanted to make things more exciting. So, he yelled out that he saw a wolf chasing the sheep. All the villagers came running to drive the wolf away. However, they saw no wolf. The boy was amused, but the villagers were not. They told him not to do it again. There once was a boy who grew bored while watching over the village sheep. He wanted to make things more exciting. So, he yelled out that he saw a wolf chasing the sheep. All the villagers came running to drive the wolf away. However, they saw no wolf. The boy was amused, but the villagers were not. They told him not to do it again.There once was a boy who grew bored while watching over the village sheep. He wanted to make things more exciting. So, he yelled out that he saw a wolf chasing the sheep. All the villagers came running to drive the wolf away. However, they saw no wolf. The boy was amused, but the villagers were not. They told him not to do it again." textSize={textSize} />
      )}
      {!showPlaybackPopup && !showWarningPopup && !isRecorded && (
        <div>
          <TextSize setTextSize={setTextSize} />
          <Recording
            onStart={startCountdown}
            onStop={handleStopRecording}
            isRecording={isRecording}
            autoStartModal={autoStartRecordingModal}
            recordingTime={timer}
            countdown={countdown}
          />
        </div>
      )}
      {showPlaybackPopup && (
        <RecordingPlaybackPopup
          onRetake={handleRetake}
          onSave={handleSave}
          audioSrc={audioSrc}
          onDelete={showDeleteWarning}
          recordingTime={timer}
        />
      )}
      {showWarningPopup && (
        <RetakeWarningPopup
          onRejectReRecordingAudio={handleCancelRetake}
          onConfirmReRecordingAudio={handleConfirmRetake}
          showDeletePopup={showDeletePopup}
          onDeleteRecording={handleDeleteRecording}
          onCancelDeleteRecording={handleCancelDeleteRecording}
        />
      )}
      <SubmitModal
          isOpen={isSubmitModalOpen}
          isLoading={isLoading}
          onRequestClose={() => setIsSubmitModalOpen(false)}
        />
    </div> )}
    </>
  ); 
}

export default VachanAssessment;
