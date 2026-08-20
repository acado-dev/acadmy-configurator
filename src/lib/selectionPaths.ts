// Selection modules are shared between the master admin ("/...") and
// university admin ("/university/...") layouts. Links resolve at render time.
export const selBase = () =>
  window.location.pathname.startsWith('/university') ? '/university' : '';
