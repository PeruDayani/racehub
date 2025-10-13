import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Calendar, Trophy, Users } from "lucide-react";
import styles from "./index.module.css";

const stats = [
  { number: "2,500+", label: "Races Organized" },
  { number: "50K+", label: "Happy Runners" },
  { number: "150+", label: "Cities" },
];

export default function Hero() {
  return (
    <Container fluid px="xl" py={{ base: "xl", sm: 60, md: 80 }} mih={"100vh"}>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: "xl", md: 60 }}>
        {/* Left Content Section */}
        <Stack gap="xl" justify="center">
          {/* Title Section */}
          <Stack gap="sm">
            <Title
              order={1}
              fw={800}
              lh={1.1}
              className={styles.responsiveTitle}
            >
              Organize & Discover
              <Text component="span" inherit className={styles.gradientText}>
                5K Races
              </Text>
              <Text component="span" inherit style={{ display: "block" }}>
                Near You
              </Text>
            </Title>

            <Text size="xl" c="dimmed" lh={1.6} maw={800}>
              Connect local runners with amazing 5K races. Whether you're
              organizing or participating, we make it simple to find your next
              race.
            </Text>
          </Stack>

          {/* CTA Buttons */}
          <Flex gap="md" direction={{ base: "column", sm: "row" }}>
            <Button
              size="lg"
              radius="md"
              variant="filled"
              color="blue"
              leftSection={<Calendar size={20} />}
              className={styles.shadowButton}
              component="a"
              href="/races"
            >
              Find Races
            </Button>
            <Button
              size="lg"
              radius="md"
              variant="outline"
              color="blue"
              leftSection={<Users size={20} />}
              className={styles.shadowButton}
              component="a"
              href="/events"
            >
              Organize a Race
            </Button>
          </Flex>

          {/* Stats Section */}
          <Group gap="lg" pt="md" wrap="nowrap">
            {stats.map((stat) => (
              <Box key={stat.label} className={styles.textCenter}>
                <Text fw={700} c="blue" className={styles.responsiveStatNumber}>
                  {stat.number}
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  className={styles.responsiveStatLabel}
                >
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Group>
        </Stack>

        {/* Right Image Section */}
        <Box pos="relative">
          <Box
            pos="relative"
            className={`${styles.roundedImage} ${styles.shadowLarge}`}
          >
            <Image
              src="/heroImage.jpeg"
              alt="Runners at 5K race starting line"
              radius="md"
              fit="cover"
              h={{ base: 350, sm: 450, lg: 600 }}
            />

            {/* Gradient Overlay */}
            <Box
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              className={styles.gradientOverlay}
            />
          </Box>

          {/* Next Race Card */}
          <Box
            pos="absolute"
            bottom={{ base: -20, sm: -24 }}
            left={{ base: 16, sm: -24 }}
            bg="white"
            p={{ base: "md", sm: "lg" }}
            className={styles.floatingCard}
          >
            <Group gap="md" wrap="nowrap">
              <Box w={48} h={48} bg="blue.0" className={styles.iconCircle}>
                <Trophy size={24} color="#228be6" />
              </Box>
              <Box style={{ minWidth: 0 }}>
                <Text fw={600} size="md" c="dark" truncate>
                  Next Race
                </Text>
                <Text size="sm" c="dimmed" truncate>
                  Spring Valley 5K - April 15th
                </Text>
              </Box>
            </Group>
          </Box>

          {/* Decorative gradient element */}
          <Box
            pos="absolute"
            top={-20}
            right={-20}
            w={150}
            h={150}
            className={styles.decorativeGradient}
            display={{ base: "none", lg: "block" }}
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
}
