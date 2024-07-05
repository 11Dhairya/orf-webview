import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import lamejs from "@breezystack/lamejs";
import "./MicTesting.css";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import ModalComponent from '../../components/AudioCheckModal/AudioCheck';

function MicTesting() {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCountdownPopup, setShowCountdownPopup] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  const apiUrl = "http://localhost:3000/api/";

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
    console.log(payload,'payload');
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
            const blob = new Blob(audioChunks.current, { type: "audio/mp3" });
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            setIsRecorded(true);
            setIsRecording(false);
          };
          mediaRecorder.current.start();
          setIsRecording(true);
          setTimer(0);
        })
        .catch((err) => {
          console.error("The following error occurred: " + err);
        });
    }
  };

  const handleStopRecording = async () => {
    if (isRecording) {
      mediaRecorder.current.stop();
      await new Promise((resolve) => {
        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: "audio/mp3" });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
          setIsRecorded(true);
          setIsRecording(false);
          resolve();
        };
      });
      setModalIsOpen(true);
      console.log(timer, timer<10);
      setIsShort(timer < 10);
      console.log(isShort);
    }
  };
  

  const convertToMP3 = async (wavBlob) => {
    try {
      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(arrayBuffer);
  
      // Create an offline audio context to resample the audio
      const offlineContext = new OfflineAudioContext(
        audioData.numberOfChannels,
        Math.ceil(audioData.duration * 114000),
        114000
      );
  
      // Create a buffer source
      const bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = audioData;
  
      // Connect the source to the destination (resampling happens here)
      bufferSource.connect(offlineContext.destination);
      bufferSource.start(0);
  
      // Render the audio to the desired sample rate
      const resampledAudioBuffer = await offlineContext.startRendering();
  
      // Get the channel data from the resampled buffer
      const resampledSamples = resampledAudioBuffer.getChannelData(0);
  
      // Encode the resampled audio data to MP3
      const mp3Encoder = new lamejs.Mp3Encoder(1, 114000, 128);
      const mp3Data = [];
      let mp3buf;
  
      const sampleBlockSize = 1152;
      for (let i = 0; i < resampledSamples.length; i += sampleBlockSize) {
        const left = resampledSamples.subarray(i, i + sampleBlockSize);
        mp3buf = mp3Encoder.encodeBuffer(left);
        if (mp3buf.length > 0) {
          mp3Data.push(new Int8Array(mp3buf));
        }
      }
  
      mp3buf = mp3Encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }
  
      return new Blob(mp3Data, { type: "audio/mp3" });
    } catch (error) {
      console.error("Error converting to MP3:", error);
      throw error;
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (!audioBlob) {
        console.error("No recorded audio to submit.");
        return;
      }
      const mp3Blob = await convertToMP3(audioBlob);
      const formData = new FormData();
      console.log(mp3Blob,'mp3Blob');
      formData.append("file", mp3Blob, "recording.mp3");
      const config = {
        method: 'post',
        url: `http://localhost:3001/upload`,
        params: null,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const response = await axios(config);

      console.log("Audio uploaded successfully:", response.data);
      setIsSubmitted(true);
      closeModal();
    } catch (error) {
      console.error("There was an error submitting the audio:", error);
    }
  };

  const handleDiscard = () => {
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


  const closeModal = () => {
    setModalIsOpen(false);
  };


  return (
    <div className="vachan-assessment-container">
      <div className="instructions">
        <h2>Instructions</h2>
        <ul>
          <li>Instructions for Text to Speech Benchmark Tasks.</li>
          <li>For the Language of your preference, you are tasked to Read the given text and Record it in a normal pace with minimal background noise.</li>
          <li>Please make sure to read the complete text, without missing any word (Can re-record in that case). It's not an ORF task.</li>
          <li>Adjust Text Size: Use the slider to set a comfortable text size.</li>
          <li>Start Recording: Click on 'Start Recording 🎙️' to begin recording your reading.</li>
          <li>Stop Recording: Click on 'Stop Recording (Click to Stop) ⏹️' to end the recording.</li>
          <li>Save Audio: After recording, click on 'Save Audio for Grading' to upload your audio for benchmarking.</li>
          <li>Re-recording Instructions: If you need to re-record, simply click 'Start Recording 🎙️' again. Once complete, click on 'Save Audio for Grading' button.</li>
          <li>Note: Make sure to speak clearly and at a natural pace. Ensure there is minimal background noise for the best recording quality.</li>
        </ul>
      </div>
      <div className="vachan-assessment">
        <div className="heading">
          <h1>Vachan Assessment</h1>
        </div>
        <div className="text-box" style={{ fontSize: `${fontSize}px` }}>
          <p style={{ fontSize: `${fontSize}px`, lineHeight: fontSize <= 30 ? 'inherit' : 1.5 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu sollicitudin ante, sit amet consequat eros. Suspendisse facilisis orci sed augue bibendum, non vehicula nunc rhoncus. Donec sit amet nisi et eros imperdiet vehicula in a odio. Nulla ut massa turpis. Pellentesque posuere pulvinar purus ac tristique. Morbi mattis quam ut dui efficitur lacinia. Nam justo leo, sodales sed varius at, ultrices vitae quam. Suspendisse enim ante, ultrices ac faucibus vel, lobortis nec leo. Mauris laoreet dolor nec ligula malesuada, sit amet ultricies nisl scelerisque.
          </p>
        </div>
        <div className="font-controls">
          <input
            type="range"
            min="10"
            max="60"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="font-slider"
          />
          <span>Font Size: {fontSize}px</span>
        </div>
        <div className="controls-container">
          {!isRecorded && (
          <button
            onClick={isRecording ? handleStopRecording : startRecordingWithCountdown}
            disabled={isRecorded || isSubmitted}
            className="start-button"
          >
            {isRecording ? "Stop Recording ⏹️" : "Start Recording 🎙️"}
          </button>
        )}
        <ModalComponent
          isOpen={modalIsOpen}
          onRequestClose={handleDiscard}
          onSubmit={handleSubmit}
          audioSrc={audioUrl}
          isShort={isShort}
          onRetry={handleDiscard}
        />
          {/* {isRecorded && (
            <div className="recording-info">
              <div className="recording-icon">
                <span role="img" aria-label="audio">
                  🎤
                </span>
                <span className="timer">{timer}s</span>
              </div>
              <button onClick={handleDiscard} className="discard-button">Discard</button>
            </div>
          )} */}
          {/* {isRecorded && (
            <div className="audio-player-container">
              <p className="audio-title">Recorded Audio:</p>
              <div className="audio-player">
                <audio controls>
                  <source src={audioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )} */}
          {isRecording && (
            <div className="timer">
              <p>Recording Audio: {timer}s</p>
            </div>
          )}
          {/* {isRecorded || isSubmitted ? (
            <button onClick={handleSubmit} disabled={!isRecorded || isSubmitted} className="save-button">
              Save Audio
            </button>
          ) : null} */}
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
    </div>
   
    
  );  
}  
export default MicTesting;
