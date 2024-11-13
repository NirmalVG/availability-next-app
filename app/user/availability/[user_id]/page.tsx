import AvailabilityForm from "@/components/AvailabilityForm";

const userAvailabilityPage = async ({
  params,
}: {
  params: { user_id: string };
}) => {
  const response = await fetch(
    `${process.env.URL}/api/getAvailability/${params.user_id}`
  );

  if (!response.ok) {
    console.error("Failed to fetch availability data.");
  }

  const data = await response.json();
  console.log("Fetched data:", data);

  return (
    <div className="container mx-auto p-4">
      <AvailabilityForm slug={params.user_id} data={data} />
    </div>
  );
};

export default userAvailabilityPage;
