import React from "react";
// plugins
import clsx from "clsx";
import VTC from "@vatis-tech/asr-client-js";
import { ToastContainer, toast } from "react-toastify";
// components
import WithDismissButton from "./WithDismissButton.js";
import humanizeDuration from "./humanize-duration.js";

const VTC_SERVICE = "LIVE_ASR";
const VTC_LANGUAGE = "ro_RO";
const VTC_LOG = true;
const VTC_MICROPHONE_TIMESLICE = 500;
const VTC_FRAME_LENGTH = 0.6;
const VTC_FRAME_OVERLAP = 1.0;
const VTC_BUFFER_OFFSET = 0.5;
const NO_INSTANCES_AVAILABLE_ERROR_CODE = 429;
const NO_INSTANCES_AVAILABLE_ERROR_MESSAGE = "No instance available";
const VTC_API_KEY = "YOUR_API_KEY_HERE";
const VTC_HOST = "https://vatis.tech/api/v1";

const wrapperColors = {
  success: "bg-lime-50",
  warning: "bg-orange-50",
  error: "bg-red-50",
  info: "bg-cyan-50",
};

const svgColors = {
  success: "text-lime-400",
  warning: "text-orange-400",
  error: "text-red-400",
  info: "text-cyan-400",
};

const descriptionColors = {
  success: "text-lime-800",
  warning: "text-orange-800",
  error: "text-red-800",
  info: "text-cyan-800",
};

const closeColors = {
  success:
    "bg-lime-50 text-lime-500 hover:bg-lime-100 focus:ring-offset-lime-50 focus:ring-lime-600",
  warning:
    "bg-orange-50 text-orange-500 hover:bg-orange-100 focus:ring-offset-orange-50 focus:ring-orange-600",
  error:
    "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600",
  info: "bg-cyan-50 text-cyan-500 hover:bg-cyan-100 focus:ring-offset-cyan-50 focus:ring-cyan-600",
};

const svgPaths = {
  success:
    "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  warning:
    "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
  error:
    "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
  info: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
};

const CloseButton = ({ closeToast, theme, type }) => {
  return (
    <button
      onClick={closeToast}
      className={clsx(
        "inline-flex items-center content-center rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ease-linear transition-all duration-150",
        closeColors[type]
      )}
    >
      <span className="sr-only">Dismiss</span>
      {/* Heroicon name: solid/x */}
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

class Live extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      vtcInitialized: false,
      timeStamps: [],
      transcriptFrames: [],
      error: false,
    };
    this.vtcRef = React.createRef();
  }
  componentWillUnmount() {
    if (this.vtcRef.current && this.vtcRef.current.destroy) {
      this.vtcRef.current.destroy({ hard: true });
    }
  }

  buttonClick = () => {
    this.liveToggler();
  };

  liveToggler = () => {
    if (this.state.isDestroying) {
      this.notify({
        type: "warning",
        message: "Please wait a few seconds for the transcript to finalize.",
      });
      return;
    }
    if (!this.vtcRef.current) {
      this.setState({
        play: true,
        needNewTimeStamp: true,
      });
      this.vtcRef.current = new VTC({
        service: VTC_SERVICE,
        language: VTC_LANGUAGE,
        apiKey: VTC_API_KEY,
        onData: this.onData.bind(this),
        log: VTC_LOG,
        onDestroyCallback: this.onDestroyCallback.bind(this),
        host: VTC_HOST,
        microphoneTimeslice: VTC_MICROPHONE_TIMESLICE,
        frameLength: VTC_FRAME_LENGTH,
        frameOverlap: VTC_FRAME_OVERLAP,
        bufferOffset: VTC_BUFFER_OFFSET,
        errorHandler: this.errorHandler.bind(this),
        logger: (info) => {
          if (
            info.currentState ===
            '@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.'
          ) {
            this.setState({ vtcInitialized: true });
          } else if (
            info.currentState ===
            '@vatis-tech/asr-client-js: Destroy the "SocketIOClientGenerator" plugin.' &&
            this.state.vtcInitialized &&
            this.state.play
          ) {
            this.setState({
              play: false,
              vtcInitialized: false,
              error: true,
            });
            this.vtcRef.current = null;
            this.notify({
              type: "error",
              message:
                "The Vatis Tech ASR SERVICE has interrupted the connection. Please try again in a few minutes, and if this issue persists, please contact us at support@vatis.tech.",
            });
          }
        },
      });
    } else if (this.vtcRef.current !== undefined && this.state.play) {
      this.setState({ play: false, isDestroying: true }, () => {
        this.vtcRef.current.destroy();
      });
    }
  };

  errorHandler = (e) => {
    this.setState({
      play: false,
      vtcInitialized: false,
      error: true,
    });
    this.vtcRef.current = null;
    if (
      e &&
      (e.status === NO_INSTANCES_AVAILABLE_ERROR_CODE ||
        e.message === NO_INSTANCES_AVAILABLE_ERROR_MESSAGE)
    ) {
      this.notify({
        type: "error",
        message:
          "We're sorry, but there are no instances of the Vatis Tech ASR SERVICE free. Please try again later. If you should have one, please contact us at support@vatis.tech.",
      });
    } else {
      this.notify({
        type: "error",
        message:
          "There was a server error. Please try again later, and if this issue persists, please contact us at support@vatis.tech.",
      });
    }
  };

  onDestroyCallback = () => {
    if (this.state.isDestroying && !this.state.error) {
      this.setState(
        {
          vtcInitialized: false,
          isDestroying: false,
        },
        () => {
          this.vtcRef.current = null;
          this.notify({
            type: "success",
            message:
              "The transcript has been finalized. You can resume live transcription",
          });
        }
      );
    }
  };

  onData = (data) => {
    if (this.state.needNewTimeStamp && data.transcript !== "") {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");

      this.setState({
        needNewTimeStamp: false,
        timeStamps: [`${hh}:${mm}:${ss}`, ...this.state.timeStamps],
      });
    }
    if (data.transcript === "") {
    } else if (
      this.state.transcriptFrames.length &&
      this.state.transcriptFrames[0].headers.FrameStartTime ===
      data.headers.FrameStartTime &&
      this.state.transcriptFrames[0].headers.Sid === data.headers.Sid
    ) {
      const newTranscriptFrames = [...this.state.transcriptFrames];
      newTranscriptFrames[0] = data;
      this.setState({ transcriptFrames: newTranscriptFrames });
    } else {
      this.setState({
        transcriptFrames: [data, ...this.state.transcriptFrames],
      });
    }
  };

  displayTranscript = (transcripts) => {
    if (transcripts.length === 0) {
      return "";
    }

    let timeIndex = 0;
    return transcripts.map((prop, key) => {
      return (
        <React.Fragment key={key}>
          <div className="flex items-start mb-3">
            <div className="mr-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blueGray-100 text-blueGray-800">
                {humanizeDuration(prop.headers.FrameStartTime)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-blueGray-500 text-lead leading-6 text-left">
                {prop.transcript}
              </p>
            </div>
          </div>
          {((key !== transcripts.length - 1 &&
            prop.headers.Sid !== transcripts[key + 1].headers.Sid) ||
            key === transcripts.length - 1) && (
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-blueGray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-blueGray-500">
                    {this.state.timeStamps[timeIndex++]}
                  </span>
                </div>
              </div>
            )}
        </React.Fragment>
      );
    });
  };

  download = () => {
    if (this.state.transcriptFrames.length === 0) {
      return;
    }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    const filename = `vatis-tech-live-transcript-[${dd}.${mm}.${yyyy}].text`;
    const newTranscriptFrames = [...this.state.transcriptFrames];
    const newTimeStamps = [...this.state.timeStamps];
    let timeIndex = 0;
    const text = newTranscriptFrames
      .map(
        (prop, key) =>
          `${(key !== newTranscriptFrames.length - 1 &&
            prop.headers.Sid !== newTranscriptFrames[key + 1].headers.Sid) ||
            key === newTranscriptFrames.length - 1
            ? `\n-------------------[${newTimeStamps[timeIndex++]
            }]-------------------\n\n`
            : ""
          }[${humanizeDuration(prop.headers.FrameStartTime)}]: ${prop.transcript
          }`
      )
      .reverse()
      .join("\n\n");

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  notify = ({ type, message, toastId }) => {
    toast[type](message, {
      toastId,
      className: clsx("rounded-md p-4 shadow-md", wrapperColors[type]),
      bodyClassName: clsx("text-sm font-medium", descriptionColors[type]),
      icon: (
        <div className="flex-shrink-0">
          <svg
            className={clsx("h-5 w-5", svgColors[type])}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d={svgPaths[type]} clipRule="evenodd" />
          </svg>
        </div>
      ),
    });
  };

  render() {
    return (
      <>
        <ToastContainer
          closeButton={CloseButton}
          closeOnClick={false}
          autoClose={3000}
          className="md:w-120"
        />
        <div className="h-screen flex overflow-hidden bg-white">
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-blueGray-200 pt-5 pb-6 bg-blueGray-100 relative">
              <div className="flex flex-shrink-0 items-center justify-center px-6 lg:px-4">
                <a href="https://vatis.tech/" target="_blank">
                  <img
                    className="h-16 w-auto"
                    src={require("./dark_logo_transparent_background.png")}
                    alt="Vatis Tech"
                  />
                </a>
              </div>
              <div
                className="
                h-0
                flex-1 flex flex-col
                overflow-y-auto
                mt-6
                border-t border-blueGray-200
              "
              ></div>
              <div className="absolute bottom-0 w-full flex items-center justify-center font-semibold text-blueGray-500 text-sm">
                v2.0.2
              </div>
            </div>
          </div>
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
              <div className="border-b border-blueGray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div className="flex-1 min-w-0 flex items-center">
                  <h1 className="text-lg font-medium leading-6 text-blueGray-900 sm:truncate hidden lg:block">
                    @vatis-tech/asr-client-js usage example
                  </h1>
                  <div className="flex flex-shrink-0 items-center justify-center px-6 lg:px-4 lg:hidden block">
                    <a href="https://vatis.tech/" target="_blank">
                      <img
                        className="h-16 w-auto"
                        src={require("./dark_logo_transparent_background.png")}
                        alt="Vatis Tech"
                      />
                    </a>
                  </div>
                </div>
                <div className="mt-4 flex sm:mt-0 sm:ml-4 lg:hidden">
                  v2.0.2
                </div>
              </div>
              <div className="divide-y divide-blueGray-200 lg:col-span-9">
                <div className="h-screen--18.75 sm:h-screen--16.25 md:h-screen--13.375 lg:h-screen--9.75 overflow-y-auto max-w-3xl mx-auto break-words flex flex-col-reverse p-6">
                  {this.state.needNewTimeStamp &&
                    this.state.vtcInitialized &&
                    this.state.play && (
                      <WithDismissButton
                        type="success"
                        description="Live transcription has started. We're waiting to retrieve the data. If you see this message for a long period of time, please contact us at support@vatis.tech."
                      />
                    )}
                  {this.state.needNewTimeStamp &&
                    !this.state.vtcInitialized &&
                    this.state.play && (
                      <WithDismissButton
                        type="info"
                        description="We're starting the live transcription. Please wait a few seconds. If the waiting time is too long, please contact us at support@vatis.tech."
                      />
                    )}
                  {this.displayTranscript(this.state.transcriptFrames)}
                </div>
                <div>
                  <div className="flex flex-wrap bg-white items-center justify-center border-t border-blueGray-200 p-4">
                    <div className="relative w-full md:w-6/12 md:mb-0 mb-4 flex flex-wrap justify-center md:justify-start">
                      <button
                        type="button"
                        className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-green-500 text-xs font-medium rounded shadow-sm text-green-500 bg-white hover:border-transparent hover:text-white hover:bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ease-linear transition-all duration-150"
                        onClick={this.download}
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download text
                      </button>
                    </div>
                    <div className="relative w-full md:w-6/12 flex flex-row items-center justify-center md:justify-start">
                      <button
                        className={clsx(
                          "flex items-center justify-center border border-green-500 text-2xl font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-14 h-14 ease-linear transition-all duration-150",
                          {
                            "opacity-50 pointer-events-none":
                              (this.state.play && !this.state.vtcInitialized) ||
                              this.state.isDestroying,
                            "text-green-500 bg-white hover:text-white hover:bg-green-500":
                              !this.state.play || !this.state.vtcInitialized,
                            "text-white bg-green-500 hover:text-green-500 hover:bg-white":
                              this.state.play && this.state.vtcInitialized,
                          }
                        )}
                        disabled={
                          (this.state.play && !this.state.vtcInitialized) ||
                          this.state.isDestroying
                        }
                        onClick={this.buttonClick}
                      >
                        <i
                          className={clsx({
                            "fa fa-stop animate-pulse":
                              this.state.play && this.state.vtcInitialized,
                            "fas fa-microphone":
                              !this.state.play || !this.state.vtcInitialized,
                          })}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Live;
