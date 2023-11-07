import HeaderSimple from "@/components/header/HeaderSimple";
import LogoInfo from "@/components/logo/LogoBlock";
import Footer from "./components/Footer";
import ChatInput from "@/components/chat-input/ChatInput";


const HomePage: React.FC = () => {
  
  return (
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
  );
};

export default HomePage;
