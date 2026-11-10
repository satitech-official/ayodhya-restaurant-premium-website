import QRPrintSetup from "@/components/admin/QRPrintSetup";
import { pilotEnabled, tableCount } from "@/lib/qr-dinein";
export const dynamic = "force-dynamic";
export const metadata = { title:"QR Table Setup | Ayodhya Admin",robots:{index:false} };
export default function QRSetupPage() {
  return <QRPrintSetup enabled={pilotEnabled()} tableCount={tableCount()} />;
}
