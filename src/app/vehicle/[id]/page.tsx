import VehicleDetail from "@/components/sections/VehicleDetail/VehicleDetail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params

  return <VehicleDetail vehicleId={id} />
}
