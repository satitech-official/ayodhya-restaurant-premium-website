import QRGuestMenu from "@/components/QRGuestMenu";
import { getMenuItems, getCategories } from "@/lib/data";
import { pilotEnabled, tableCount } from "@/lib/qr-dinein";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dine-in QR Ordering | Ayodhya Restaurant Betul",
  robots: { index: false, follow: false },
};
export default async function QROrderPage({ searchParams }) {
  const params = await searchParams;
  const [items,categories] = await Promise.all([getMenuItems(), getCategories()]);
  return <QRGuestMenu
    items={items} categories={categories}
    initialTable={typeof params?.table === "string" ? params.table : ""}
    enabled={pilotEnabled()} tableCount={tableCount()}
  />;
}
