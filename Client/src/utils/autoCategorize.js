// utils/autoCategorize.js

const keywordCategoryMap = {
  food: ['zomato', 'swiggy', 'dominos', 'pizza', 'restaurant'],
  transport: ['uber', 'ola', 'metro', 'cab', 'train', 'bus'],
  shopping: ['flipkart', 'amazon', 'myntra', 'ajio', 'clothing'],
  entertainment: ['netflix', 'hotstar', 'prime', 'movies', 'cinema'],
  bills: ['electricity', 'water', 'gas', 'mobile', 'recharge', 'wifi'],
  health: ['pharmacy', 'hospital', 'doctor', 'meds', 'medication'],
  groceries: ['bigbasket', 'grofers', 'grocery', 'vegetables'],
  salary: ['salary', 'payroll', 'credit'],
  rent: ['rent', 'landlord', 'emi'],
};

export function autoCategorizeTransaction(description, customCategories = []) {
  const desc = description.toLowerCase();

  // Check default categories
  for (const [category, keywords] of Object.entries(keywordCategoryMap)) {
    if (keywords.some(word => desc.includes(word))) {
      return category;
    }
  }

  // Check custom categories
  const customMatch = customCategories.find(cat =>
    desc.includes(cat.name.toLowerCase())
  );

  if (customMatch) return customMatch.name;

  return '';
}
