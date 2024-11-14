import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ServiceCard from "~/components/ServicesCard";
import { Service } from "~/schema/service";
import { getServices } from "~/utils/service.server";

export const loader: LoaderFunction = async () => {
  const services = await getServices();
  const plainServices = services
    ? services.map((service) => ({
        ...service.toObject(),
        id: service._id.toString(),
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
      }))
    : null;
  return json({ services: plainServices });
};

export default function ServicesPage() {
  const { services } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      {services.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No services available at the moment.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
