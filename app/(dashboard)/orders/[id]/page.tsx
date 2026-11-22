
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      statusHistory: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const customerName = order.user.name?.trim() || order.user.email;

  const amount =
    order.amountCents === null
      ? "Not set"
      : `$${(order.amountCents / 100).toFixed(2)}`;

  return (
    <div className="max-w-5xl space-y-6 lg:ml-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Order details
          </h1>
          <p className="mt-1 text-base text-slate-600">
            {order.reference}
          </p>
        </div>

        <Link
          href="/orders"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span aria-hidden="true">←</span>
          Back to orders
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Order information
        </h2>

        <dl className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Customer
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              {customerName}
            </dd>
          </div>

          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Email
            </dt>
            <dd className="mt-2 break-words text-base text-slate-800">
              {order.user.email}
            </dd>
          </div>

          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Amount
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              {amount}
            </dd>
          </div>

          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Status
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">
              {formatStatus(order.status)}
            </dd>
          </div>

          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Created at
            </dt>
            <dd className="mt-2 text-base text-slate-800">
              {dateFormatter.format(order.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-[15px] font-medium text-slate-500">
              Updated at
            </dt>
            <dd className="mt-2 text-base text-slate-800">
              {dateFormatter.format(order.updatedAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Status history
        </h2>

        <div className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
          {order.statusHistory.length === 0 ? (
            <p className="py-5 text-base text-slate-500">
              No status history available.
            </p>
          ) : (
            order.statusHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-base font-medium text-slate-800">
                  {formatStatus(entry.status)}
                </span>

                <time
                  dateTime={entry.createdAt.toISOString()}
                  className="text-[15px] text-slate-500"
                >
                  {dateFormatter.format(entry.createdAt)}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
