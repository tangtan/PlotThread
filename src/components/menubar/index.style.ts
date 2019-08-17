import { css } from 'styled-components';

export const container = css`
  border: none;
`;

export const center = css`
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 7px 0 rgba(131, 131, 131, 0.5);
  &:not(:empty):hover {
    cursor: pointer;
  }
  > svg {
    position: relative;
    bottom: calc(50% - 20px);
    right: calc(50% - 20px);
  }
`;

export const slice = css`
  cursor: pointer;
  color: grey;
  opacity: 0.78;
  background: #535663;
  box-shadow: 0 2px 7px 0 rgba(131, 131, 131, 0.5);
  &[filled='true'] {
    color: black;
  }
  &:hover,
  &[active='true'] {
    color: black;
    background: radial-gradient(transparent 30px, #eee 30px);
  }
`;
