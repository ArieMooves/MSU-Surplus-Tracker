import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request, { params }) {
  const { id } = params;
  
  //  Get raw name from your DB 
  const rawAssetName = "Dell Monitor - Black"; 

  // Use Gemini Flash-Lite 
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `You are a surplus asset specialist. Convert this inventory name into a clean manufacturer model name for price matching on eBay: "${rawAssetName}". Return ONLY the model name.`;

  const result = await model.generateContent(prompt);
  const cleanName = result.response.text().trim();

  return NextResponse.json({ 
    original: rawAssetName,
    searchQuery: cleanName,
    listings: [
        { site: 'eBay', price: 42.50, link: '#' } // Placeholder for actual fetch logic
    ]
  });
}
