"use client"
import { useEffect, useState } from "react"
import { getAssets } from "../lib/api"

export default function Home() {
  const [assets, setAssets] = useState([])

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    const data = await getAssets()
    setAssets(data)
  }

  return (
    <div>
      <h1>Surplus Assets</h1>

      {assets.map((asset) => (
        <div key={asset.id}>
          <h3>{asset.item_name}</h3>
          <p>Status: {asset.current_status}</p>
        </div>
      ))}
    </div>
  )
}
