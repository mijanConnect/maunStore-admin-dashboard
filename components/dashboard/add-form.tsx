// "use client";

// import React, { useState } from "react";
// import {
//   Button,
//   Input,
//   Textarea,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Label,
// } from "@/components/ui"; // shadcn/ui components
// import { useForm } from "react-hook-form";
// import { toast } from "@/components/ui/use-toast"; // optional toast hook

// type FormValues = {
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   category: string;
//   gender: "MALE" | "FEMALE" | "UNISEX";
//   modelNumber: string;
//   movement: string;
//   caseDiameter: string;
//   caseThickness: string;
// };

// const AddProductForm = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { register, handleSubmit, reset } = useForm<FormValues>({
//     defaultValues: {
//       name: "Classic Leather Watch",
//       description:
//         "A premium quality leather strap watch with stainless steel case and water resistance.",
//       price: 159.99,
//       stock: 50,
//       category: "689c6d3c1de2973dfca2c05e",
//       gender: "MALE",
//       modelNumber: "CLW-2025",
//       movement: "Quartz",
//       caseDiameter: "42mm",
//       caseThickness: "10mm",
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     setIsLoading(true);
//     try {
//       console.log("Submitting product:", data);

//       const response = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast({ title: "Success", description: "Product added successfully!" });
//         reset();
//       } else {
//         toast({
//           title: "Error",
//           description: result.message || "Failed to add product",
//         });
//       }
//     } catch (err) {
//       console.error("Error submitting product:", err);
//       toast({ title: "Error", description: "Failed to submit product" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-xl mx-auto p-4 space-y-4"
//     >
//       <div>
//         <Label>Product Name</Label>
//         <Input
//           {...register("name", { required: true })}
//           placeholder="Enter product name"
//         />
//       </div>

//       <div>
//         <Label>Description</Label>
//         <Textarea
//           {...register("description", { required: true })}
//           placeholder="Enter product description"
//         />
//       </div>

//       <div>
//         <Label>Price</Label>
//         <Input
//           type="number"
//           step="0.01"
//           {...register("price", { required: true, valueAsNumber: true })}
//           placeholder="Enter price"
//         />
//       </div>

//       <div>
//         <Label>Stock</Label>
//         <Input
//           type="number"
//           {...register("stock", { required: true, valueAsNumber: true })}
//           placeholder="Enter stock quantity"
//         />
//       </div>

//       <div>
//         <Label>Category ID</Label>
//         <Input
//           {...register("category", { required: true })}
//           placeholder="Enter category ID"
//         />
//       </div>

//       <div>
//         <Label>Gender</Label>
//         <Select {...register("gender", { required: true })}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select gender" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="MALE">MALE</SelectItem>
//             <SelectItem value="FEMALE">FEMALE</SelectItem>
//             <SelectItem value="UNISEX">UNISEX</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div>
//         <Label>Model Number</Label>
//         <Input
//           {...register("modelNumber", { required: true })}
//           placeholder="Enter model number"
//         />
//       </div>

//       <div>
//         <Label>Movement</Label>
//         <Input
//           {...register("movement", { required: true })}
//           placeholder="Enter movement type"
//         />
//       </div>

//       <div>
//         <Label>Case Diameter</Label>
//         <Input
//           {...register("caseDiameter", { required: true })}
//           placeholder="Enter case diameter"
//         />
//       </div>

//       <div>
//         <Label>Case Thickness</Label>
//         <Input
//           {...register("caseThickness", { required: true })}
//           placeholder="Enter case thickness"
//         />
//       </div>

//       <Button type="submit" className="w-full" disabled={isLoading}>
//         {isLoading ? "Submitting..." : "Submit Product"}
//       </Button>
//     </form>
//   );
// };

// export default AddProductForm;
