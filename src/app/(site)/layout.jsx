import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <MobileBar />
    </>
  );
}
