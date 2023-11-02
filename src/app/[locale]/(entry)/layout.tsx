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

"use client";

import { Layout } from "antd";
import styles from "./styles.module.scss";
import Background from "./Background";

import HomeHeader from "../HomeHeader";

export default function LoginLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Layout className={`w-screen min-h-screen ${styles.layout}`}>
        <Background />
        <HomeHeader className="m-auto mt-4" params={{ locale }} />
        <Layout.Content className="place-items-center grid">
          {children}
        </Layout.Content>
      </Layout>
    </>
  );
}
