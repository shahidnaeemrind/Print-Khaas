import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_COLLECTION = 'products';

// Format Firestore doc to Product interface
function mapDocToProduct(id: string, data: Record<string, any>): Product {
  return {
    id,
    title: data.title || '',
    slug: data.slug || '',
    shortDescription: data.shortDescription || '',
    fullDescription: data.fullDescription || '',
    productType: data.productType || 'individual',
    category: data.category || 'General',
    targetAudience: data.targetAudience || 'both',
    gradeRange: data.gradeRange || '',
    language: data.language || '',
    pages: data.pages || '',
    dimensions: data.dimensions || '',
    binding: data.binding || '',
    coverImage: data.coverImage || '',
    additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
    parentPrice: typeof data.parentPrice === 'number' ? data.parentPrice : undefined,
    schoolPrice: typeof data.schoolPrice === 'number' ? data.schoolPrice : undefined,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    discount: data.discount || '',
    youtubeUrl: data.youtubeUrl || '',
    drivePdfUrl: data.drivePdfUrl || '',
    tableOfContents: data.tableOfContents || '',
    learningOutcomes: data.learningOutcomes || '',
    minOrderQuantity: typeof data.minOrderQuantity === 'number' ? data.minOrderQuantity : undefined,
    stockStatus: data.stockStatus || 'in_stock',
    featured: Boolean(data.featured),
    status: data.status || 'draft',
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 99,
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || '',
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || '',
  };
}

// Fetch published products for public visitors
export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((docSnapshot) => {
      products.push(mapDocToProduct(docSnapshot.id, docSnapshot.data()));
    });
    // Sort by sortOrder asc, then featured
    return products.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

// Fetch all products (for authorized admin)
export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    querySnapshot.forEach((docSnapshot) => {
      products.push(mapDocToProduct(docSnapshot.id, docSnapshot.data()));
    });
    return products.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const docPath = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return mapDocToProduct(docSnap.id, docSnap.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// Clean object to avoid sending undefined values to Firestore
function sanitizePayload(productData: Partial<Product>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(productData)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

// Generate URL slug from title
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 200);
}

// Create new product
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<string> {
  const id = customId || (slugify(productData.title) + '-' + Math.random().toString(36).substring(2, 7));
  const docPath = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const cleanData = sanitizePayload({
      ...productData,
      slug: productData.slug || slugify(productData.title),
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    });
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), cleanData);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Update existing product
export async function updateProduct(id: string, productData: Partial<Product>): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const { id: _, createdAt: __, ...updateFields } = productData;
    const cleanData = sanitizePayload({
      ...updateFields,
      updatedAt: serverTimestamp() as any,
    });
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// Duplicate product
export async function duplicateProduct(sourceProduct: Product): Promise<string> {
  const newTitle = `${sourceProduct.title} (Copy)`;
  const newSlug = `${sourceProduct.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;
  const { id: _, createdAt: __, updatedAt: ___, ...rest } = sourceProduct;

  const duplicatedData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
    ...rest,
    title: newTitle,
    slug: newSlug,
    status: 'draft', // duplicated items start in draft for review
  };

  return await createProduct(duplicatedData, newSlug);
}

// Seed initial catalog data into Firestore
export async function seedInitialProducts(): Promise<number> {
  let seededCount = 0;
  for (const item of INITIAL_PRODUCTS) {
    const docId = item.slug;
    const docRef = doc(db, PRODUCTS_COLLECTION, docId);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      seededCount++;
    }
  }
  return seededCount;
}
