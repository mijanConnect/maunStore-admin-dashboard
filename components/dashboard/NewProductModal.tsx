"use client";

import { useState } from "react";
import { useAddProductMutation } from "@/lib/redux/apiSlice/productsApi";

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  description: string;
  images: string;
  category: string; // just the ID
  gender: "MALE" | "FEMALE" | "UNISEX";
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
}

export default function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: "",
    category: "",
    gender: "MALE",
    modelNumber: "",
    movement: "",
    caseDiameter: "",
    caseThickness: "",
  });

  const [message, setMessage] = useState<string>("");
  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images
          ? formData.images.split(",").map((img) => img.trim())
          : [],
      };

      // @ts-ignore
      const result = await addProduct(payload).unwrap();

      if (result.success) {
        setMessage("Product created successfully!");
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          images: "",
          category: "",
          gender: "MALE",
          modelNumber: "",
          movement: "",
          caseDiameter: "",
          caseThickness: "",
        });
        setIsOpen(false);
      } else {
        setMessage(result.message || "Failed to create product.");
      }
    } catch (err: any) {
      if (
        err?.data?.error &&
        Array.isArray(err.data.error) &&
        err.data.error.length > 0
      ) {
        // Take the first error message directly
        const messages = err.data.error[0].message;
        console.error("Validation Errors:", messages);
        setMessage(messages);
      } else if (err?.data?.message) {
        console.error("API Error:", err.data.message);
        setMessage(err.data.message);
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
        setMessage(err.message);
      } else {
        console.error("Unknown error:", err);
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 max-h-[80vh] overflow-y-auto"
            >
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                step="0.01"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="images"
                placeholder="Images (comma separated URLs)"
                value={formData.images}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="category"
                placeholder="Category ID"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="UNISEX">UNISEX</option>
              </select>
              <input
                type="text"
                name="modelNumber"
                placeholder="Model Number"
                value={formData.modelNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="movement"
                placeholder="Movement"
                value={formData.movement}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="caseDiameter"
                placeholder="Case Diameter"
                value={formData.caseDiameter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="caseThickness"
                placeholder="Case Thickness"
                value={formData.caseThickness}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
