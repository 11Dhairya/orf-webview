import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import lamejs from "@breezystack/lamejs";
import Loader from "react-js-loader";
import "./VachanAssessment.css";

import ErrorModal from "../../components/ErrorModal/ErrorModal";
import AudioCheckModalComponent from '../../components/AudioCheckModal/AudioCheck';
import SubmitModal from '../../components/SubmitModal/Submit';

function VachanAssessment() {
  const color = "#386af6";
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const [audioCheckmodalIsOpen, setaudioCheckModalIsOpen] = useState(false);
  const [showCountdownPopup, setShowCountdownPopup] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const submitUrl = import.meta.env.VITE_API_SUBMIT_URL;
  const minSecondsToRecord = import.meta.env.VITE_MIN_SEC_TO_RECORD;
  const minSecTOLoadSubmittedData = import.meta.env.VITE_MIN_SEC_TO_LOAD_SUBMITTED_DATA;
  const warningTimeToRecord = import.meta.env.VITE_WARNING_TIME_TO_RECORD;
  const audioFormat = import.meta.env.VITE_AUDIO_FORMAT;
  
  const [countdown, setCountdown] = useState(warningTimeToRecord);
  const [isLoading, setIsLoading] = useState(true);
  const [isShort, setIsShort] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [isErrorModalShow, setIsErrorModalShow] = useState(false);
  const [modalObj, setModalObj] = useState("");
  const [assessmentText, setAssessmentText] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms * 1000));

  const test = async () => {
    let payload = null;
    const searchString = window.location.search;
    payload = searchString.split("token=")[1];
    BotExtension.getPayload((payloadData) => {
      payload = payloadData;
    });
    while (payload === null) {
      await delay(0.7);
    }
    if (payload !== null) return payload.value;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPayloadData();
    };
    fetchData();
  }, []);

  const getPayloadData = async () => {
    try {
      setIsLoader(false);
      const payloadValue = await test();
      setIsLoader(false);
      if (payloadValue !== null) {
        await handleCreateSession(payloadValue);
        await getAssessmentText(payloadValue);
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
      const res = await axios.post(`${apiUrl}/create-session?token=${payloadValue}`, {});
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
      const res = await axios.post(`${apiUrl}/get-assessment-text?token=${payloadValue}`, {});
      setAssessmentText(res.data.assessmentText);
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
    if (isRecording) {
      timerInterval.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [isRecording]);
  

  const startRecordingWithCountdown = () => {
    setCountdown(3);
    setShowCountdownPopup(true);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setShowCountdownPopup(false);
          handleStartRecording();
          setIsRecording(true);
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
            setAudioUrl(URL.createObjectURL(blob));
            setIsRecorded(true);
            setIsRecording(false);
          };
          mediaRecorder.current.start();
          setIsRecording(true);
          setTimer(0);
        })
        .catch ((error) => {
          const obj = {
            message: "The following error occurred in start/stop recording " + error,
            okButton: "ok",
          };
          setModalObj(obj);
          setIsErrorModalShow(true);
        });
    }
  };

  const handleStopRecording = async () => {
    if (isRecording) {
      mediaRecorder.current.stop();
      if(timer >= minSecondsToRecord) {
        setIsStopped(true);
      }
      setIsShort(timer < minSecondsToRecord);
      if(timer < minSecondsToRecord)
        openAudioCheckModal();
    }
    else {
        const obj = {
          message: "The audio is already recorded, cannot stop",
          okButton: "ok",
        };
        setModalObj(obj);
        setIsErrorModalShow(true);
    }
  };
  

  const convertToMP3 = async (wavBlob) => {
    try {
      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(arrayBuffer);
  
      const targetSampleRate = 16000;
      const offlineContext = new OfflineAudioContext(
        audioData.numberOfChannels,
        Math.ceil(audioData.duration * targetSampleRate),
        targetSampleRate
      );
  
      // Create a buffer source
      const bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = audioData;
  
      // Connect the source to the destination (resampling happens here)
      bufferSource.connect(offlineContext.destination);
      bufferSource.start(0);
  
      // Render the audio to the desired sample rate
      const resampledAudioBuffer = await offlineContext.startRendering();
  
      const mp3Encoder = new lamejs.Mp3Encoder(audioData.numberOfChannels, targetSampleRate, 128);
      const mp3Data = [];
      let mp3buf;
  
      const sampleBlockSize = 1152;
      for (let i = 0; i < resampledAudioBuffer.length; i += sampleBlockSize) {
        const left = resampledAudioBuffer.getChannelData(0).subarray(i, i + sampleBlockSize);
        const right = audioData.numberOfChannels > 1 ? resampledAudioBuffer.getChannelData(1).subarray(i, i + sampleBlockSize) : null;
        
        mp3buf = mp3Encoder.encodeBuffer(left, right);
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }
  
      mp3buf = mp3Encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
  
      return new Blob(mp3Data, { type: `audio/${audioFormat}` });
    } catch (error) {
      const obj = {
        message: "Error conveting into mp3 format" + error,
        okButton: "ok",
      };
      setModalObj(obj);
      setIsErrorModalShow(true);
    }
  };  

  const postUserData = (type) => {
    if (type == "webView") {
      BotExtension.close();
    }
  };
  
  const uploadFile = async (audioBlob) => {
    try {
      const formData = new FormData();
      const mp3Blob = await convertToMP3(audioBlob);
      formData.append("file", mp3Blob, "recording.mp3");
      
      const config = {
        method: 'post',
        url: `${submitUrl}`,
        params: {},
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const response = await axios(config);
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


  const handleSubmit = async () => {
    try {
      if (!audioBlob) {
        console.error("No recorded audio to submit.");
        return;
      }
      setIsSubmitModalOpen(true);
      const response = await uploadFile(audioBlob);
      console.log("Audio uploaded successfully:", response.data);
      setIsSubmitted(true);
      closeModal();
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
  };

  const handleDiscard = () => {
    setIsStopped(false);
    setIsRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsSubmitted(false);
    setAudioSrc(null);
    closeModal();
    setTimer(0);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const openAudioCheckModal = () =>{
    setaudioCheckModalIsOpen(true);
    setIsStopped(false);
  }

  const closeModal = () => {
    setaudioCheckModalIsOpen(false);
  };

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
      {!isLoader && (<div className="vachan-assessment-container">
        <ErrorModal
              handleShowModal={handleShowErrorModal}
              isModalShow={isErrorModalShow}
              data={modalObj}
              postData={postUserData}
            />
        <div className="vachan-main-content">
          <div className="heading">
            <h1>Vachan Assessment</h1>
          </div>
          <div className="text-box" style={{ fontSize: `${fontSize}px` }}>
            <p style={{ fontSize: `${fontSize}px`, lineHeight: fontSize <= 30 ? 'inherit' : 1.5 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu sollicitudin ante, sit amet consequat eros. Suspendisse facilisis orci sed augue bibendum, non vehicula nunc rhoncus. Donec sit amet nisi et eros imperdiet vehicula in a odio. Nulla ut massa turpis. Pellentesque posuere pulvinar purus ac tristique. Morbi mattis quam ut dui efficitur lacinia. Nam justo leo, sodales sed varius at, ultrices vitae quam. Suspendisse enim ante, ultrices ac faucibus vel, lobortis nec leo. Mauris laoreet dolor nec ligula malesuada, sit amet ultricies nisl scelerisque.
            </p>
          </div>
        </div>
        <div className="vachan-controls">
          <div className="font-controls">
            <span className="left"><h5>A</h5></span>
            <input
              className="bar font-slider"
              type="range"
              min="15"
              max="50"
              value={fontSize}
              onChange={handleFontSizeChange}
            />
            <span className="right"><h1>A</h1></span>
          </div>
          <div className="controls-container">
            {!isRecorded && !isStopped && (
              <button
                onClick={isRecording ? handleStopRecording : startRecordingWithCountdown}
                disabled={isRecorded || isSubmitted}
                className="start-button"
              >
                {isRecording ? "Stop Recording ⏹️" : "Start Recording 🎙️"}
              </button>
            )}
            {isStopped && (
            <div className="post-recording-controls">
              <button className="retake-button" onClick={handleDiscard}>
                <span className="icon">X</span>
                <span className="text">Retake</span>
              </button>
              <button className="stop-button" disabled>Stop Recording ⏹️</button>
              <button className="save-button" onClick={openAudioCheckModal}>
                <span className="icon">✓</span>
                <span className="text">Save</span>
              </button>
            </div>
          )}
            <AudioCheckModalComponent
              isOpen={audioCheckmodalIsOpen}
              onRequestClose={handleDiscard}
              onSubmit={handleSubmit}
              audioSrc={audioUrl}
              isShort={isShort}
              onRetry={handleDiscard}
            />
            {isRecording && (
              <div className="timer">
                <p>Recording Audio: {timer}s</p>
              </div>
            )}
          </div>
        </div>
        {showCountdownPopup && (
          <div className="countdown-popup">
            <div className="countdown-content">
              <h2>Recording will start in:</h2>
              <h1>{countdown}</h1>
            </div>
          </div>
        )}
        <SubmitModal
          isOpen={isSubmitModalOpen}
          isLoading={isLoading}
          onRequestClose={() => setIsSubmitModalOpen(false)}
        />
      </div>)}
    </>
  );  
  
}  
export default VachanAssessment;
