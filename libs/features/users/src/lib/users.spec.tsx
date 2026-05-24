import { render } from '@testing-library/react';

import BareBodhikaUsers from './users';

describe('BareBodhikaUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaUsers />);
    expect(baseElement).toBeTruthy();
  });
});
