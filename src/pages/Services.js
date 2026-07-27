import Search from "@/components/Search";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";

export default function Services() {
  return (
    <section>
      <div className="text-[20px] ml-[3%] mt-[5%]">
        <Search />
      </div>

      <div className="flex justify-between">
        <div className="border">
          <Categories/>
        </div>
        <div className="category info">
          <Categorydescription/>
        </div>
      </div>
    </section>
  );
}
