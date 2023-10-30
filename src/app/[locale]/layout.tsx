/**
 * Copyright 2023 Maner·Fan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import StyledComponentsRegistry from "@/libs/AntdRegistry";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export const metadata: Metadata = {
  title: "Cube Chat | Speek FREELY with Me!",
  description: "Speek FREELY with Me!",
  applicationName: "Cube Chat",
  authors: [
    {
      name: "Maner·Fan",
      url: "https://github.com/manerfan",
    },
  ],
  keywords: ["gpt", "chatgpt", "aigc"],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
