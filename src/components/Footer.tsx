"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaGithub } from "react-icons/fa6";
import { Indicator } from "./ui/indicator";

// TODO get this pusherStatus outta hereee TT - prop-drilling
interface FooterProps {
  isPusherActive: boolean;
}

export default function Footer({ isPusherActive }: FooterProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isCreatePage = pathname === "/create";

  return (
    <footer className="bg-secondary text-primary-content mt-2 flex w-full items-center justify-center px-6 py-2 text-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          Pusher Status:{" "}
          <Indicator variant={isPusherActive ? "online" : "offline"} />
        </div>

        <div className="flex items-center justify-center gap-2">
          <p>
            Made by{" "}
            <Link href="https://cindyc-dev.github.io/" target="_blank">
              Cindy C.
            </Link>{" "}
            🤟
          </p>
          <Link href="https://github.com/cindyc-dev/quizoo" target="_blank">
            <FaGithub className="text-xl" />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p>
            {!isCreatePage && (
              <Link href="/create" className="underline">
                Create Game
              </Link>
            )}
            {!isCreatePage && !isHomePage && <span> • </span>}
            {!isHomePage && (
              <Link href="/" className="underline">
                Join Game
              </Link>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
