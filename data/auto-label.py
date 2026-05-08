"""
Rule-based auto-labeling for prompts.
Uses keyword matching on title + description to assign topic tags.
No API calls needed — runs instantly.
"""

import json
from pathlib import Path

TAXONOMY_RULES = {
    "infographic": {
        "keywords": [
            "infographic", "diagram", "flowchart", "timeline", "atlas",
            "evolution", "causal chain", "因果链", "information", "百科",
            "encyclopedia", "explainer", "data-driven", "chart",
            "cross-section", "anatomy", "process", "系统", "剖面",
            "module", "relationship diagram", "人物关系",
        ],
        "title_keywords": [
            "infographic", "atlas", "flowchart", "diagram",
        ],
    },
    "brand-identity": {
        "keywords": [
            "brand identity", "brand design", "logo", "merch board",
            "merchandise", "brand guideline", "brand system", "branding",
            "品牌", "视觉识别", "brand dna",
        ],
        "title_keywords": [
            "brand identity", "brand", "logo design", "merch",
        ],
    },
    "ui-ux-design": {
        "keywords": [
            "ui design", "ux design", "landing page", "web design",
            "design system", "dashboard", "mockup", "website", "app ",
            "navigation", "button", "component", "web page",
            "e-commerce", "hero section",
        ],
        "title_keywords": [
            "ui", "ux", "landing page", "design system", "website",
            "web design", "e-commerce",
        ],
    },
    "product-ad": {
        "keywords": [
            "advertisement", "promotional", "promo", "banner",
            "sales", "marketing", "campaign", "price", "discount",
            "limited", "poster", "ad banner", "広告", "販売",
            "宣伝", "セール", "product shot", "beverage",
            "販促", "商品",
        ],
        "title_keywords": [
            "promo", "ad ", "advertisement", "promotional",
            "banner set",
        ],
    },
    "anime-manga": {
        "keywords": [
            "anime", "manga", "manga spread", "panel", "speech bubble",
            "screentone", "monochrome manga", "アニメ", "マンガ",
            "cel-shading", "anime-style", "anime illustration",
        ],
        "title_keywords": [
            "anime", "manga",
        ],
    },
    "illustration": {
        "keywords": [
            "illustration", "cinematic illustration", "scene",
            "dramatic", "atmospheric", "watercolor",
            "sketch", "drawing", "artistic",
        ],
        "title_keywords": [
            "illustration", "portrait", "scene",
        ],
    },
    "photography": {
        "keywords": [
            "photograph", "photo", "cinematic shot", "flash",
            "camera angle", "photorealistic", "portrait",
            "aerial", "drone shot", "studio portrait",
            "vintage", "film texture",
        ],
        "title_keywords": [
            "photograph", "photo", "portrait", "aerial",
        ],
    },
    "game-mockup": {
        "keywords": [
            "video game", "game screenshot", "game ui", "game mockup",
            "first-person", "third-person", "voxel", "open-world",
            "minimap", "health bar", "inventory", "gta", "minecraft",
            "arcade", "rpg",
        ],
        "title_keywords": [
            "game", "arcade", "voxel",
        ],
    },
    "fashion": {
        "keywords": [
            "fashion", "lookbook", "outfit", "clothing", "garment",
            "catalog", "textile", "dress", "collection", "穿搭",
            "ファッション", "コーデ", "wear",
        ],
        "title_keywords": [
            "fashion", "lookbook", "outfit", "catalog", "garment",
        ],
    },
    "food-culinary": {
        "keywords": [
            "food", "recipe", "cooking", "cuisine", "dish", "meal",
            "restaurant", "culinary", "kitchen", "gourmet", "tea",
            "グルメ", "料理", "食", "吃", "美食", "steak",
            "beverage", "drink",
        ],
        "title_keywords": [
            "food", "recipe", "culinary", "tea",
        ],
    },
    "medical-science": {
        "keywords": [
            "medical", "anatomy", "disease", "pathology", "health",
            "organ", "clinical", "diabetes", "gout", "surgical",
            "botanical", "biology", "scientific", "plant",
            "cell", "molecule",
        ],
        "title_keywords": [
            "medical", "pathology", "botanical", "science",
            "diabetes", "gout",
        ],
    },
    "comic-satire": {
        "keywords": [
            "comic strip", "comic", "satire", "satirical",
            "caricature", "humor", "humorous", "funny", "pun",
            "therapy session", "4-panel",
        ],
        "title_keywords": [
            "comic", "satire", "satirical", "caricature", "pun",
        ],
    },
    "character-design": {
        "keywords": [
            "character design", "character sheet", "reference sheet",
            "expression sheet", "turnaround", "settei", "mascot",
            "pose library", "costume", "character reference",
        ],
        "title_keywords": [
            "character design", "character sheet", "mascot", "settei",
            "costume",
        ],
    },
    "poster-event": {
        "keywords": [
            "event poster", "festival", "match", "tournament",
            "fireworks", "concert", "celebration", "花火",
            "champions league", "soccer", "sports",
        ],
        "title_keywords": [
            "poster", "festival", "event", "match",
        ],
    },
    "educational": {
        "keywords": [
            "educational", "explainer", "encyclopedia", "百科",
            "tutorial", "guide", "lesson", "learning",
            "mythology", "history", "cultural",
        ],
        "title_keywords": [
            "educational", "explainer", "encyclopedia", "guide",
        ],
    },
    "3d-render": {
        "keywords": [
            "3d render", "3d model", "3d cartoon", "3d illustration",
            "isometric", "exploded view", "voxel", "blender",
            "clay render", "3d scene", "3d art",
        ],
        "title_keywords": [
            "3d", "exploded view", "isometric",
        ],
    },
    "concept-art": {
        "keywords": [
            "concept art", "cinematic", "surreal", "gothic",
            "fantasy", "sci-fi", "dystopian", "cyberpunk",
            "dark fantasy", "matte painting",
        ],
        "title_keywords": [
            "concept", "surreal", "gothic", "cyberpunk", "fantasy",
        ],
    },
    "logo-design": {
        "keywords": [
            "logo", "logotype", "wordmark", "icon design",
            "app icon", "favicon",
        ],
        "title_keywords": [
            "logo",
        ],
    },
    "social-media": {
        "keywords": [
            "social media", "livestream", "live stream", "douyin",
            "tiktok", "instagram", "twitter", "profile",
            "直播", "抖音",
        ],
        "title_keywords": [
            "social media", "livestream", "live stream", "douyin",
        ],
    },
    "technical-diagram": {
        "keywords": [
            "technical diagram", "hardware", "optical", "schematic",
            "circuit", "engineering", "scientific diagram",
            "cross-section", "cutaway", "blueprint",
            "setup diagram", "hardware setup",
        ],
        "title_keywords": [
            "technical", "hardware", "optical", "schematic", "diagram",
        ],
    },
}

# Special overrides for ambiguous prompts
FORCE_TAGS = {
    # Exploded views are both infographic + 3d-render
    "exploded view": ["infographic", "3d-render"],
    # Map infographics
    "food map": ["infographic", "food-culinary"],
    # Skincare landing pages
    "skincare": ["ui-ux-design", "product-ad"],
    # Anime promo
    "anime.*promo": ["anime-manga", "product-ad"],
    # Manga spread
    "manga spread": ["anime-manga", "comic-satire"],
}


def classify_prompt(prompt_data):
    """Classify a single prompt based on title + description keywords."""
    title = prompt_data.get("title", "").lower()
    desc = prompt_data.get("description", "").lower()
    combined = f"{title} {desc}"

    scores = {}

    for tag, rules in TAXONOMY_RULES.items():
        score = 0

        # Title keyword match (higher weight)
        for kw in rules.get("title_keywords", []):
            if kw.lower() in title:
                score += 3

        # General keyword match
        for kw in rules["keywords"]:
            if kw.lower() in combined:
                score += 1

        if score > 0:
            scores[tag] = score

    # Sort by score descending, take top 2-4
    sorted_tags = sorted(scores.items(), key=lambda x: -x[1])

    # Take at least 2, at most 4
    tags = []
    for tag, score in sorted_tags:
        if len(tags) >= 4:
            break
        if score >= 1:
            tags.append(tag)

    # Ensure at least 1 tag — fallback to "illustration"
    if not tags:
        tags = ["illustration"]

    return tags


def main():
    input_path = Path(__file__).parent.parent / "public" / "prompts.json"

    with open(input_path, "r", encoding="utf-8") as f:
        prompts = json.load(f)

    print(f"📦 Loaded {len(prompts)} prompts")
    print(f"🏷️  Taxonomy: {len(TAXONOMY_RULES)} categories")
    print()

    # Classify all
    tag_counts = {}
    untagged = []

    for p in prompts:
        tags = classify_prompt(p)
        p["tags"] = tags

        for t in tags:
            tag_counts[t] = tag_counts.get(t, 0) + 1

        if tags == ["illustration"]:
            untagged.append(p["id"])

    # Write output
    output_path = input_path  # overwrite in-place
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(prompts, f, ensure_ascii=False, indent=2)

    print(f"✅ Done! Tagged {len(prompts)} prompts")
    print(f"📂 Output: {output_path}")

    # Tag distribution
    print(f"\n📊 Tag Distribution:")
    for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1]):
        bar = "█" * (count // 5)
        print(f"  {tag:20s} {count:4d} {bar}")

    # Fallback prompts
    if untagged:
        print(f"\n⚠️  {len(untagged)} prompts fell back to 'illustration' (ids: {untagged[:20]}...)")

    # Tags per prompt stats
    tag_per_prompt = [len(p["tags"]) for p in prompts]
    avg = sum(tag_per_prompt) / len(tag_per_prompt)
    print(f"\n📈 Avg tags/prompt: {avg:.1f}")
    print(f"   Min: {min(tag_per_prompt)}, Max: {max(tag_per_prompt)}")


if __name__ == "__main__":
    main()
