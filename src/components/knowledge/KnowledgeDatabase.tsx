
// Specific changes only to fix the click issue
// Lines 498 and 525 need fixing where it uses .click()

const handleTagClick = (tagName: string) => {
  setSelectedTags((prev) => {
    if (prev.includes(tagName)) {
      return prev.filter((t) => t !== tagName);
    } else {
      return [...prev, tagName];
    }
  });
  
  // Instead of trying to click an element, we'll just reset page to 1
  setCurrentPage(1);
};

// And similarly for the category selection

const handleCategorySelect = (categoryId: string) => {
  setSelectedCategory(categoryId);
  
  // Instead of trying to click an element, we'll just reset page to 1
  setCurrentPage(1);
  setSelectedTags([]);
};
