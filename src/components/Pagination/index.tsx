import { Button } from '@material-ui/core';
import React from 'react';

interface Props {
  currentPage: number;
  hasMore: boolean;
  prev: () => void;
  next: () => void;
}

/**
 * Pagination component
 */
export function Pagination(props: Props) {
  return (
    <div>
      <Button onClick={props.prev} disabled={props.currentPage < 2}>
        {props.currentPage - 1}
      </Button>
      <span>{props.currentPage}</span>
      <Button onClick={props.next} disabled={!props.hasMore}>
        {props.currentPage + 1}
      </Button>
    </div>
  );
}
