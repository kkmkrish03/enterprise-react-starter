import { render } from '@testing-library/react';

import BareBodhikaAuth from './auth';

describe('BareBodhikaAuth', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaAuth />);
    expect(baseElement).toBeTruthy();
  });
});
