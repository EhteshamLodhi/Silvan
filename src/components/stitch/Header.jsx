import { getMenu } from '../../utils/shopify';
import { getStorefrontDirectories } from '../../lib/storefrontData';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const [menu, storefrontDirectories] = await Promise.all([
    getMenu('main-menu'),
    getStorefrontDirectories(),
  ]);

  return (
    <HeaderClient
      menu={menu}
      collections={storefrontDirectories.collections}
      brands={storefrontDirectories.brands}
      spaces={storefrontDirectories.spaces}
    />
  );
}
