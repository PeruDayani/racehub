'use client'

import {
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Badge,
  ThemeIcon,
  Divider
} from '@mantine/core'
import { format } from 'date-fns'
import {
  MapPin,
  ExternalLink,
  Printer,
  CreditCard,
  Trophy,
  Calendar,
  Clock,
  Receipt
} from 'lucide-react'
import type { Ticket } from '@/app/lib/types'
import PageHeader from '../PageHeader.tsx/PageHeader'

interface ViewTicketProps {
  ticket: Ticket
}

export default function ViewTicket ({ ticket }: ViewTicketProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD'
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy')
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'TBD'
    return format(new Date(dateString), 'h:mm a')
  }

  const formatCurrency = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(cents / 100)
  }

  const openInGoogleMaps = () => {
    if (!ticket?.race.address) return

    const { line1, city, state, postalCode, country } = ticket.race.address
    const address = `${line1}, ${city}, ${state} ${postalCode}, ${country}`
    const encodedAddress = encodeURIComponent(address)
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      '_blank'
    )
  }

  const printTicket = () => {
    window.print()
  }

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <Box p='xl' maw={900} mx='auto'>
        <Stack gap='lg' pos='relative'>
          {/* Header with print button */}
          <Stack
            gap='sm'
            pos='sticky'
            top={80}
            py={12}
            style={{
              zIndex: 200,
              backgroundColor: 'var(--mantine-color-body)'
            }}
            className='no-print'
          >
            <Group justify='space-between' align='center'>
              <PageHeader
                title='Your Ticket'
                description='View your race ticket details'
              />
              <Button
                leftSection={<Printer size={16} />}
                onClick={printTicket}
                variant='light'
              >
                Print Ticket
              </Button>
            </Group>
          </Stack>

          <Stack gap='xl' px={2}>
            {/* Race Information Section */}
            <Card
              withBorder
              shadow='md'
              radius='lg'
              p='lg'
            >
              {/* Header */}
              <Group justify='space-between' align='center'>
                <Group align='center' gap='sm'>
                  {ticket.race.website?.logo ? (
                    <Image
                      src={ticket.race.website.logo.url}
                      alt={`${ticket.race.name} logo`}
                      height={48}
                      width={48}
                      radius='md'
                      style={{
                        objectFit: 'contain',
                        maxWidth: '48px',
                        maxHeight: '48px',
                        padding: 4
                      }}
                    />
                  ) : (
                    <ThemeIcon
                      color='blue'
                      variant='light'
                      radius='md'
                      size={48}
                    >
                      <Trophy size={24} />
                    </ThemeIcon>
                  )}
                  <Stack gap={0}>
                    <Text fw={600} size='lg'>
                      {ticket.race.name}
                    </Text>
                    <Text size='sm'>{ticket.raceOption.name}</Text>
                  </Stack>
                </Group>
              </Group>

              <Divider my='xl' />

              {/* Race Info Section */}
              <Stack gap='xl'>
                {/* Date & Time */}
                <Group align='center' gap='sm'>
                  <ThemeIcon color='blue' variant='light' radius='md' size={48}>
                    <Calendar size={24} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text>{formatDate(ticket.race.date)}</Text>
                    <Text>{formatTime(ticket.race.date)}</Text>
                  </Stack>
                </Group>

                {/* Location */}
                <Group align='flex-start' gap='sm'>
                  <ThemeIcon color='red' variant='light' radius='md' size={48}>
                    <MapPin size={24} />
                  </ThemeIcon>

                  <Stack gap={4} style={{ flex: 1 }}>
                    {ticket.race.address ? (
                      <>
                        <Text>{ticket.race.address.line1}</Text>
                        <Text>
                          {ticket.race.address.city},{' '}
                          {ticket.race.address.state}{' '}
                          {ticket.race.address.postalCode}
                        </Text>
                      </>
                    ) : (
                      <Text size='sm' c='dimmed'>
                        Location TBD
                      </Text>
                    )}
                  </Stack>

                  <Button
                    variant='light'
                    size='xs'
                    leftSection={<ExternalLink size={12} />}
                    onClick={openInGoogleMaps}
                    mt={6}
                    className='no-print'
                  >
                    View on Google Maps
                  </Button>
                </Group>
              </Stack>
            </Card>

            {/* Payment Details Section */}
            <Card
              withBorder
              shadow='md'
              radius='lg'
              p='lg'
            >
              {/* Header */}
              <Group justify='space-between' align='center'>
                <Group align='center' gap='sm'>
                  <ThemeIcon color='green' variant='light' radius='md' size={48}>
                    <CreditCard size={24} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text fw={600} size='lg'>
                      Payment Details
                    </Text>
                    <Text size='sm'>
                      Paid
                    </Text>
                  </Stack>
                </Group>
              </Group>

              <Divider my='xl' />

              {/* Payment Info Section */}
              <Stack gap='xl'>
                {/* Amount Paid */}
                <Group align='center' gap='sm'>
                  <ThemeIcon color='green' variant='light' radius='md' size={48}>
                    <Receipt size={24} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text>Amount paid</Text>
                    <Text>{formatCurrency(ticket.finalAmountCents, ticket.currency)}</Text>
                  </Stack>
                </Group>

                {/* Purchase Date */}
                <Group align='center' gap='sm'>
                  <ThemeIcon color='blue' variant='light' radius='md' size={48}>
                    <Clock size={24} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text>Purchase date</Text>
                    <Text>{format(new Date(ticket.createdAt), "MMM dd, yyyy 'at' h:mm a")}</Text>
                  </Stack>
                </Group>
              </Stack>
            </Card>

            {/* Print notice */}
            <Text size='xs' c='dimmed' ta='center' className='print-only'>
              This ticket was generated on{' '}
              {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
