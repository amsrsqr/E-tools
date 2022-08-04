import React from "react";
import { useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { useEffect } from "react";
import "../../css/NavProgressBar.css";
// import "../../css/ProgressNavigationBar.css";
const transitionStyles = {
  entering: { transform: "scale(1.3)" },
  entered: { transform: "scale(0.9)" },
  exiting: { transform: "scale(1.3)" },
  exited: { transform: "scale(1)" },
};
const ResidentNavigationBar = ({
  currentStep,
  stepArray,
  handleonClickNavigation,
  maxActiveStep,
}) => {
  const [activeStep, setActiveStep] = useState(-1);
  const type = localStorage.getItem("residentActionType");
  useEffect(() => {
    console.log("currentStep in nav bar", currentStep);
    setActiveStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    setSteps(stepArray || []);
  }, [stepArray]);

  const [steps, setSteps] = useState([]);

  return (
    <div className="d-flex align-items-center justify-content-between">
      {steps.length ? (
        <>
          <ProgressBar
            width={1755}
            height={15}
            percent={102 * (activeStep / (steps.length - 1)) - 1}
            filledBackground="#593e8e"
            border="#3E2A6E"
          >
            {steps.map((step, index, arr) => {
              return (
                <Step
                  position={100 * (index / arr.length)}
                  // transition="scale"
                  transition={
                    step.id === 1 && activeStep === 1
                      ? "scale"
                      : "" && step.id === 2 && activeStep === 1
                      ? "scale"
                      : "" && step.id === 3 && activeStep === 2
                      ? "scale"
                      : "" || step.id === 3
                      ? "scale"
                      : "" || step.id === 4
                      ? "scale"
                      : "" || step.id === 5
                      ? "scale"
                      : ""
                  }
                  children={({ accomplished, transitionState }) => (
                    <div
                      className={`indexedStep ${
                        accomplished ? "accomplished" : ""
                      }`}
                      style={{
                        // ...transitionStyles[transitionState],
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
                        cursor:
                          type === "Edit"
                            ? "pointer"
                            : index > 0
                            ? maxActiveStep + 1 > index
                              ? "pointer"
                              : "default"
                            : maxActiveStep + 1 >= index
                            ? "pointer"
                            : "default",
                      }}
                      onClick={() => {
                        handleonClickNavigation(index);
                      }}
                    >
                      {accomplished && activeStep !== index ? (
                        <div style={{ marginLeft: "8px", marginTop: "8px" }}>
                          <i
                            class="fa fa-check"
                            style={{
                              color: "white",
                              marginLeft: "5px",
                              marginTop: "7px",
                              fontSize: "18px",
                            }}
                            aria-hidden="true"
                          ></i>
                        </div>
                      ) : (
                        <div
                          style={{
                            marginLeft: "17px",
                            marginTop: "13px",
                            fontSize: "18px",
                            height: "18px",
                            color: activeStep === index ? "white" : "#59408C",
                            fontWeight: activeStep === index ? "" : "bold",
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <br />
                      <span className="text-nowrap d-flex justify-content-center">
                        {step.status}
                      </span>
                      {/* <div
                      style={{
                        marginRight: '50px',
                        position: 'relative',
                        top: '30px',
                      }}
                      >
                        {step.status}
                      </div> */}
                    </div>
                  )}
                />
                //   <div style={{ position: 'relative', top: '30px' }}>
                //   {step.status}
                // </div>
              );
            })}
          </ProgressBar>

          {/* <Stepper
        steps={[
          { title: 'Step One' },
          { title: 'Step Two' },
          { title: 'Step Three' },
          { title: 'Step Four' },
        ]}
        activeStep={activeStep}
      /> */}
          {/* <Button
            onClick={() => {
              nextStep();
            }}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResidentNavigationBar;
