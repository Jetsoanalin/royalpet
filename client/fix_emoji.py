#!/usr/bin/env python3
"""Fix common UTF-8 mojibake sequences in RoyalPetClinicApp.jsx"""
import re
from pathlib import Path

path = Path("src/pages/RoyalPetClinicApp.jsx")
text = path.read_text(encoding="utf-8")

replacements = [
    ("Y'S", "💊"),
    ('Y"Z', "📎"),
    ('Y"z', "📞"),
    ("Y'?", "💉"),
    ("Y'?s.️", "👨‍⚕️"),
    ("Y'?Y'", "👩‍💼"),
    ("Y>️", "🛠️"),
    ("Y ", "🐾"),
    ("Y'", "👥"),
    ("Y\"", "📦"),
    ("Y-", "🖨"),
    ("Y' ", "💳"),
    ("Y> ", "🛠️ "),
    ("o.", "✕"),
    ("o️", "✏️"),
    ("o\"", "✓"),
    ("s ️", "⚠️"),
    ("s ️", "⚠️"),
    ("Ys ", "🚨 "),
    ("Lactated Ringer?Ts", "Lactated Ringer's"),
]

# Currency fixes - replace leading comma before numbers in JSX strings
text = re.sub(r'>(\s*),(\d)', r'>\1₹\2', text)
text = re.sub(r'(\s),(\d)', r'\1₹\2', text)
text = re.sub(r'Total: ,', 'Total: ₹', text)
text = re.sub(r'Price per Unit \(,\)', 'Price per Unit (₹)', text)
text = re.sub(r'Rate \(,\)', 'Rate (₹)', text)

for old, new in replacements:
    text = text.replace(old, new)

path.write_text(text, encoding="utf-8")
print("Emoji fixes applied")
