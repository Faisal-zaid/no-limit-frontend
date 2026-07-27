import Search from "@/components/Search";
import Categories from "@/components/Category";

export default function Services() {
  return (
    <section>
      <div className="text-[20px] ml-[3%] mt-[5%]">
        <Search />
      </div>

      <div className="content-area">
        <div className="categories">
          <Categories/>
        </div>
        <div className="category info"></div>
      </div>
    </section>
  );
}
