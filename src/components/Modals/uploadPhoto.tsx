import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

interface Props {
  children?: any;
  isOpen: boolean;
  imageSrc: string;
  submitHandler: () => void;
  uploadHandler: (files: any) => void;
}

/**
 * Upload photo modal
 */
export function UploadPhotoModal(props: Props): JSX.Element {
  return (
    <Dialog open={props.isOpen} onClose={props.submitHandler}>
      <DialogTitle>Upload photo</DialogTitle>
      <DialogContent>
        <img src={props.imageSrc} alt="Photo" />
        <input
          type="file"
          onChange={(e) => props.uploadHandler(e.target.files)}
          multiple={false}
          accept={'image/*'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.submitHandler}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
