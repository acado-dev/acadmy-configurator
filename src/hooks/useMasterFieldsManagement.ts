import { useState, useEffect } from 'react';
import { FieldCategory, ApplicationField } from '@/types/application';
import { masterCategories as defaultCategories, masterFields as defaultFields } from '@/data/masterFields';

export interface MasterFieldsData {
  categories: FieldCategory[];
  fields: ApplicationField[];
}

export const useMasterFieldsManagement = () => {
  const [categories, setCategories] = useState<FieldCategory[]>([]);
  const [fields, setFields] = useState<ApplicationField[]>([]);

  // Load data from localStorage or use defaults
  useEffect(() => {
    const savedData = localStorage.getItem('acado_master_fields');
    if (savedData) {
      const parsed = JSON.parse(savedData) as MasterFieldsData;
      setCategories(parsed.categories);
      setFields(parsed.fields);
    } else {
      // Initialize with default data
      setCategories(defaultCategories);
      setFields(defaultFields);
      saveData(defaultCategories, defaultFields);
    }
  }, []);

  const saveData = (updatedCategories: FieldCategory[], updatedFields: ApplicationField[]) => {
    const data: MasterFieldsData = {
      categories: updatedCategories,
      fields: updatedFields,
    };
    localStorage.setItem('acado_master_fields', JSON.stringify(data));
  };

  // Category management
  const addCategory = (category: Omit<FieldCategory, 'id'>) => {
    const newCategory: FieldCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      order: categories.length + 1,
      isCustom: true,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveData(updatedCategories, fields);
    return newCategory.id;
  };

  const updateCategory = (categoryId: string, updates: Partial<FieldCategory>) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    setCategories(updatedCategories);
    saveData(updatedCategories, fields);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    const updatedFields = fields.filter(field => field.categoryId !== categoryId);
    setCategories(updatedCategories);
    setFields(updatedFields);
    saveData(updatedCategories, updatedFields);
  };

  // Subcategory management
  const addSubcategory = (categoryId: string, subcategory: { name: string }) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const newSubcategory = {
          id: `subcat-${Date.now()}`,
          name: subcategory.name,
          categoryId,
          order: (cat.subcategories?.length || 0) + 1,
        };
        return {
          ...cat,
          subcategories: [...(cat.subcategories || []), newSubcategory],
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveData(updatedCategories, fields);
  };

  const updateSubcategory = (categoryId: string, subcategoryId: string, name: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId && cat.subcategories) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub =>
            sub.id === subcategoryId ? { ...sub, name } : sub
          ),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveData(updatedCategories, fields);
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId && cat.subcategories) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId),
        };
      }
      return cat;
    });
    const updatedFields = fields.filter(field => field.subcategoryId !== subcategoryId);
    setCategories(updatedCategories);
    setFields(updatedFields);
    saveData(updatedCategories, updatedFields);
  };

  // Field management
  const addField = (field: Omit<ApplicationField, 'id' | 'order'>) => {
    const categoryFields = fields.filter(f => f.categoryId === field.categoryId);
    const newField: ApplicationField = {
      ...field,
      id: `field-${Date.now()}`,
      order: categoryFields.length + 1,
      isCustom: true,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    saveData(categories, updatedFields);
    return newField.id;
  };

  const updateField = (fieldId: string, updates: Partial<ApplicationField>) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    saveData(categories, updatedFields);
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    saveData(categories, updatedFields);
  };

  return {
    categories,
    fields,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addField,
    updateField,
    deleteField,
  };
};