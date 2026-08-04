import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";

export default function Categoriespage({onSelectCategory}) {
  const [categories, setCategories] = useState([]);

   useEffect(() => {
    async function loadCategories() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setCategories(data);
    }

    loadCategories();
  }, []);

  return (
    <div className="flex items-center gap-15  justify-center" >
     

      {categories.slice(0,8).map((category) => (
        <div key={category.id} >
          <h3 onClick={() => onSelectCategory && onSelectCategory(category)}
           className="nav">{category.name}</h3>
        </div>
      ))}
    </div>
  );
}