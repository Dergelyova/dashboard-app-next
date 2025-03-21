import { CONFIG } from 'src/global-config';

import { MultiLanguageView } from 'src/sections/_examples/extra/multi-language-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Multi language | Components - ${CONFIG.appName}` };

export default async function Page() {
  // Mock data for the MultiLanguageView component
  const mockNavData = {
    // Example mock data
    navbar: [
      { title: 'Home', link: '/' },
      { title: 'About', link: '/about' },
      { title: 'Services', link: '/services' },
      { title: 'Contact', link: '/contact' },
    ],
  };

  return <MultiLanguageView ssrNavData={mockNavData} />;
}
