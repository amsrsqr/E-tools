import { ErrorMessage } from "formik";

const InlineBottomErrorMessage = ({ name, msg, customStyle = {} }) => {
  const addErrorSymbol = () => {
    return (
      <div className="requiredfield">
        <span className="error-span">
          <i
            className="fa fa-exclamation-triangle fa-error"
            aria-hidden="true"
          ></i>
          <label className="error-msg">{msg ? msg : "Required Field"}</label>
        </span>
      </div>
    );
  };
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="invalid-feedback"
      render={() => addErrorSymbol()}
    />
  );
};

export default InlineBottomErrorMessage;
