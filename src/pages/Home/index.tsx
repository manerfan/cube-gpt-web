/**
 * Copyright 2024 Maner·Fan
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

import BackgroundBanderole from "@/components/background/BackgroundBanderole";
import HeaderSimple from "@/components/header/HeaderSimple";
import { ThemeProvider } from "@lobehub/ui";
import Footer from '@/components/footer/Footer';
import { LandingMarquee } from '@/components/landing/LandingMarquee';
import { ByteDance, Cohere, Moonshot, Ollama, OpenAI, Zhipu, Anthropic, Qwen, Claude } from "@lobehub/icons";
import styles from './styles.module.scss';
import { Button, Flex, Space, Typography, Image } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Link, useIntl } from "@umijs/max";
import { LandingShowcase } from "@/components/landing/showcase/LandingShowcase";
import { LandingShowcaseItem } from "@/components/landing/showcase/LandingShowcaseItem";
import { LandingProductVideoFeature } from "@/components/landing/LandingProductVideoFeature";
import { LandingProductTourContent, LandingProductTourList, LandingProductTourSection, LandingProductTourTrigger } from "@/components/landing/LandingProductTour";
import { VideoPlayer } from "@/components/shared/VideoPlayer";


const PageUIHome: React.FC = () => {
    const intl = useIntl();

    return (
        <ThemeProvider>
            <BackgroundBanderole />

            <main
                className={`${styles['landing']} flex relative flex-col h-full min-h-screen items-center py-2`}
                style={{ gridTemplateRows: 'auto 1fr auto' }}
            >
                <HeaderSimple />

                <Flex
                    vertical
                    gap={16}
                    justify="center"
                    align="center"
                    className={`${styles['content']} ${styles['w-max-content']} mt-24`}
                >
                    <Typography.Text className="font-bold text-7xl">
                        <b className="text-colorful">. MODU</b> 墨读
                    </Typography.Text>
                    <Typography.Text className="text-colorful font-bold text-4xl">
                        /ˈmɔː.du/ 墨读无界
                    </Typography.Text>

                    {/* <Space size={48} >
                        <Button icon={<GithubOutlined />} size="large">
                            <a href="https://modubit.github.io" target="_blank" rel="noreferrer" className="font-bold">
                                Github
                            </a>
                        </Button>
                        <Button type="primary" size="large">
                            <Link to="/modu/chat" className="font-bold">
                                {intl.formatMessage({ id: 'home.header.start' })}
                            </Link>
                        </Button>
                    </Space> */}
                </Flex>

                <LandingProductVideoFeature
                    textPosition="center"
                    videoPosition="center"
                    title="生成式 AI 应用创作平台"
                    description="开源的 LLM 应用开发平台，具备全面的功能模块，涵盖 Agent 构建、AI 工作流编排、RAG 检索与模型管理，简化生成式 AI 原生应用的构建与运营流程。"
                    autoPlay={true}
                    controls={false}
                    loop={true}
                    videoMaxWidth="960px"
                    videoSrc="https://cache.shipixen.com/features/3-theme-and-logo.mp4"
                    className={`landing-product-video-feature ${styles['content']} ${styles['large-padding-content']} ${styles['w-full']} mt-2`}
                />

                <LandingProductTourSection
                    title='开放灵活的生成式 AI 应用创作平台'
                    description="Get 10x more done with Shadcn UI, React & Next.js, and say goodbye to repetitive tasks. You'll never go back."
                    defaultValue="feature-1"
                    withBackground
                    className={`landing-product-tour-section ${styles['content']} ${styles['large-padding-content']} ${styles['w-full']}`}
                >
                    <LandingProductTourList>
                        <LandingProductTourTrigger value="feature-1">
                            <p className="text-xl font-bold">
                                Automatic deployment to Vercel
                            </p>
                            <p>
                                Deploying the generated template to Vercel is as easy as clicking a button.
                            </p>
                        </LandingProductTourTrigger>

                        <LandingProductTourTrigger value="feature-2">
                            <p className="text-xl font-bold">
                                MDX blog, no server required
                            </p>
                            <p>
                                Shipixen comes with a fully featured MDX blog.
                            </p>
                        </LandingProductTourTrigger>

                        <LandingProductTourTrigger value="feature-3">
                            <p className="text-xl font-bold">
                                Customizable themes
                            </p>
                            <p>
                                Choose from more than 30+ beautifully designed themes or create your own.
                            </p>
                        </LandingProductTourTrigger>
                    </LandingProductTourList>
                    <LandingProductTourContent value="feature-1">
                        <VideoPlayer
                            className={'w-full rounded-md'}
                            src={'https://cache.shipixen.com/features/20-mobile-optimized.mp4'}
                            autoPlay={true}
                            controls={false}
                            loop={true}
                        />
                    </LandingProductTourContent>
                    <LandingProductTourContent value="feature-2">
                        <VideoPlayer
                            className={'w-full rounded-md'}
                            src={
                                'https://cache.shipixen.com/features/11-pricing-page-builder.mp4'
                            }
                            autoPlay={true}
                            controls={false}
                            loop={true}
                        />
                    </LandingProductTourContent>
                    <LandingProductTourContent value="feature-3">
                        <VideoPlayer
                            className={'w-full rounded-md'}
                            src={'https://cache.shipixen.com/features/21-run-locally.mp4'}
                            autoPlay={true}
                            controls={false}
                            loop={true}
                        />
                    </LandingProductTourContent>
                </LandingProductTourSection>

                <LandingProductTourSection
                    title='Landing page in minutes'
                    description="Get 10x more done with Shadcn UI, React & Next.js, and say goodbye to repetitive tasks. You'll never go back."
                    defaultValue="feature-1"
                    className={`landing-product-tour-section ${styles['content']} ${styles['large-padding-content']} ${styles['w-full']}`}
                >
                    <LandingProductTourContent value="feature-1">
                        <Image src="https://picsum.photos/id/206/800/800" height={400} />
                    </LandingProductTourContent>
                    <LandingProductTourContent value="feature-2">
                        <Image src="https://picsum.photos/id/33/800/800" height={400} />
                    </LandingProductTourContent>
                    <LandingProductTourContent value="feature-3">
                        <Image src="https://picsum.photos/id/59/800/800" height={400} />
                    </LandingProductTourContent>
                    <LandingProductTourList>
                        <LandingProductTourTrigger value="feature-1">
                            <p className="text-xl font-bold">
                                Automatic deployment to Vercel
                            </p>
                            <p>
                                Deploying the generated template to Vercel is as easy as clicking a button.
                            </p>
                        </LandingProductTourTrigger>

                        <LandingProductTourTrigger value="feature-2">
                            <p className="text-xl font-bold">
                                MDX blog, no server required
                            </p>
                            <p>
                                Shipixen comes with a fully featured MDX blog.
                            </p>
                        </LandingProductTourTrigger>

                        <LandingProductTourTrigger value="feature-3">
                            <p className="text-xl font-bold">
                                Customizable themes
                            </p>
                            <p>
                                Choose from more than 30+ beautifully designed themes or create your own.
                            </p>
                        </LandingProductTourTrigger>
                    </LandingProductTourList>
                </LandingProductTourSection>

                <LandingShowcase
                    title="多种大模型支持"
                    description="多种模型支持，不同应用场景灵活切换，业务层与模型层分离，获得最优体验"
                    withBackground
                    className={`${styles['content']} ${styles['large-padding-content']} ${styles['w-full']}`}
                >
                    <LandingShowcaseItem><OpenAI size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Ollama size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Cohere size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Anthropic size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Claude size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Qwen size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Zhipu size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><Moonshot size='80%' /></LandingShowcaseItem>
                    <LandingShowcaseItem><ByteDance size='80%' /></LandingShowcaseItem>
                </LandingShowcase>

                <LandingMarquee variant="primary" className={`${styles['content']} ${styles['marquee']}  ${styles['w-full']} mt-12 lg:mt-0`}>
                    <OpenAI size={64} />
                    <Ollama size={64} />
                    <Cohere size={64} />
                    <Anthropic size={64} />
                    <Claude size={64} />
                    <Zhipu size={64} />
                    <Moonshot size={64} />
                    <ByteDance size={64} />
                    <Qwen size={64} />
                </LandingMarquee>

                <Flex
                    vertical
                    gap={16}
                    justify="center"
                    align="center"
                    className={`${styles['content']} ${styles['with-background']} ${styles['large-padding-content']} w-full py-16`}
                >
                    <Typography.Title className="font-bold text-7xl" style={{ marginBottom: 0 }}>
                        准备好开始探索
                    </Typography.Title>
                    <Typography.Title className="font-bold text-7xl" style={{ marginTop: 0 }}>
                        生成式 AI 的无限可能了？
                    </Typography.Title>

                    <Space size={48} className="mt-4" >
                        <Button type="primary" size="large">
                            <Link to="/modu/chat" className="font-bold">
                                {intl.formatMessage({ id: 'home.header.start' })}
                            </Link>
                        </Button>
                        <Button icon={<GithubOutlined />} size="large">
                            <a href="https://modubit.github.io" target="_blank" rel="noreferrer" className="font-bold">
                                Github
                            </a>
                        </Button>
                    </Space>
                </Flex>

                <Footer className="py-4 grow-0 shrink-0 mb-36 lg:mb-2" />
            </main>
        </ThemeProvider>
    )
}

export default PageUIHome;