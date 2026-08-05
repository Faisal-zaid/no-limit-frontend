import Hero from "../pages/Hero";
import Services from "../pages/Services";

export default function Home() {
    return (
        <main className="bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">
            <Hero />
            <Services />
        </main>
    );
}