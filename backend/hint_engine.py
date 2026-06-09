# hint_engine.py
# This is the bridge between your classifier and the AI providers
# It takes the problem text + detected pattern and sends it to whichever AI the user chose
# All three providers receive the exact same prompt — only the API call differs

import anthropic
import openai
import google.generativeai as genai
import yaml
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Load your prompt config from hints.yaml
# This is why we stored prompts separately — one place to change everything
with open("prompts/hints.yaml", "r") as f:
    config = yaml.safe_load(f)

# ── API clients ──────────────────────────────────────────────────────────────
# Each client is initialized once when the file loads
# They read API keys from your .env file — never hardcoded

claude_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

openai_client = openai.OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


def build_prompt(problem_text: str, pattern: str, confidence: float) -> str:
    # Fill in the {pattern} and {confidence} placeholders in your yaml template
    # This is where your classifier output gets injected into the prompt
    system = config["system_prompt"].format(
        pattern=pattern,
        confidence=confidence
    )
    return system


def parse_response(raw_text: str) -> dict:
    # All three AIs are forced to return JSON by our prompt
    # But sometimes they wrap it in markdown code blocks like ```json ... ```
    # This function strips that out and parses cleanly
    clean = raw_text.strip()
    if clean.startswith("```"):
        # Remove opening ```json or ``` and closing ```
        clean = clean.split("\n", 1)[-1]
        clean = clean.rsplit("```", 1)[0]
    return json.loads(clean.strip())


async def get_hints_claude(problem_text: str, pattern: str, confidence: float) -> dict:
    prompt = build_prompt(problem_text, pattern, confidence)
    
    message = claude_client.messages.create(
        model=config["providers"]["claude"]["model"],
        max_tokens=config["providers"]["claude"]["max_tokens"],
        system=prompt,
        messages=[
            {"role": "user", "content": f"Problem: {problem_text}"}
        ]
    )
    
    raw = message.content[0].text
    return parse_response(raw)


async def get_hints_openai(problem_text: str, pattern: str, confidence: float) -> dict:
    prompt = build_prompt(problem_text, pattern, confidence)
    
    response = openai_client.chat.completions.create(
        model=config["providers"]["openai"]["model"],
        max_tokens=config["providers"]["openai"]["max_tokens"],
        temperature=config["providers"]["openai"]["temperature"],
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"Problem: {problem_text}"}
        ]
    )
    
    raw = response.choices[0].message.content
    return parse_response(raw)


async def get_hints_gemini(problem_text: str, pattern: str, confidence: float) -> dict:
    prompt = build_prompt(problem_text, pattern, confidence)
    
    model = genai.GenerativeModel(
        model_name=config["providers"]["gemini"]["model"],
        system_instruction=prompt
    )
    
    response = model.generate_content(f"Problem: {problem_text}")
    raw = response.text
    return parse_response(raw)


# This is the single function your main.py will call
# It routes to the right provider based on user's choice
async def generate_hints(problem_text: str, pattern: str, confidence: float, provider: str = "claude") -> dict:
    
    handlers = {
        "claude": get_hints_claude,
        "openai": get_hints_openai,
        "gemini": get_hints_gemini
    }
    
    # If someone passes an invalid provider name, default to claude
    handler = handlers.get(provider, get_hints_claude)
    
    result = await handler(problem_text, pattern, confidence)
    
    # Always attach which provider was used and the pattern info
    # Frontend needs this to display properly
    result["provider_used"] = provider
    result["detected_pattern"] = pattern
    result["confidence"] = confidence
    
    return result