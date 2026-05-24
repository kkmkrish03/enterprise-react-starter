import { render } from '@testing-library/react';

import BareBodhikaCore from './core';

describe('BareBodhikaCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaCore />);
    expect(baseElement).toBeTruthy();
  });
});
