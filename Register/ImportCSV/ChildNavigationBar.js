import React from "react";
import { useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { useEffect } from "react";
const ChildNavigationBar = ({
  currentStep,
  stepArray = [
    {
      id: 1,
      status: "Upload CSV",
    },
    {
      id: 2,
      status: "Map CSV Fields",
    },
    {
      id: 3,
      status: "Preview & Confirm",
    },
  ],
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [showPolicyError, setShowPolicyError] = useState(false);

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ marginTop: "10px" }}
    >
      {stepArray.length ? (
        <>
          <ProgressBar
            width={1575}
            style={{ marginLeft: "120px" }}
            percent={100 * (currentStep / (stepArray.length - 1)) - 1}
            className="mt-4 ms-4"
            filledBackground="#593e8e"
            // border="#1F4749"
          >
            {stepArray.map((step, index, arr) => {
              return (
                <Step
                  position={100 * (index / arr.length)}
                  transition="scale"
                  // style={{ border: '1px solid #3E2A6E' }}
                  children={({ accomplished }) => (
                    <div
                      className={`indexedStep ${
                        accomplished ? "accomplished" : ""
                      }`}
                      style={{
                        borderRadius: "50%",
                        border:
                          activeStep !== index
                            ? "1px solid #3E2A6E"
                            : "1px solid white",
                        boxShadow:
                          activeStep === index ? "0 0 5px 0 blue" : "0 0 0 0",
                        width: 45,
                        height: 45,
                        color: "#593e8e",

                        fontWeight:
                          accomplished || activeStep === index ? "bold" : "",
                        backgroundColor:
                          accomplished || activeStep === index
                            ? "#3E2A6E"
                            : "#b1a9c5",
                        // textAlign: "center",
                      }}
                    >
                      {accomplished && currentStep !== index ? (
                        <div style={{ marginLeft: "12px", marginTop: "14px" }}>
                          <i
                            class="fa fa-check"
                            style={{ color: "white", fontSize: "18px" }}
                            aria-hidden="true"
                          ></i>
                        </div>
                      ) : (
                        <div
                          style={{
                            marginLeft: "16px",
                            marginTop: "13px",
                            height: "20px",
                            fontSize: "18px",
                            color: currentStep === index ? "white" : "black",
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <br />
                      {index === 0 && showPolicyError ? (
                        <>
                          <i
                            class="fa fa-bell fa-missing-doc"
                            aria-hidden="true"
                          ></i>

                          <p className="text-danger">Insurance Documents</p>
                        </>
                      ) : (
                        <></>
                      )}
                      <div
                        style={{
                          width: "110px",
                          marginLeft: "-40px",
                          textAlign: "center",
                        }}
                      >
                        {step.status}
                      </div>
                    </div>
                  )}
                />
              );
            })}
          </ProgressBar>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChildNavigationBar;
