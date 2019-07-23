import { css } from 'styled-components';

export const container = css`
  border: 20px solid #ecd3ee;
`;

export const center = css`
  background: #ecd3ee;
  &:not(:empty):hover {
    cursor: pointer;
  }
  > svg {
    position: relative;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
  }
`;

export const slice = css`
  cursor: pointer;
  color: grey;
  background: radial-gradient(transparent 30px, #eee3ef 30px);
  &[filled='true'] {
    color: black;
  }
  &:hover,
  &[active='true'] {
    color: black;
    background: radial-gradient(transparent 30px, #eee 30px);
  }
`;
