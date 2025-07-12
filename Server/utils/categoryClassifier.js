// server/utils/categoryClassifier.js

const categoryMap = {
  food: ["mcdonald", "pizza", "zomato", "swiggy", "burger", "restaurant", "meal"],
  transport: ["uber", "ola", "bus", "train", "metro", "cab", "taxi"],
  rent: ["rent", "landlord", "flat", "apartment", "housing"],
  shopping: ["amazon", "flipkart", "myntra", "clothing", "shopping", "store"],
  entertainment: ["netflix", "hotstar", "movie", "cinema", "spotify", "music"],
  utilities: ["electricity", "water", "bill", "wifi", "internet", "gas"],
};

const classifyCategory = (description = "") => {
  const lowerDesc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((word) => lowerDesc.includes(word))) {
      return category.charAt(0).toUpperCase() + category.slice(1); // e.g. "Food"
    }
  }

  return "Other";
};

module.exports = { classifyCategory };
