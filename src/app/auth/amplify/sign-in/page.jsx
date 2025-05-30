import { CONFIG } from 'src/global-config';

import { AmplifySignInView } from 'src/auth/view/amplify';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Amplify - ${CONFIG.appName}` };

export default function Page() {
  return <AmplifySignInView />;
}
