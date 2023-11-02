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

import Image from "next/image";
import { Button, Card, Col, Form, Input, Row } from "antd";
import Link from "next/link";

import { useTranslations } from "next-intl";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import LogoInfo from "@/app/components/logo/LogoInfo";

export default function Init({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const chatTranslate = useTranslations("chat");
  const loginTranslate = useTranslations("login");

  return (
    <>
      <Row wrap={true} gutter={24} justify="center" className="w-full">
        <Col span={22} xs={22} sm={22} md={20} lg={10} xl={8} className="mb-32 -mt-20 lg:mb-0 lg:mt-0">
          <LogoInfo />
        </Col>
        <Col span={22} xs={22} sm={22} md={20} lg={10} xl={8}>
          <Card
            title={
              <h1 className="block mt-16 mb-2 text-lg break-words">
                {chatTranslate("slogon")}
              </h1>
            }
            hoverable
            className="relative w-full"
            style={{ backgroundColor: "rgb(255,255,255,0.5)" }}
          >
            <Link
              href="/"
              className="absolute place-items-center grid w-20 h-20 -top-10 bg-sky-100 border border-dashed border-sky-300 rounded-full transition-transform hover:shadow-lg hover:shadow-blue-200"
            >
              <Image
                src="/logo.png"
                alt="CubeBit Logo"
                width={50}
                height={50}
                priority
              />
            </Link>

            <Form name="cube_chat_login">
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: loginTranslate("username.tip") },
                ]}
              >
                <Input
                  size="large"
                  maxLength={32}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder={loginTranslate("username.placeholder")}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: loginTranslate("password.tip") },
                ]}
              >
                <Input
                  size="large"
                  maxLength={32}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder={loginTranslate("password.placeholder")}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size="large"
                >
                  {loginTranslate("button.login")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
