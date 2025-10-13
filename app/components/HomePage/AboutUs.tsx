import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  CircleCheck,
  Clock,
  MapPin,
  Smartphone,
  TrendingUp,
  Zap,
} from "lucide-react";
import styles from "./index.module.css";

const steps = [
  {
    number: 1,
    title: "Register & Download",
    description:
      "Runners register online and download the RaceHub app or connect their GPS watch before race day.",
  },
  {
    number: 2,
    title: "Start Tracking",
    description:
      "On race day, runners activate GPS tracking. The system monitors their location and verifies course completion.",
  },
  {
    number: 3,
    title: "Automatic Results",
    description:
      "Times are logged when runners complete the course. Results post instantly with verified GPS data.",
  },
];

const features = [
  {
    icon: Smartphone,
    title: "GPS-Based Tracking",
    description:
      "Runners use their own GPS devices or smartphone apps to track their race. No bibs, no chips, no equipment rentals.",
  },
  {
    icon: MapPin,
    title: "Automatic Location Verification",
    description:
      "Our system verifies runners are on the correct course using GPS coordinates, ensuring accurate race participation.",
  },
  {
    icon: Clock,
    title: "Real-Time Results",
    description:
      "Race times are logged automatically when runners cross virtual finish lines, with instant result posting and leaderboards.",
  },
  {
    icon: TrendingUp,
    title: "Detailed Analytics",
    description:
      "Runners get comprehensive pace data, split times, and route maps. Organizers get detailed participation metrics.",
  },
];

const benefits = [
  "Eliminate costly bib printing and timing equipment",
  "Reduce race day setup and logistics complexity",
  "No physical packet pickup required",
  "Eco-friendly digital-first approach",
  "Runners keep their personal race data",
  "Instant result verification and publishing",
];

export default function AboutUs() {
  return (
    <Box py={{ base: 60, md: 80 }} className={styles.bgGradientBlue}>
      <Container size="xl">
        {/* Header Section */}
        <Stack align="center" mb={{ base: 50, md: 64 }}>
          <Badge
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            leftSection={<Zap size={20} />}
            className={styles.badgeCustom}
          >
            Revolutionary Technology
          </Badge>

          <Title
            order={2}
            ta="center"
            fw={700}
            className={styles.responsiveSubtitle}
          >
            Go Bib Free
          </Title>

          <Text
            c="dimmed"
            ta="center"
            maw={800}
            lh={1.7}
            className={styles.responsiveBodyLarge}
          >
            Say goodbye to physical bibs, timing chips, and expensive equipment.
            RaceHub uses GPS technology to track runners and log results
            entirely through their personal devices—making races simpler, more
            affordable, and environmentally friendly.
          </Text>
        </Stack>

        {/* How GPS Tracking Works Card */}
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          mb={{ base: 50, md: 64 }}
          maw={1000}
          mx="auto"
          className={styles.glassCard}
        >
          <Title order={3} ta="center" mb="xl" size="h3">
            How GPS Tracking Works
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb="xl">
            {steps.map((step) => (
              <Stack key={step.number} align="center" gap="md">
                <Box w={64} h={64} bg="blue.1" className={styles.iconCircle}>
                  <Text size="xl" fw={700} c="blue">
                    {step.number}
                  </Text>
                </Box>
                <Title order={4} size="h5" ta="center">
                  {step.title}
                </Title>
                <Text size="md" c="dimmed" ta="center" lh={1.6}>
                  {step.description}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>

          {/* Virtual Checkpoints Section */}
          <Box pt="xl" mt="xl" className={styles.borderTop}>
            <Box p="lg" bg="blue.0" className={styles.rounded}>
              <Group gap="md" align="flex-start" wrap="nowrap">
                <Box className={styles.flexShrinkNone} style={{ marginTop: 4 }}>
                  <MapPin size={24} color="#228be6" />
                </Box>
                <Stack gap="xs">
                  <Title order={4} size="h5">
                    Virtual Checkpoints & Finish Lines
                  </Title>
                  <Text size="md" c="dimmed" lh={1.6}>
                    Race organizers define virtual start and finish zones using
                    GPS coordinates. When a runner's device enters these zones,
                    their time is automatically recorded with millisecond
                    precision. The system validates that runners followed the
                    course by checking their GPS path against the official
                    route.
                  </Text>
                </Stack>
              </Group>
            </Box>
          </Box>
        </Card>

        {/* Feature Cards Grid */}
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="md"
          mb={{ base: 50, md: 64 }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                bg="white"
                className={styles.featureCard}
              >
                <Stack gap="md">
                  <Box w={48} h={48} bg="blue.1" className={styles.iconBox}>
                    <Icon size={24} color="#228be6" />
                  </Box>
                  <Title order={4} size="h5">
                    {feature.title}
                  </Title>
                  <Text size="md" c="dimmed" lh={1.6}>
                    {feature.description}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        {/* Benefits Card */}
        <Card
          shadow="md"
          padding="xl"
          radius="md"
          maw={900}
          mx="auto"
          className={styles.bgGradientBlueDark}
          style={{ border: "none" }}
        >
          <Stack gap="xl">
            <Title order={3} ta="center" c="white" size="h3">
              Benefits for Everyone
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {benefits.map((benefit) => (
                <Group key={benefit} gap="sm" align="flex-start" wrap="nowrap">
                  <Box
                    className={styles.flexShrinkNone}
                    style={{ marginTop: 2 }}
                  >
                    <CircleCheck size={24} color="white" />
                  </Box>
                  <Text
                    c="white"
                    size="md"
                    lh={1.6}
                    className={styles.opacity95}
                  >
                    {benefit}
                  </Text>
                </Group>
              ))}
            </SimpleGrid>

            <Box pt="xl" mt="lg" ta="center" className={styles.borderTopWhite}>
              <Text c="white" size="lg" mb="md" className={styles.opacity90}>
                Ready to organize a modern, tech-forward race?
              </Text>
              <Button
                size="lg"
                radius="md"
                variant="white"
                c="blue"
                component="a"
                href="/dashboard"
                fw={500}
              >
                Start Planning Your Race
              </Button>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
