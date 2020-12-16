/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Auth from '../pages/auth';
import { useStore } from '../redux/store';
import { Provider } from 'react-redux';

describe('Auth page', () => {
  test('Login without error', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        user: {
          id: 123,
          username: 'username',
          admin: {
            isAdmin: false,
            fullAccess: false,
          },
        },
      })
    );
    /* jest.spyOn(window, 'fetch').mockResolvedValue({
      json: () => ({
        user: {
          id: 123,
          username: 'username',
          admin: {
            isAdmin: false,
            fullAccess: false,
          },
        },
      }),
    }); */

    /**
     * With provider func
     */
    function WithProvider({ children }) {
      const mockStore = useStore();
      return <Provider store={mockStore}>{children}</Provider>;
    }
    render(
      <WithProvider>
        <Auth />
      </WithProvider>
    );

    const register = screen.getByRole('checkbox', {
      name: 'auth.i-want-register',
    });
    expect(register).not.toBeChecked();
    const email = screen.getByPlaceholderText('auth.email');
    const password = screen.getByPlaceholderText('auth.password');
    /* const email = screen.getByRole('textbox', { name: 'email' });
    const password = screen.getByRole('textbox', { name: 'password' }); */
    const loginBtn = screen.getByText('auth.login');
    /* const loginBtn = screen.getByRole('button', { name: 'auth.login' }); */

    fireEvent.change(email, { target: { value: 'some@mail.com' } });
    fireEvent.change(password, { target: { value: '123456' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(loginBtn).toBeDisabled();
    });
  });
});
