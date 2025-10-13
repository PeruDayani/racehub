import { Image } from "@mantine/core";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/home" style={{ display: "block", lineHeight: 0 }}>
      <Image
        src="/icon.png"
        alt="RaceHub Logo"
        h={32}
        w="auto"
        fit="contain"
        style={{ cursor: "pointer" }}
      />
    </Link>
  );
}
