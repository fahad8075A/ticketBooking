import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    title: "Movies",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
    path: "/movies",
  },
  {
    id: 2,
    title: "Bus",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
    path: "/bus",
  },
  {
    id: 3,
    title: "Train",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600",
    path: "/train",
  },
  {
    id: 4,
    title: "Flight",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600",
    path: "/flight",
  },
  {
    id: 5,
    title: "Sports",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
    path: "/sports",
  },
  {
    id: 6,
    title: "Concert",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600",
    path: "/concert",
  },
];

const Browser = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Browse Tickets
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-2xl font-semibold">
                {category.title}
              </h2>

              <Link
                to={category.path}
                className="inline-block mt-4 bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Browser;