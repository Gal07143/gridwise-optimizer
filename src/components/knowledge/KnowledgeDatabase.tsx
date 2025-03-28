
// Specific changes only to fix the click issue

const handleTagClick = (tagName: string) => {
  // Instead of trying to click an element, we'll just reset page to 1
  setCurrentPage(1);
  
  if (selectedTags.includes(tagName)) {
    setSelectedTags(selectedTags.filter((t) => t !== tagName));
  } else {
    setSelectedTags([...selectedTags, tagName]);
  }
};

// And similarly for the category selection
const handleCategorySelect = (categoryId: string) => {
  setSelectedCategory(categoryId);
  
  // Instead of trying to click an element, we'll just reset page to 1
  setCurrentPage(1);
  setSelectedTags([]);
};
