import Hero from "../pages/Hero";
import Services from "../pages/Services";

export default function Home() {
    return (
        <main className="bg-[radial-gradient(circle_at_50%_30%,_#FFAE00_0%,_#E87900_100%)] min-h-screen">
            <Hero />
            {/* <Services /> */}
        </main>
    );
}