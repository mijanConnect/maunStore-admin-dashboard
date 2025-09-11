// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//   Brand,
//   Category,
//   SubCategory,
//   Product,
//   User,
//   Subscription,
//   Size,
//   Color,
//   News,
//   Banner,
// } from "@/types";
// import {
//   mockBrands,
//   mockCategories,
//   mockSubCategories,
//   mockProducts,
//   mockUsers,
//   mockSubscriptions,
//   mockSizes,
//   mockColors,
//   mockNews,
//   mockBanners,
// } from "@/lib/mockData";

// interface DataState {
//   categories: Category[];
//   subCategories: SubCategory[];
//   products: Product[];
//   users: User[];
//   subscriptions: Subscription[];
//   sizes: Size[];
//   colors: Color[];
//   news: News[];
//   banners: Banner[];
//   brands: Brand[];
// }

// const initialState: DataState = {
//   categories: mockCategories,
//   subCategories: mockSubCategories,
//   products: mockProducts,
//   users: mockUsers,
//   subscriptions: mockSubscriptions,
//   sizes: mockSizes,
//   colors: mockColors,
//   news: mockNews,
//   banners: mockBanners,
//   brands: mockBrands,
// };

// const dataSlice = createSlice({
//   name: "data",
//   initialState,
//   reducers: {
//     // Categories
//     addCategory: (state, action: PayloadAction<Category>) => {
//       state.categories.push(action.payload);
//     },
//     updateCategory: (state, action: PayloadAction<Category>) => {
//       const index = state.categories.findIndex(
//         (cat) => cat.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.categories[index] = action.payload;
//       }
//     },
//     deleteCategory: (state, action: PayloadAction<string>) => {
//       state.categories = state.categories.filter(
//         (cat) => cat.id !== action.payload
//       );
//     },

//     // Sub Categories
//     addSubCategory: (state, action: PayloadAction<SubCategory>) => {
//       state.subCategories.push(action.payload);
//     },
//     updateSubCategory: (state, action: PayloadAction<SubCategory>) => {
//       const index = state.subCategories.findIndex(
//         (sub) => sub.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.subCategories[index] = action.payload;
//       }
//     },
//     deleteSubCategory: (state, action: PayloadAction<string>) => {
//       state.subCategories = state.subCategories.filter(
//         (sub) => sub.id !== action.payload
//       );
//     },

//     // Products
//     addProduct: (state, action: PayloadAction<Product>) => {
//       state.products.push(action.payload);
//     },
//     updateProduct: (state, action: PayloadAction<Product>) => {
//       const index = state.products.findIndex(
//         (prod) => prod.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.products[index] = action.payload;
//       }
//     },
//     deleteProduct: (state, action: PayloadAction<string>) => {
//       state.products = state.products.filter(
//         (prod) => prod.id !== action.payload
//       );
//     },

//     // Users
//     addUser: (state, action: PayloadAction<User>) => {
//       state.users.push(action.payload);
//     },
//     updateUser: (state, action: PayloadAction<User>) => {
//       const index = state.users.findIndex(
//         (user) => user.email === action.payload.email
//       );
//       if (index !== -1) {
//         state.users[index] = action.payload;
//       }
//     },
//     deleteUser: (state, action: PayloadAction<string>) => {
//       state.users = state.users.filter((user) => user.email !== action.payload);
//     },

//     // Subscriptions
//     addSubscription: (state, action: PayloadAction<Subscription>) => {
//       state.subscriptions.push(action.payload);
//     },
//     updateSubscription: (state, action: PayloadAction<Subscription>) => {
//       const index = state.subscriptions.findIndex(
//         (sub) => sub.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.subscriptions[index] = action.payload;
//       }
//     },
//     deleteSubscription: (state, action: PayloadAction<string>) => {
//       state.subscriptions = state.subscriptions.filter(
//         (sub) => sub.id !== action.payload
//       );
//     },

//     // Sizes
//     addSize: (state, action: PayloadAction<Size>) => {
//       state.sizes.push(action.payload);
//     },
//     updateSize: (state, action: PayloadAction<Size>) => {
//       const index = state.sizes.findIndex(
//         (size) => size.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.sizes[index] = action.payload;
//       }
//     },
//     deleteSize: (state, action: PayloadAction<string>) => {
//       state.sizes = state.sizes.filter((size) => size.id !== action.payload);
//     },

//     // Colors
//     addColor: (state, action: PayloadAction<Color>) => {
//       state.colors.push(action.payload);
//     },
//     updateColor: (state, action: PayloadAction<Color>) => {
//       const index = state.colors.findIndex(
//         (color) => color.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.colors[index] = action.payload;
//       }
//     },
//     deleteColor: (state, action: PayloadAction<string>) => {
//       state.colors = state.colors.filter(
//         (color) => color.id !== action.payload
//       );
//     },

//     // News
//     addNews: (state, action: PayloadAction<News>) => {
//       state.news.push(action.payload);
//     },
//     updateNews: (state, action: PayloadAction<News>) => {
//       const index = state.news.findIndex(
//         (news) => news.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.news[index] = action.payload;
//       }
//     },
//     deleteNews: (state, action: PayloadAction<string>) => {
//       state.news = state.news.filter((news) => news.id !== action.payload);
//     },

//     // Banners
//     addBanner: (state, action: PayloadAction<Banner>) => {
//       state.banners.push(action.payload);
//     },
//     updateBanner: (state, action: PayloadAction<Banner>) => {
//       const index = state.banners.findIndex(
//         (banner) => banner.id === action.payload.id
//       );
//       if (index !== -1) {
//         state.banners[index] = action.payload;
//       }
//     },
//     deleteBanner: (state, action: PayloadAction<string>) => {
//       state.banners = state.banners.filter(
//         (banner) => banner.id !== action.payload
//       );
//     },
//   },
// });

// export const {
//   addCategory,
//   updateCategory,
//   deleteCategory,
//   addSubCategory,
//   updateSubCategory,
//   deleteSubCategory,
//   addProduct,
//   updateProduct,
//   deleteProduct,
//   addUser,
//   updateUser,
//   deleteUser,
//   addSubscription,
//   updateSubscription,
//   deleteSubscription,
//   addSize,
//   updateSize,
//   deleteSize,
//   addColor,
//   updateColor,
//   deleteColor,
//   addNews,
//   updateNews,
//   deleteNews,
//   addBanner,
//   updateBanner,
//   deleteBanner,
// } = dataSlice.actions;

// export default dataSlice.reducer;
