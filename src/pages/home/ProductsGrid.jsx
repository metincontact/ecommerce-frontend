import Product from "./Product";

function ProductsGrid({ products, fetchAppData }) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <Product
            key={product.id}
            product={product}
            fetchAppData={fetchAppData}
          />
        );
      })}
    </div>
  );
}

export default ProductsGrid;
