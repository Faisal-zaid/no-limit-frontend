import Search from "@/components/Search";

export default function Services() {
  return (
    <section>
      <div className="text-[20px] ml-[3%] mt-[5%]">
        <Search />
      </div>

      <div className="content-area">
        <div className="categories"></div>
        <div className="category info"></div>
      </div>
    </section>
  );
}
