import React from "react";

import styled from "styled-components";

const SnackbarStyled = styled.div`
  overflow: hidden;
  max-width: 80vw;
  justify-content: center;
  display: flex;
  background-color: palevioletred;
  padding: 12px;
  border-radius: 30px;
  z-index: 10;
  margin: 10px;
`;

export const Snackbar = ({ message, ...props }) => {
  return <SnackbarStyled>{message}</SnackbarStyled>;
};
