from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
import os
import json

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI(title="MSU Surplus Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# temporary/initial test data
assets = [
    {
        "id": 1,
        "asset_tag": "A001",
        "item_name": "Desk Chair",
        "condition": "Good",
        "current_status": "Available"
    },
    {
        "id": 2,
        "asset_tag": "A002",
        "item_name": "Projector",
        "condition": "Fair",
        "current_status": "In Use"
    }
]
scan_events = []

class Asset(BaseModel):
    id: int
    asset_tag: str
    item_name: str
    condition: str
    current_status: str

class StatusUpdate(BaseModel):
    current_status: str

class ScanEvent(BaseModel):
    asset_id: int
    scan_location: str

@app.get("/")
def root():
    return {"message": "MSU Surplus Tracker API running"}

@app.get("/assets")
def get_assets():
    return assets

@app.post("/assets")
def add_asset(asset: Asset):
    for existing_asset in assets:
        if existing_asset["id"] == asset.id:
            return {"error": "Asset with this ID already exists"}
        if existing_asset["asset_tag"] == asset.asset_tag:
            return {"error": "Asset with this barcode/asset tag already exists"}
    assets.append(asset.dict())
    save_assets()
    return {"message": "Asset added successfully", "asset": asset.dict()}

@app.get("/assets/{asset_id}")
def get_asset(asset_id: int):
    for asset in assets:
        if asset["id"] == asset_id:
            return asset
    return {"error": "Asset not found"}

@app.put("/assets/{asset_id}/status")
def update_asset_status(asset_id: int, status_update: StatusUpdate):
    for asset in assets:
        if asset["id"] == asset_id:
            asset["current_status"] = status_update.current_status
            save_asset()
            return {"message": "Asset status updated", "asset": asset}
    return {"error": "Asset not found"}

# barcode lookup endpoint
@app.get("/assets/by-tag/{asset_tag}")
def get_asset_by_tag(asset_tag: str):
    for asset in assets:
        if asset["asset_tag"] == asset_tag:
            return asset
    return {"error": "Asset not found"}

def save_assets():
    with open("assets.json", "w") as f:
        json.dump(assets, f)

def load_assets():
    global assets
    try:
        with open("assets.json", "r") as f:
            assets = json.load(f)
    except:
       pass

load_assets()

# scan event logging endpoint
@app.post("/scan-events")
scan_events = []

def save_scan_events():
    with open("scan_events.json", "w") as f:
        json.dump(scan_events, f)

def load_scan_events():
    global scan_events
    try:
        with open("scan_events.json", "r") as f:
            scan_events = json.load(f)
    except:
        scan_events = []

load_scan_events()

@app.post("/scan-events")
def add_scan_event(scan_event: ScanEvent):
    scan_record = {
        "asset_id": scan_event.asset_id,
        "scan_location": scan_event.scan_location,
    }

    scan_events.append(scan_record)
    save_scan_events()

    return {"message": "Scan event logged successfully", "scan_event": scan_record}

@app.get("/scan-events")
def get_scan_events():
    return scan_events

# AI feature for descriptive item state logging
@app.post("/generate-description")
def generate_description(asset: dict):
    prompt = f"""
    Write a short, professional description for a surplus inventory system.

    Item: {asset.get("item_name")}
    Condition: {asset.get("condition")}
    Status: {asset.get("current_status")}
    """

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return {"description": response.content[0].text}
