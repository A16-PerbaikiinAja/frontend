import PaymentMethodDetail from "@/components/payment-method-detail"
import BackButton from "@/components/back-button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Props {
  params: Promise<{ id: string }>
}

const UserPaymentMethodDetailPage = async ({ params }: Props) => {
    const { id } = await params

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/dashboard/payment-methods/active" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Metode Pembayaran</h1>
          <p className="text-muted-foreground">Informasi metode pembayaran</p>
        </div>
      </div>

      <PaymentMethodDetail id={id} isAdmin={false} />
    </div>
    </DashboardLayout>
  )
}

export default UserPaymentMethodDetailPage