const handleGenerateDescription = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        itemName: formData.item_name, 
        category: formData.category 
      }),
    });
    
    const data = await response.json();
    if (data.description) {
      // Update your form state with the new description
      setFormData({ ...formData, description: data.description });
    }
  } catch (error) {
    console.error("Error generating description:", error);
  } finally {
    setLoading(false);
  }
};
