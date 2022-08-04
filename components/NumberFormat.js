import React from "react";
import NumberFormat from "react-number-format";
function MyNumberFormat({
  disabled,
  thousandSeparator,
  prefix,
  suffix,
  placeholder,
  maxLength,
  style,
  value,
  onBlur,
  onValueChange,
  className,
  allowNegative,
}) {
  const mxLength = maxLength ? maxLength : 13;

  return (
    <span>
      <NumberFormat
        disabled={disabled ? disabled : false}
        thousandSeparator={thousandSeparator ? thousandSeparator : false}
        prefix={suffix ? "" : prefix ? prefix : "$"}
        suffix={prefix ? "" : suffix ? suffix : ""}
        placeholder={placeholder ? placeholder : "$0.00"}
        allowNegative={allowNegative ? allowNegative : false}
        // maxLength={maxLength}
        style={style ? style : {}}
        value={value}
        onBlur={onBlur}
        onValueChange={onValueChange}
        isAllowed={(val) => val.value.length <= mxLength}
        fixedDecimalScale={2}
        decimalScale={2}
        className={className ? className : ""}
      />
    </span>
  );
}

export default MyNumberFormat;
//     (val) => {
//   onValueChange(val);
//   console.log("entered val", val);
//   console.log("converted value", parseFloat(val.value));
// }

//   const beforeDecimal = val.value.split(".")[0];
//   //   const afterDecimal = val.value.split(".")[1];
//   console.log("maxLengthD", mxLength);
//   if (beforeDecimal.length <= mxLength) {
//     console.log("beforedecimal point value", beforeDecimal);
//   onValueChange(val);
//   }
//    else {
//     const shiftDecimal =
//       val.value.length === 12
//         ? val.value / Math.pow(10, 1)
//         : val.value.length == 13
//         ? val.value / Math.pow(10, 2)
//         : "";
//     console.log("shiftDecimal", shiftDecimal);
//   }
