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

import { Form, Input } from "antd";
import { CSSProperties } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";

export default function ChatInput({
  onSubmit,
  loading,
  className,
  style,
}: {
  onSubmit?: (values: any) => void;
  loading?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}) {
  return (
    <Form
      name="basic"
      wrapperCol={{ span: 16 }}
      className={`container relative my-8 lg:w-1/2 md:w-3/4 sm:w-full ${className}`}
      style={style}
      onFinish={(values) => !!onSubmit && onSubmit(values)}
    >
      <Form.Item
        name="username"
        wrapperCol={{ span: 24 }}
        className="block w-full resize-none rounded-xl border-none bg-slate-100 shadow-md p-14"
        style={{ paddingLeft: 14 }}
      >
        <Input
          className="h-14 w-full border-none bg-slate-100 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
          placeholder={loading ? "Waiting Response ..." : "Enter your prompt and Chat with me!"}
          bordered={false}
          autoFocus
          size="large"
          disabled={loading}
          suffix={
            <button
              type="submit"
              className={`absolute bottom-2 right-2.5 rounded-lg bg-blue-100 p-2 text-sm w-10 h-10 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 sm:text-base ${loading ? 'cursor-progress' : 'hover:bg-blue-200'}`}
              disabled={loading}
            >
              {loading ? (
                <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div>
              ) : (
                <Image
                  className="relative"
                  src="/logo.png"
                  alt="CubeBit Logo"
                  width={24}
                  height={24}
                  priority
                />
              )}
              <span className="sr-only">Send message</span>
            </button>
          }
        />
      </Form.Item>
    </Form>
  );
}
