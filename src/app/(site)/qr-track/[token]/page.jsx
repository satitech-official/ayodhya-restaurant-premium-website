import QRTracking from "@/components/QRTracking";
export const dynamic = "force-dynamic";
export const metadata = { title: "Track Dine-in Order | Ayodhya Restaurant", robots:{index:false,follow:false} };
export default async function TrackPage({params}) {
  const {token}=await params;
  return <QRTracking token={token}/>;
}
