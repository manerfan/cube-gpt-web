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

import { useRouter, usePathname } from "next-intl/client";
import { Button } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useState } from "react";

import styles from "./styles.module.scss";

export default function LanguageChanger({
  size,
  className,
  params: { locale },
}: {
  size?: SizeType;
  className?: string;
  params: { locale: string };
}) {
  const [language, setLanguage] = useState(locale);
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = () => {
    const l = language === "en" ? "zh" : "en";
    router.push(pathname, { locale: l });
    setLanguage(l);
  };
  return (
    <Button
      type="link"
      size={size}
      className={`${styles["acss-btn"]} ${className || ""}`}
      onClick={handleChange}
    >
      <div className={styles["btn-inner"]}>
        <div className={styles["acss-inner"]}>
          <span
            className={
              language === "zh"
                ? styles["acss-active"]
                : styles["acss-disactive"]
            }
          >
            中
          </span>
          <span
            className={
              language === "zh"
                ? styles["acss-disactive"]
                : styles["acss-active"]
            }
          >
            En
          </span>
        </div>
      </div>
    </Button>
  );
}
