const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

/**
 * Strictly enforce GPT output format.
 *
 * @param {string} systemPrompt - Instructions for GPT.
 * @param {string|string[]} userPrompt - User question(s).
 * @param {object} outputFormat - Expected JSON structure.
 * @param {string} defaultCategory - Default category if classification fails.
 * @param {boolean} outputValueOnly - Whether to return only the values.
 * @param {string} model - GPT model name.
 * @param {number} temperature - Sampling temperature.
 * @param {number} numTries - Retry attempts if format fails.
 * @param {boolean} verbose - Log debugging info.
 */
async function strict_output(
  systemPrompt,
  userPrompt,
  outputFormat,
  defaultCategory = "",
  outputValueOnly = false,
  model = "z-ai/glm-4.5-air:free",
  temperature = 1,
  numTries = 3,
  verbose = false
) {
  const listInput = Array.isArray(userPrompt);
  const dynamicElements = /<.*?>/.test(JSON.stringify(outputFormat));
  const listOutput = /\[.*?\]/.test(JSON.stringify(outputFormat));

  let errorMsg = "";

  for (let attempt = 0; attempt < numTries; attempt++) {
    let outputFormatPrompt = `\nYou are to output ${
      listOutput ? "an array of objects in" : ""
    } the following in JSON format: ${JSON.stringify(outputFormat)}. 
Do not include unescaped double quotes (") inside any value — use apostrophes (') instead.`;

    if (listOutput) {
      outputFormatPrompt += `\nIf an output field is a list, classify it into the best element.`;
    }

    if (dynamicElements) {
      outputFormatPrompt += `\nAny text enclosed by < and > must be replaced with your own generated content.`;
    }

    if (listInput) {
      outputFormatPrompt += `\nGenerate an array of JSON objects, one per input item.`;
    }

    // Call GPT
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        {
          role: "system",
          content: systemPrompt + outputFormatPrompt + errorMsg,
        },
        {
          role: "user",
          content: Array.isArray(userPrompt)
            ? userPrompt.join("\n")
            : String(userPrompt),
        },
      ],
    });

    let res = completion.choices[0]?.message?.content ?? "";

    // Sanitize bad quotes before parsing
    res = sanitizeJsonString(res);

    if (verbose) {
      console.log("System prompt:", systemPrompt + outputFormatPrompt + errorMsg);
      console.log("User prompt:", userPrompt);
      console.log("GPT response:", res);
    }

    try {
      let parsed = JSON.parse(res);

      if (listInput && !Array.isArray(parsed)) {
        throw new Error("Expected an array of JSON objects but got something else.");
      }
      if (!listInput) {
        parsed = [parsed];
      }

      // Validate and fix values
      for (let obj of parsed) {
        for (const key in outputFormat) {
          if (/<.*?>/.test(key)) continue; // Skip dynamic keys

          if (!(key in obj)) {
            throw new Error(`Missing key: ${key}`);
          }

          if (Array.isArray(outputFormat[key])) {
            const choices = outputFormat[key];
            if (Array.isArray(obj[key])) {
              obj[key] = obj[key][0];
            }
            if (!choices.includes(obj[key]) && defaultCategory) {
              obj[key] = defaultCategory;
            }
            if (typeof obj[key] === "string" && obj[key].includes(":")) {
              obj[key] = obj[key].split(":")[0];
            }
          }
        }

        if (outputValueOnly) {
          const values = Object.values(obj);
          obj = values.length === 1 ? values[0] : values;
        }
      }

      return listInput ? parsed : parsed[0];
    } catch (e) {
      errorMsg = `\n\nResult: ${res}\n\nError: ${e.message}`;
      console.warn("Retrying due to JSON parse error:", e.message);
    }
  }

  return [];
}

/**
 * Clean GPT's output to make it valid JSON.
 * - Fix mismatched quotes in keys
 * - Replace unescaped quotes in values with apostrophes
 */
function sanitizeJsonString(str) {
  str = str.trim();

  // Remove markdown code fences like ```json ... ```
  if (str.startsWith("```")) {
    str = str.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '');
  }

  // Replace single-quoted keys with double quotes
  str = str.replace(/'([^']+)'\s*:/g, '"$1":');

  // Fix mismatched "key' → "key"
  str = str.replace(/"([^"]+)'(\s*):/g, '"$1"$2:');

  // Replace double quotes inside values with apostrophes
  str = str.replace(/:\s*"([^"]*?)"([^,}\]])/g, (match, p1, p2) => {
    return `: "${p1.replace(/"/g, "'")}"${p2}`;
  });

  return str;
}

module.exports = { strict_output };
