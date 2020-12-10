import { Button, Container, makeStyles, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import i18n from '../../../i18n';

const useStyles = makeStyles({
  success: {
    textAlign: 'center',
    '& > *': {
      marginTop: '10px',
    },
  },
});

/**
 * Success page
 */
export default function Component(): JSX.Element {
  const classes = useStyles();
  const router = useRouter();
  const { t } = i18n.useTranslation();
  return (
    <Container>
      <div className={classes.success}>
        <Typography variant="h5">{t('checkout-success')}</Typography>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={() => router.push('/profile')}
        >
          {t('go-to-profile')}
        </Button>
      </div>
    </Container>
  );
}
