import React, { useEffect, useState } from "react";
// import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import * as moment from "moment";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Menu from "@mui/material/Menu";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import {
  useLocaleText,
  WrapperVariantContext,
} from "@mui/x-date-pickers/internals";
import useId from "@mui/utils/useId";
import { FaTrashAlt } from "react-icons/fa";

function MuiDatePicker({
  disabled,
  prop,
  id,
  selectedDate,
  getChangedDate,
  minDate,
  maxDate,
  ref,
  dateFormat,
  className,
  onError,
  name,
  required,
  onBlur,
  error,
  placeholder,
  doNotSetimmediateDate,
}) {
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: "#593e8e",
      },

      secondary: {
        main: "#2dbcc5",
      },
    },

    components: {
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            borderLeft: `1px solid ${error ? "#dc3545" : "#ccc"}`,
            borderRadius: "0",
            height: "35px",
            marginLeft: "-8px",
            color: error ? "#dc3545" : "#ccc",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "#495057",
            backgroundColor: disabled ? "#e9ecef" : "",
            "&:hover": {
              // background: "red",
              // border:'3px solid #ccc'
            },
            MuiFormControl: {
              "&:hover": {
                border: "3px solid #ccc",
              },
              "&$focused": {
                border: `1px solid red`,
                outline: `1px solid blue`,
              },
            },
          },
        },
      },
    },
  });

  const CustomActionBar = (props) => {
    const { onClear, actions } = props;
    const wrapperVariant = React.useContext(WrapperVariantContext);
    // const localeText = useLocaleText();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = useId();

    const actionsArray =
      typeof actions === "function" ? actions(wrapperVariant) : actions;

    if (actionsArray == null || actionsArray.length === 0) {
      return null;
    }

    const menuItems = actionsArray?.map((clear) => {
      return <></>;
    });

    return (
      <>
        <FaTrashAlt
          style={{ color: "#593E8E", marginLeft: "150px", fontSize: "18px" }}
          onClick={() => {
            onClear();
          }}
        ></FaTrashAlt>
        <DialogActions>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": `picker-actions-${id}`,
            }}
          >
            {menuItems}
          </Menu>
        </DialogActions>
      </>
    );
  };

  CustomActionBar.propTypes = {
    /**
     * Ordered array of actions to display.
     * If empty, does not display that action bar.
     * @default `['clear', 'accept']` for mobile and `[]` for desktop
     */
    actions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOf(["clear"])),
      PropTypes.func,
    ]),
    onClear: PropTypes.func.isRequired,
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#dc3545" : "#ccc",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#dc3545" : "#2684FF",
      },
      "&: .MuiOutlinedInput-root.Mui-active .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#dc3545" : "#A1C2F0",
        boxShadow: "0px 0px 0px 5px #c2dbfe",
      },
      "& .css-j5h6pi-MuiPopper-root": {
        border: "2px solid red",
      },
    },
  }));
  // console.log("error", error);
  const [value, setValue] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const classes = useStyles();
  const handleDateChange = (newDate) => {
    if (!doNotSetimmediateDate) {
      setValue(newDate);
    }
    if (getChangedDate) getChangedDate(newDate);
  };
  useEffect(() => {
    if (selectedDate) {
      setValue(moment(selectedDate).format());
    } else {
      setValue(selectedDate === 0 ? new Date() : null);
    }
  }, [selectedDate]);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          // className={className ? `${className}` : ""}
          disabled={disabled ? disabled : false}
          openTo="day"
          className={classes.root}
          allowSameDateSelection={true}
          views={["year", "month", "day"]}
          // label=" "
          okText
          clearable
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          components={{
            ActionBar: CustomActionBar,
            OpenPickerIcon: CalendarMonthIcon,
          }}
          componentsProps={{
            actionBar: {
              actions: ["clear"],
            },
          }}
          open={isOpen}
          onError={
            onError
              ? onError
              : (reason, value) => {
                  setValue(null);
                  console.log("reason, value", reason, value);
                }
          }
          inputRef={ref}
          // InputProps={{onBlur}}
          toolbarPlaceholder={placeholder ? placeholder : null}
          inputFormat={dateFormat ? dateFormat : "dd/MM/yyyy"}
          minDate={minDate ? new Date(minDate) : undefined}
          maxDate={maxDate ? new Date(maxDate) : undefined}
          value={value}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              size="small"
              id={id ? id : ""}
              variant="outlined"
              name={name ? name : ""}
              // InputLabelProps={{
              //   shrink: false,
              //   placeholder: placeholder ? placeholder : "",
              // }}
              {...params}
              helperText={null}
              // onKeyDown={(evt) => {
              //   evt.preventDefault();
              // }}
              // placeholder={placeholder ? placeholder : ""}
              className={`${classes.root} ${className ? className : ""}`}
              onClick={() => (disabled ? setOpen(false) : setOpen(!isOpen))}
              onKeyPress={(evt) => evt.preventDefault()}
              required={required ? required : false}
              onBlur={onBlur ? onBlur : () => {}}
              error={error ? error : false}
            />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default MuiDatePicker;
