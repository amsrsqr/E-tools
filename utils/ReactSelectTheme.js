export const reactSelectTheme = (error) => (theme) => {
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

export const selectStyle = {
  control: (base, state) => ({
    ...base,
    //border: 1,
    // This line disable the blue border
    // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
    //   '&:hover': {
    //     border: 0,
    //     boxShadow: "0px 0px 0px 5px #c2dbfe !important"
    //  },
  }),
};
