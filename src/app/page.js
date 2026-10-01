import Hero from "../pages/Hero";
import Services from "../pages/Services";

export default function Home() {
    return (
        <main className="bg-[radial-gradient(circle_at_50%_35%,_#FFD000_0%,_#FF9100_50%,_#E05300_100%)] min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
            <Hero />
            {/* <Services /> */}
             <Footer />
        </main>
    );
}