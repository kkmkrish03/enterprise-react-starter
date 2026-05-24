import { render } from '@testing-library/react';

import BareBodhikaDashboard from './dashboard';

describe('BareBodhikaDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
