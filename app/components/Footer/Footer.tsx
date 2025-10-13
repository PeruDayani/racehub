import { Box, Text } from "@mantine/core";
import styles from "./index.module.css";

export default function Footer() {
  return (
    <Box className={styles.footer}>
      <Text size="sm" c="dimmed">
        © 2025 RaceHub. All rights reserved.
      </Text>
    </Box>
  );
}
