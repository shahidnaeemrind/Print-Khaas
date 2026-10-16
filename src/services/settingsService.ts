import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CompanySettings, GlobalSeoSettings } from '../types';

const SETTINGS_COLLECTION = 'settings';
const COMPANY_DOC_ID = 'company';
const SEO_DOC_ID = 'seo';

export const DEFAULT_SETTINGS: CompanySettings = {
  brandName: 'Print Khaas',
  tagline: 'Quality Books. Meaningful Learning.',
  establishedYear: '2014',
  address: '283A, Dream Garden, Lahore, Pakistan',
  phone: '+92 333 6474186',
  whatsappNumber: '923336474186',
  email: 'info@printkhaas.com',
  announcement: 'Accepting school orders for upcoming academic terms across Pakistan! Nationwide courier & freight delivery.',
};

export const DEFAULT_SEO_SETTINGS: GlobalSeoSettings = {
  titlePrefix: 'Print Khaas',
  defaultDescription: 'Print Khaas is a premier Pakistani book publisher established in 2014 in Lahore, offering children\'s books, school packages, activity books, and character-building publications for schools and parents.',
  faviconUrl: '/favicon.svg',
  keywords: 'print khaas, pakistani books, lahore publisher, school syllabus packages, children books pakistan, urdu kaidah, snc curriculum',
  ogImageUrl: '/logo.svg',
  googleVerification: '',
};

export async function getCompanySettings(): Promise<CompanySettings> {
  const docPath = `${SETTINGS_COLLECTION}/${COMPANY_DOC_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, COMPANY_DOC_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return DEFAULT_SETTINGS;
    }
    const data = snap.data();
    return {
      brandName: data.brandName || DEFAULT_SETTINGS.brandName,
      tagline: data.tagline || DEFAULT_SETTINGS.tagline,
      establishedYear: data.establishedYear || DEFAULT_SETTINGS.establishedYear,
      address: data.address || DEFAULT_SETTINGS.address,
      phone: data.phone || DEFAULT_SETTINGS.phone,
      whatsappNumber: data.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      email: data.email || DEFAULT_SETTINGS.email,
      announcement: data.announcement || DEFAULT_SETTINGS.announcement,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    };
  } catch (error) {
    console.warn('Using default company settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateCompanySettings(settings: Partial<CompanySettings>): Promise<void> {
  const docPath = `${SETTINGS_COLLECTION}/${COMPANY_DOC_ID}`;
  try {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(settings)) {
      if (val !== undefined) clean[key] = val;
    }
    clean.updatedAt = serverTimestamp();
    await setDoc(doc(db, SETTINGS_COLLECTION, COMPANY_DOC_ID), clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function getGlobalSeoSettings(): Promise<GlobalSeoSettings> {
  const docPath = `${SETTINGS_COLLECTION}/${SEO_DOC_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SEO_DOC_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return DEFAULT_SEO_SETTINGS;
    }
    const data = snap.data();
    return {
      titlePrefix: data.titlePrefix || DEFAULT_SEO_SETTINGS.titlePrefix,
      defaultDescription: data.defaultDescription || DEFAULT_SEO_SETTINGS.defaultDescription,
      faviconUrl: data.faviconUrl || DEFAULT_SEO_SETTINGS.faviconUrl,
      keywords: data.keywords || DEFAULT_SEO_SETTINGS.keywords,
      ogImageUrl: data.ogImageUrl || DEFAULT_SEO_SETTINGS.ogImageUrl,
      googleVerification: data.googleVerification || DEFAULT_SEO_SETTINGS.googleVerification,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    };
  } catch (error) {
    console.warn('Using default SEO settings:', error);
    return DEFAULT_SEO_SETTINGS;
  }
}

export async function updateGlobalSeoSettings(seoSettings: Partial<GlobalSeoSettings>): Promise<void> {
  const docPath = `${SETTINGS_COLLECTION}/${SEO_DOC_ID}`;
  try {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(seoSettings)) {
      if (val !== undefined) clean[key] = val;
    }
    clean.updatedAt = serverTimestamp();
    await setDoc(doc(db, SETTINGS_COLLECTION, SEO_DOC_ID), clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
