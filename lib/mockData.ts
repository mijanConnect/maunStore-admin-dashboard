

export const mockBrands = [
  {
    id: '1',
    name: 'Rolex',
    description: 'Luxury Swiss watchmaker',
    image: 'https://i.ibb.co/pB65KCRt/61vo-KOya-PFL-AC-SL1000.jpg',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Omega',
    description: 'Swiss luxury watchmaker',
    image: 'https://i.ibb.co/Tqm5s4Jg/orologio-capital-uomo.png',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    name: 'Seiko',
    description: 'Japanese watchmaker',
    image: 'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg',
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];

export const mockCategories = [
  {
    id: '1',
    name: 'Rolex',
    description: 'Electronic devices and gadgets',
    image: 'https://i.ibb.co/pB65KCRt/61vo-KOya-PFL-AC-SL1000.jpg',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel items',
    image: 'https://i.ibb.co/Tqm5s4Jg/orologio-capital-uomo.png',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    image: 'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg',
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
  {
    id: '4',
    name: 'Sports',
    description: 'Sports equipment and accessories',
    image: 'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
];

export const mockSubCategories = [
  {
    id: '1',
    name: 'Smartphones',
    description: 'Mobile phones and accessories',
    categoryId: '1',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Laptops',
    description: 'Portable computers and accessories',
    categoryId: '1',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    name: 'T-Shirts',
    description: 'Casual and formal t-shirts',
    categoryId: '2',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];

export const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced features',
    price: 999.99,
    categoryId: '1',
    subCategoryId: '1',
    brandId: '1',
    sizes: ['128GB', '256GB', '512GB'],
    colors: ['Black', 'White', 'Blue'],
    images: [
      'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg',
      'https://i.ibb.co/pB65KCRt/61vo-KOya-PFL-AC-SL1000.jpg'
    ],
    stock: 50,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    // Specification fields
    gender: 'Male',
    modelNo: 'NK1789',
    movement: 'Quartz Battery',
    caseDiameter: '44 mm',
    caseThickness: '12 mm',
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    description: 'Professional laptop for developers and creators',
    price: 1999.99,
    categoryId: '1',
    subCategoryId: '2',
    brandId: '2',
    sizes: ['13-inch', '14-inch', '16-inch'],
    colors: ['Space Gray', 'Silver'],
    images: [
      'https://i.ibb.co/pB65KCRt/61vo-KOya-PFL-AC-SL1000.jpg',
      'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg'
    ],
    stock: 25,
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
    // Specification fields
    gender: 'Unisex',
    modelNo: 'RX5023',
    movement: 'Automatic',
    caseDiameter: '40 mm',
    caseThickness: '10 mm',
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt',
    price: 29.99,
    categoryId: '2',
    subCategoryId: '3',
    brandId: '3',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy', 'Red'],
    images: [
      'https://i.ibb.co/Tqm5s4Jg/orologio-capital-uomo.png'
    ],
    stock: 100,
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
    // Specification fields
    gender: 'Female',
    modelNo: 'LX7890',
    movement: 'Swiss Quartz',
    caseDiameter: '36 mm',
    caseThickness: '8 mm',
  },
];

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user' as const,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'admin' as const,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user' as const,
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];

export const mockSubscriptions = [
  {
    id: '1',
    name: 'Basic Plan',
    price: 9.99,
    duration: 'monthly',
    features: ['Basic features', 'Email support', '1 user'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Premium Plan',
    price: 19.99,
    duration: 'monthly',
    features: ['All Basic features', 'Priority support', '5 users', 'Advanced analytics'],
    isActive: true,
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    price: 49.99,
    duration: 'monthly',
    features: ['All Premium features', 'Custom integrations', 'Unlimited users', 'Dedicated support'],
    isActive: false,
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];

export const mockSizes = [
  { id: '1', name: 'Small', value: 'S' },
  { id: '2', name: 'Medium', value: 'M' },
  { id: '3', name: 'Large', value: 'L' },
  { id: '4', name: 'Extra Large', value: 'XL' },
];

export const mockColors = [
  { id: '1', name: 'Red', value: '#FF0000' },
  { id: '2', name: 'Blue', value: '#0000FF' },
  { id: '3', name: 'Green', value: '#00FF00' },
  { id: '4', name: 'Black', value: '#000000' },
  { id: '5', name: 'White', value: '#FFFFFF' },
];

export const mockNotifications = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'You have received a new order #12345',
    type: 'info' as const,
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    title: 'Product Stock Low',
    message: 'iPhone 15 Pro stock is running low (5 items left)',
    type: 'warning' as const,
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
  },
  {
    id: '3',
    title: 'New User Registration',
    message: 'A new user has registered: jane@example.com',
    type: 'success' as const,
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
  },
];


export const mockNews = [
  {
    id: '1',
    title: 'New Product Launch: Summer Collection 2024',
    description: '<p>We are excited to announce our brand new Summer Collection 2024! This collection features the latest trends in fashion with vibrant colors and comfortable fabrics perfect for the summer season.</p><p>Visit our stores or check online to explore the full collection and enjoy special launch discounts.</p>',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Flash Sale: 50% Off on Electronics',
    description: '<p>Don\'t miss our biggest sale of the year! Get up to 50% off on all electronics including smartphones, laptops, and accessories.</p><p>The sale starts this Friday and will last for 3 days only. Limited stock available, so hurry and grab your favorite gadgets at unbeatable prices!</p>',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    title: 'Company Milestone: 10,000 Happy Customers',
    description: '<p>We are thrilled to announce that we have reached 10,000 happy customers! This milestone is a testament to our commitment to quality products and excellent customer service.</p><p>We would like to thank all our loyal customers for their continued support. As a token of appreciation, we are offering a special discount code <strong>THANKS10K</strong> valid for the next month.</p>',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];

export const mockBanners = [
  {
    id: '1',
    title: 'Summer Collection',
    description: 'Discover our new summer collection with amazing discounts',
    image: 'https://i.ibb.co/Tqm5s4Jg/orologio-capital-uomo.png',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'New Arrivals',
    description: 'Check out our latest products and exclusive offers',
    image: 'https://i.ibb.co/pB65KCRt/61vo-KOya-PFL-AC-SL1000.jpg',
    isActive: true,
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
  },
  {
    id: '3',
    title: 'Special Discount',
    description: 'Limited time offer - Get up to 50% off on selected items',
    image: 'https://i.ibb.co/DgpHJYj6/rolex-new-watches-2025-new-dials-m126518ln-0014-2501stojan-001-portrait.jpg',
    isActive: false,
    createdAt: '2024-01-13T14:22:00Z',
    updatedAt: '2024-01-13T14:22:00Z',
  },
];