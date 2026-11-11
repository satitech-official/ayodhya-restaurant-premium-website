import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QRPrintSetup from "@/components/admin/QRPrintSetup";
import { verifyQrStaffToken } from "@/lib/qr-staff-auth";
import { pilotEnabled, tableCount } from "@/lib/qr-dinein";
export const dynamic="force-dynamic";
export const metadata={title:"Ayodhya Table QR Cards",robots:{index:false,follow:false}};
export default async function StaffQrPrintPage(){
  const cookieStore=await cookies();
  const token=cookieStore.get("ayodhya_qr_staff")?.value||"";
  if(!verifyQrStaffToken(token)) redirect("/qr-staff");
  return <main className="min-h-screen bg-cream px-4 py-10 sm:px-8"><div className="mx-auto max-w-6xl">
    <QRPrintSetup enabled={pilotEnabled()} tableCount={tableCount()} backHref="/qr-staff"/>
  </div></main>;
}
