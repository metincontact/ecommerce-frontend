import Product from "./Product";

function ProductsGrid({ products, fetchAppData }) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <Product
            key={product.id}
            product={product}
            fetchAppData={fetchAppData}
            index={index}
          />
        );
      })}
    </div>
  );
}

export default ProductsGrid;
