const handleGenerateDescription = async () => {
  
  if (!formData.item_name) {
    alert("Please enter an Item Name first so Gemini can describe it.");
    return;
  }

  setLoading(true);
  try {
    
    const response = await fetch('http://localhost:8000/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        
        item_name: formData.item_name, 
        condition: formData.condition || "Good" // Providing a default if empty
      }),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data.description) {
      setFormData({ ...formData, description: data.description });
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    alert("Failed to connect to Gemini. Make sure your backend server is running.");
  } finally {
    setLoading(false);
  }
};
