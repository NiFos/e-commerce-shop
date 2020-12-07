import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  Input,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import Axios from 'axios';

import React from 'react';
import { minLength, validateEmail } from '../../libs/validation';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../redux/reducers/user';
import { RootState } from '../../redux/store';
import i18n from '../../../i18n';

const useStyles = makeStyles({
  auth: {
    width: '40%',
    margin: '0 auto',
  },
  inputs: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    marginTop: '5px',
  },
  googleBtn: {
    width: '100%',
    textAlign: 'center',
  },
});

export interface IAuthData {
  username?: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
  email?: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
  password?: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
}

/**
 * Auth page
 */
export default function Component(): JSX.Element {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = i18n.useTranslation();
  const state = useSelector((state: RootState) => state);
  const [isReg, setIsReg] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [authData, setAuthData] = React.useState<IAuthData>({});
  const router = useRouter();

  React.useEffect(() => {
    if (typeof state?.user?.me?.user?.userid !== 'undefined') {
      if (state?.user?.me?.user?.admin?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [state]);

  /**
   * Change authData
   * @param type - Type (username, email, password)
   * @param value - Value
   */
  function handleForm(type: string, value: string) {
    let valid = false;
    if (type === 'username') valid = minLength(value, 6);
    else if (type === 'password') valid = minLength(value, 6);
    else if (type === 'email') valid = validateEmail(value);
    setAuthData({
      ...authData,
      [type]: {
        touched: true,
        valid,
        value,
      },
    });
  }

  /**
   * Submit form to api
   */
  async function submitForm() {
    setLoading(true);
    if (isReg) {
      if (
        typeof authData.username?.value !== 'undefined' ||
        typeof authData.email?.value !== 'undefined' ||
        typeof authData.password?.value !== 'undefined'
      ) {
        const data = {
          username: authData.username?.value || '',
          password: authData.password?.value || '',
          email: authData.email?.value || '',
        };
        dispatch(register(data));
      }
    } else {
      if (
        typeof authData.username?.value !== 'undefined' ||
        typeof authData.email?.value !== 'undefined' ||
        typeof authData.password?.value !== 'undefined'
      ) {
        const data = {
          password: authData.password?.value || '',
          email: authData.email?.value || '',
        };
        dispatch(login(data));
      }
    }
    setLoading(false);
  }

  /**
   * Get google oauth url and redirect google
   */
  async function oauthHandler() {
    const url = await Axios.get('/api/oauth/geturl');
    router.push(url.data.url);
  }
  return (
    <Container>
      <Card className={classes.auth}>
        <CardContent>
          <Typography variant={'h6'} align={'center'}>
            {t('auth.auth')}
          </Typography>
          {state?.user?.authError && <span>{state?.user?.authError}</span>}
          <label>
            <Checkbox
              name={'register'}
              checked={isReg}
              onChange={() => setIsReg(!isReg)}
            />
            <span>{t('auth.i-want-register')}</span>
          </label>
          {isReg ? (
            /* Reg form */
            <form onSubmit={submitForm}>
              <div className={classes.inputs}>
                <Input
                  value={authData.username?.value}
                  onChange={(e) => handleForm(e.target.name, e.target.value)}
                  placeholder={t('auth.username')}
                  name="username"
                  className={classes.input}
                />
                <Input
                  value={authData.email?.value}
                  onChange={(e) => handleForm(e.target.name, e.target.value)}
                  placeholder={t('auth.email')}
                  name="email"
                  className={classes.input}
                />
                <Input
                  value={authData.password?.value}
                  onChange={(e) => handleForm(e.target.name, e.target.value)}
                  placeholder={t('auth.password')}
                  type="password"
                  name="password"
                  className={classes.input}
                />
              </div>

              <Button
                disabled={loading}
                onClick={submitForm}
                name="registerBtn"
              >
                {t('auth.register')}
              </Button>
            </form>
          ) : (
            /* Login form */
            <form onSubmit={submitForm}>
              <div className={classes.inputs}>
                <Input
                  value={authData.email?.value}
                  onChange={(e) => handleForm(e.target.name, e.target.value)}
                  placeholder={t('auth.email')}
                  name="email"
                  className={classes.input}
                />
                <Input
                  value={authData.password?.value}
                  onChange={(e) => handleForm(e.target.name, e.target.value)}
                  placeholder={t('auth.password')}
                  type="password"
                  name="password"
                  className={classes.input}
                />
              </div>

              <Button disabled={loading} onClick={submitForm} name="loginBtn">
                {t('auth.login')}
              </Button>
            </form>
          )}
          <Divider />
          <Button onClick={oauthHandler} className={classes.googleBtn}>
            {t('auth.sign-in-with-google')}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
