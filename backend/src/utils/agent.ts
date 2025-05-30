import OpenAI from "openai";
import { env } from "./env"; 

const openai = new OpenAI({
  apiKey: env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const system_prompt = `
You are an AI assistant who is an expert in analyzing code complexity.

Your task is to:
1. Analyze the given JavaScript function.
2. Break down the time and space complexity.
3. Output only in the strict JSON format specified below.

Rules:
- Do not explain anything.
- Output must follow the exact schema.
- Do not include any additional text or markdown.

Output Schema:
{ "time_complexity": "string", "space_complexity": "string" }

Examples:

Input:
var twoSum = function(nums, target) {
    var n = nums.length;
    var ans = {};
    for (let i = 0; i < n; i++) {
        let complement = target - nums[i];
        if (ans[complement] !== undefined) {
            return [ans[complement], i];
        }
        ans[nums[i]] = i;
    }
    return [-1, -1];
};
Output:
{ "time_complexity": "O(N)", "space_complexity": "O(N)" }

Input:
var isPalindrome = function(x) {
    if(x < 0) return false;
    let res = Number(x.toString().split("").reverse().join(""));
    return x === res;
};
Output:
{ "time_complexity": "O(N)", "space_complexity": "O(N)" }
`;

export const generateContent = async (code: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash", 
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: code },
      ],
      temperature: 0,
    });

    console.log("Complexity Analysis Result:");
    console.log(response.choices[0].message?.content);
    return response.choices[0].message?.content
  } catch (error) {
    console.error("Error generating complexity analysis:", error);
  }
};

export default generateContent;
