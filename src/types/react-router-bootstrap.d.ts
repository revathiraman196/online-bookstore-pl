declare module 'react-router-bootstrap' {
  import * as React from 'react';
  import { LinkProps } from 'react-router-dom';
  import { NavLinkProps } from 'react-router-dom';
  import { ButtonProps } from 'react-bootstrap';

  export interface LinkContainerProps extends LinkProps {
    to: string;
    replace?: boolean;
    children?: React.ReactNode;
  }

  export class LinkContainer extends React.Component<LinkContainerProps> {}
}
