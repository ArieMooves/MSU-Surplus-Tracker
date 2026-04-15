import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request, { params }) {
  const { id } = params;

  try {
   
    const itemNames = {
      "1": { name: "Dell Latitude 5420 Laptop", cond: "Fair" },
      "2": { name: "Herman Miller Aeron Chair", cond: "Good" },
      "3": { name: "Sony PS5 Console", cond: "New" },
      "4": { name: "Apple iPad Pro 12.9 (M2)", cond: "Good" },
      "5": { name: "Epson PowerLite 1781W Projector", cond: "Poor" },
      "6": { name: "Steelcase Gesture Office Chair", cond: "Fair" },
      "7": { name: "Microsoft Surface Pro 9", cond: "New" },
      "8": { name: "Cisco C9200L-24T-4G Switch", cond: "Good" },
      "9": { name: "Samsung 65-inch 4K Smart TV", cond: "Fair" },
      "10": { name: "Polycom RealPresence Trio 8800", cond: "Good" }
    };
    
    const asset = itemNames[id] || { name: "Generic Electronic Item", cond: "Good" };

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are a surplus asset specialist. 
      Item: "${asset.name}"
      Condition: "${asset.cond}"
      
      Task: 
      1. Provide a clean manufacturer model name for searching.
      2. Provide a realistic suggested surplus price (USD) for this item in its specific condition.
      
      Return the data in this exact format:
      Model: [Name]
      Price: [Amount]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    
    const cleanName = responseText.match(/Model:\s*(.*)/)?.[1] || asset.name;
    const suggestedPrice = responseText.match(/Price:\s*\$?([\d,.]+)/)?.[1] || "0.00";

    return NextResponse.json({ 
      original: asset.name,
      searchQuery: cleanName.trim(),
      suggestedPrice: suggestedPrice.trim(),
      condition: asset.cond,
      listings: [
          { 
            site: 'eBay', 
            price: suggestedPrice, 
            condition: asset.cond, 
            link: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cleanName)}` 
          },
          { site: 'Internal System', price: (parseFloat(suggestedPrice) * 0.9).toFixed(2), condition: 'Surplus', link: '#' }
      ]
    });

  } catch (error) {
    console.error("Gemini Market Error:", error);
    return NextResponse.json({ error: "Failed to generate market data" }, { status: 500 });
  }
}
