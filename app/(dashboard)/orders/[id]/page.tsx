export default function Page({ params }: { params: { id: string } }) {
  return <div>Order {params.id}</div>;
}
