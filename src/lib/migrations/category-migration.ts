import { db } from '../firebase.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { MACHINE_CATEGORIES, WORK_PHASES, CATEGORIES, DEFAULT_CATEGORY_IMAGE } from '../constants.js';
import { SiteContent } from '../content.js';
import Logger from '../logger.js';

export async function runCategoryMigration() {
  try {
    const categoriesRef = collection(db, 'siteContent');

    // Check if categories already exist
    const existingCategoriesQuery = query(
      categoriesRef, 
      where('type', '==', 'category')
    );
    const existingCategories = await getDocs(existingCategoriesQuery);

    if (existingCategories.size > 0) {
      Logger.info('Categories already exist. Skipping migration.');
      return;
    }

    // Migrate main categories
    const mainCategories: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = Object.values(CATEGORIES)
      .filter(cat => ['main_category', 'subcategory', 'classification'].includes(cat.type))
      .map((cat, index) => ({
        type: 'category',
        title: cat.name,
        description: cat.description || `Categoria de máquinas: ${cat.name}`,
        imageUrl: cat.imageUrl || DEFAULT_CATEGORY_IMAGE.url,
        machines: MACHINE_CATEGORIES.find(mc => mc.id === cat.id)?.subcategories || [],
        order: index,
        active: true,
        metadata: {
          icon: cat.icon || '',
          type: cat.type,
          colors: cat.metadata || {},
          imageCredit: cat.imageUrl ? undefined : DEFAULT_CATEGORY_IMAGE.credit
        }
      }));

    // Add work phases as categories
    const phaseCategories: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>[] = Object.entries(WORK_PHASES).map(([ name, data ], index) => ({
      type: 'category',
      title: name,
      description: `Fase de obra: ${name}`,
      imageUrl: data.image || DEFAULT_CATEGORY_IMAGE.url,
      machines: data.machines,
      order: index + mainCategories.length,
      active: true,
      metadata: {
        icon: `phase-${name.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'work_phase',
        machines: data.machines,
        imageCredit: data.image ? undefined : DEFAULT_CATEGORY_IMAGE.credit
      }
    }));

    // Combine and add all categories
    const allCategories = [...mainCategories, ...phaseCategories];

    for (const category of allCategories) {
      await addDoc(categoriesRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    Logger.info(`Migrated ${allCategories.length} categories successfully.`);
  } catch (error) {
    Logger.error('Category migration failed', error);
    throw error;
  }
}

// ESM-compatible main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runCategoryMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
