import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BASE_URL } from "../../api";
import api from "../../api";
import Product from "./Product";

vi.mock("../../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({}),
    put: vi.fn(),
    delete: vi.fn(),
  },
  BASE_URL: "https://ecommerce-backend-bbic.onrender.com",
}));

describe("Product component", () => {
  let product;
  let fetchAppData;

  beforeEach(() => {
    product = {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    };

    fetchAppData = vi.fn();
  });

  it("displays the product details correctly", () => {
    render(<Product product={product} fetchAppData={fetchAppData} />);

    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).toBeInTheDocument();

    expect(screen.getByText("$10.90")).toBeInTheDocument();

    expect(screen.getByTestId("product-image")).toHaveAttribute(
      "src",
      "images/products/athletic-cotton-socks-6-pairs.jpg",
    );

    expect(screen.getByTestId("product-rating-stars-image")).toHaveTextContent("★ 4.5");

    expect(screen.getByText("(87)")).toBeInTheDocument();
  });

  it("adds a product to the cart", async () => {
    render(<Product product={product} fetchAppData={fetchAppData} />);

    const user = userEvent.setup();
    const addToCartButton = screen.getByTestId("add-to-cart-button");
    await user.click(addToCartButton);

    expect(api.post).toHaveBeenCalledWith("/api/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
    });
    expect(fetchAppData).toHaveBeenCalled();
  });
});
