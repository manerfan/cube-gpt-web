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

import HeaderSimple from "@/components/header/HeaderSimple";
import LogoInfo from "@/components/logo/LogoBlock";
import Footer from "./components/Footer";
import ChatInput from "@/components/chat-input/ChatInput";
import BackgroundBanderole from "@/components/background/BackgroundBanderole";


const HomePage: React.FC = () => {
  
  return (
    <>
    <BackgroundBanderole />
    <main className="flex relative min-h-screen flex-col items-center justify-between p-5 sm:px-10 md:px-15 lg:px-24">
      <HeaderSimple />
      
      <LogoInfo />

      <ChatInput
        className="my-2"
        style={{ marginTop: "5rem", marginBottom: "2rem" }}
        onSubmit={(values) => console.log(values)}
      />

      <Footer />
    </main>
    </>
  );
};

export default HomePage;
