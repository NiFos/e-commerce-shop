/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages';

describe('Home page', () => {
  it('Renders without crashing', () => {
    const homeProps = {
      mainDiscount: {
        discountId: 123,
        title: 'title',
        description: 'some',
        percentDiscount: 25,
        promocode: 'promocode',
        to: new Date().toString(),
        photo: '',
      },
      lastNewProduct: {
        productId: 123,
        title: 'title',
        price: 123,
        photo: '',
      },
      popular: [
        {
          productId: 123,
          title: 'title',
          price: 123,
          photo: '',
        },
      ],
      topRated: [
        {
          productId: 123,
          title: 'title',
          price: 123,
          rating: 1,
          photo: '',
        },
      ],
    };
    render(<Home {...homeProps} />);
    jest.mock('react-i18next', () => ({
      i18n: {
        useTranslation: () => ({ t: (key) => key }),
      },
    }));
    expect(
      screen.getByRole('heading', { name: 'title', level: 5 })
    ).toBeInTheDocument();
  });
});
