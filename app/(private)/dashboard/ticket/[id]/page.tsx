import { Container } from "@mantine/core";
import { getTicketByIdAction } from "@/app/actions/ticketActions";
import DisplayError from "@/app/components/DisplayError/DisplayError";
import ViewTicket from "@/app/components/Ticket/ViewTicket";

interface TicketPageProps {
  params: {
    id: string;
  };
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <DisplayError
        title="Invalid Ticket ID"
        message="The ticket ID you're looking for is not valid."
        errorMessage="Invalid ticket ID format"
        backUrl="/dashboard"
        backLabel="My Dashboard"
      />
    );
  }

  const result = await getTicketByIdAction(id);

  if (!result.success || !result.data) {
    return (
      <DisplayError
        title="Ticket Not Found"
        message="We couldn't find the ticket you're looking for. It may have been deleted or you may not have permission to view it."
        errorMessage={result.message}
        backUrl="/dashboard"
        backLabel="My Dashboard"
      />
    );
  }

  return (
    <Container size="md" py="xl">
      <ViewTicket ticket={result.data.ticket} />
    </Container>
  );
}
