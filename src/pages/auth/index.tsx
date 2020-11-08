import { Button, Container, Divider, Input } from '@material-ui/core';
import { useRouter } from 'next/router';
import Axios from 'axios';

import React from 'react';
import { minLength, validateEmail } from '../../libs/validation';

interface Props {
  children?: any;
}

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
export default function Component(props: Props): JSX.Element {
  const [isReg, setIsReg] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [authData, setAuthData] = React.useState<IAuthData>({});
  const router = useRouter();

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
    setError('');
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
      const response = await Axios.post('/api/register', {
        username: authData.username?.value,
        password: authData.password?.value,
        email: authData.email?.value,
      });
      if (typeof response?.data?.user?.id === 'undefined') {
        setError(response.data?.message);
      }
      router.push('/');
    } else {
      const response = await Axios.post('/api/login', {
        password: authData.password?.value,
        email: authData.email?.value,
      });
      if (response.data?.user?.admin?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
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
      {error && <span>{error}</span>}
      <label>
        <input
          type="checkbox"
          name="isreg"
          checked={isReg}
          onChange={() => setIsReg(!isReg)}
        />
        <span>I will register</span>
      </label>
      {isReg ? (
        /* Reg form */
        <form onSubmit={submitForm}>
          <Input
            value={authData.username?.value}
            onChange={(e) => handleForm(e.target.name, e.target.value)}
            placeholder="Username"
            name="username"
          />
          <Input
            value={authData.email?.value}
            onChange={(e) => handleForm(e.target.name, e.target.value)}
            placeholder="Email"
            name="email"
          />
          <Input
            value={authData.password?.value}
            onChange={(e) => handleForm(e.target.name, e.target.value)}
            placeholder="Password"
            type="password"
            name="password"
          />
          <Button disabled={loading} onClick={submitForm}>
            Register
          </Button>
        </form>
      ) : (
        /* Login form */
        <form onSubmit={submitForm}>
          <Input
            value={authData.email?.value}
            onChange={(e) => handleForm(e.target.name, e.target.value)}
            placeholder="Email"
            name="email"
          />
          <Input
            value={authData.password?.value}
            onChange={(e) => handleForm(e.target.name, e.target.value)}
            placeholder="Password"
            type="password"
            name="password"
          />
          <Button disabled={loading} onClick={submitForm}>
            Login
          </Button>
        </form>
      )}
      <Divider />
      <Button onClick={oauthHandler}>Sign-in with Google</Button>
    </Container>
  );
}
