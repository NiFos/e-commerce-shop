/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from '../pages/product/[id]';
import { useStore } from '../redux/store';
import { Provider } from 'react-redux';

const props = {
  product: {
    product_id: 123,
    title: 'title',
    description: 'description',
    rating: 1,
    price: 1,
    techspecs: 'techspecs',
    photo: '',
  },
  reviews: [
    {
      review_id: 123,
      created_on: new Date(),
      rating: 1,
      text: '',
      username: 'username',
    },
  ],
};

describe('Product', () => {
  it('Render without errors', () => {
    /**
     * With provider
     */
    function WithProvider({ children }) {
      const mockStore = useStore();
      return <Provider store={mockStore}>{children}</Provider>;
    }
    render(
      <WithProvider>
        <Product {...props} />
      </WithProvider>
    );
  });
  it('Add to cart', () => {
    /**
     * With provider
     */
    function WithProvider({ children }) {
      const mockStore = useStore();
      return <Provider store={mockStore}>{children}</Provider>;
    }
    render(
      <WithProvider>
        <Product {...props} />
      </WithProvider>
    );
  });
});
