import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import i18n from '../../../i18n';

interface Props {
  children?: JSX.Element[];
  isOpen: boolean;
  imageSrc: string;
  submitHandler: () => void;
  uploadHandler: (files: FileList | null) => void;
}

/**
 * Upload photo modal
 */
export function UploadPhotoModal(props: Props): JSX.Element {
  const { t } = i18n.useTranslation();
  return (
    <Dialog open={props.isOpen} onClose={props.submitHandler}>
      <DialogTitle>{t('admin:products-page.upload-photo')}</DialogTitle>
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
        <Button onClick={props.submitHandler}>{t('admin:submit')}</Button>
      </DialogActions>
    </Dialog>
  );
}
