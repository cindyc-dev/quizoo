"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isCreatePage = pathname === "/create";

  return (
    <footer className="bg-secondary text-primary-content mt-2 flex w-full items-center justify-center py-2 text-xs">
      <div className="flex flex-col">
        <div className="flex gap-2">
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
          <p>|</p>
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
      </div>
    </footer>
  );
}
