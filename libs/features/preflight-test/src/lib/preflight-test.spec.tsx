import { render } from '@testing-library/react';

import BareBodhikaPreflightTest from './preflight-test';

describe('BareBodhikaPreflightTest', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaPreflightTest />);
    expect(baseElement).toBeTruthy();
  });
});
