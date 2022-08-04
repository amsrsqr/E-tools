import React, { useEffect, useRef, useState } from "react";
import Select, { components } from "react-select";
const { MenuList, ValueContainer, SingleValue, Placeholder } = components;

const CustomMenuList = ({ selectProps, ...props }) => {
  const { onInputChange, inputValue, onMenuInputFocus } = selectProps;

  const ariaAttributes = {
    "aria-autocomplete": "list",
    "aria-label": selectProps["aria-label"],
    "aria-labelledby": selectProps["aria-labelledby"],
  };

  return (
    <div>
      {props.options && props.options.length > 5 ? (
        <input
          // className="selectsearch-focus"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 10,
            outline: "none",
            height: "35px !important",
            borderBottom: "1px solid lightgrey",
            borderRadius: "5px",
          }}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          type="text"
          value={inputValue}
          onChange={(e) =>
            onInputChange(e.currentTarget.value, {
              action: "input-change",
            })
          }
          onMouseDown={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onFocus={onMenuInputFocus}
          placeholder="Search..."
          {...ariaAttributes}
        />
      ) : null}
      <MenuList {...props} selectProps={selectProps} />
    </div>
  );
};

// Set custom `SingleValue` and `Placeholder` to keep them when searching
const CustomValueContainer = ({ children, selectProps, ...props }) => {
  const commonProps = {
    cx: props.cx,
    clearValue: props.clearValue,
    getStyles: props.getStyles,
    getValue: props.getValue,
    hasValue: props.hasValue,
    isMulti: props.isMulti,
    isRtl: props.isRtl,
    options: props.options,
    selectOption: props.selectOption,
    setValue: props.setValue,
    selectProps,
    theme: props.theme,
  };

  return (
    <ValueContainer {...props} selectProps={selectProps}>
      {React.Children.map(children, (child) => {
        return child ? (
          child
        ) : props.hasValue ? (
          <SingleValue
            {...commonProps}
            isFocused={selectProps.isFocused}
            isDisabled={selectProps.isDisabled}
          >
            {selectProps.getOptionLabel(props.getValue()[0])}
          </SingleValue>
        ) : (
          <Placeholder
            {...commonProps}
            key="placeholder"
            isDisabled={selectProps.isDisabled}
            data={props.getValue()}
          >
            {selectProps.placeholder}
          </Placeholder>
        );
      })}
    </ValueContainer>
  );
};

const styleObject = {
  singleValue: (styles, state) => ({
    ...styles,
  }),
  option: (styles, state) => {
    return {
      ...styles,
      backgroundColor: state.isSelected ? "#b5d9f3" : "",
      color: state.isSelected ? "black" : "",
      "&:hover": {
        backgroundColor: state.isFocused ? "#DEEBFF" : "",
      },
    };
  },
};

const reactSelectTheme = (error) => (theme) => {
  const errorStyling = error
    ? {
        neutral50: "#dc3545",
        neutral30: "#dc3545",
        neutral20: "#dc3545",
        neutral60: "#dc3545",
      }
    : {};

  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...errorStyling,
    },
  };
};

const SingleSelect = ({
  options,
  onChange,
  error,
  placeholder,
  name,
  menuPlacement,
  value,
  theme,
  defaultValue,
  isDisabled,
  className,
}) => {
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onDomClick = (e) => {
    let menu = containerRef.current.querySelector(".select__menu");

    if (
      !containerRef.current.contains(e.target) ||
      !menu ||
      !menu.contains(e.target)
    ) {
      setIsFocused(false);
      setInputValue("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onDomClick);

    return () => {
      document.removeEventListener("mousedown", onDomClick);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Select
        styles={styleObject}
        menuPlacement={menuPlacement}
        classNamePrefix="select"
        // className={!error ? " " : "invalidSelect"}
        placeholder={
          placeholder === "No Placeholder"
            ? ""
            : placeholder
            ? placeholder
            : "Select...."
        }
        options={options}
        components={{
          MenuList: CustomMenuList,
          ValueContainer: CustomValueContainer,
        }}
        inputValue={inputValue}
        value={value}
        defaultValue={defaultValue ? defaultValue : {}}
        isDisabled={isDisabled ? isDisabled : false}
        isSearchable={false}
        theme={reactSelectTheme(error? true : false        )}
        onMenuInputFocus={() => setIsFocused(true)}
        onChange={(value) => {
          if (onChange) onChange(value);
          setIsFocused(false);
        }}
        onInputChange={(val) => {
          setInputValue(val);
        }}
        error={error ? error : false}
        {...{
          menuIsOpen: isFocused || undefined,
          isFocused: isFocused || undefined,
        }}
      />
    </div>
  );
};

export default SingleSelect;
