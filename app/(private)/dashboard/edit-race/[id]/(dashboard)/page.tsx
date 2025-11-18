import { testGetAction } from "@/app/actions/ticketActions";

export default async function EditRaceDashboard() {

  const result = await testGetAction(13);
  console.log(result);

  return <div>Ticket count: {result.count}</div>;
}
