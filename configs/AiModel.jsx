const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AIDesignIdea = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Based on Logo of type Modern Mascot Logos Generate a text prompt to create Logo for Logo title/Brand name: Indian Spice with description: Indian Restaurant and referring to prompt: A vibrant logo featuring a friendly, animated character with a playful expression. The character is dressed in a classic uniform, complete with a distinctive accessory that adds personality. In one hand, they hold a signature item that represents the brand, while the other elements of the design—such as small decorative touches or natural accents—enhance the overall look. The background consists of a bold, circular design with subtle accents to highlight the character. Below, the brand name is displayed in bold, stylized lettering, with a slight curve and complementary decorative lines. The overall style is fun, welcoming, and full of character. Below, the brand name is displayed in bold, stylized lettering, with a slight curve and complementary decorative lines. The overall style is fun, welcoming, and full of character. Give me 4/5 Suggestions of logo idea (each idea with maximum 4-5 words), Result in JSON format with ideas field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: 'I am sorry, the capability to generate images is only enabled for early testers. However, I can provide you with logo ideas in JSON format as requested.\n\n```json\n{\n  "ideas": [\n    "Chef Elephant with Spices",\n    "Smiling Tiger with Curry Pot",\n    "Dancing Peacock Spice Master",\n    "Whimsical Elephant Chef Mascot",\n    "Friendly Tiger Serving Spices"\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const AILogoPrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "prompt Generate a text prompt to create Logo for Logo Title/Brand name : asdf,with description: asdf, with Color combination of Soft Purples, also include the {logoIdea} and include Vintage Logo Designs With Text & Icon design idea and Referring to this Logo Prompt:Design a collection of vintage-inspired logos with a hand-drawn, artistic style. Incorporate a variety of themes, including food, animals, characters, and unique brand elements. Each logo should feature bold typography, intricate details, and a retro aesthetic that is versatile and suitable for diverse brands or businesses.  Give me result in JSON portal with prompt field only",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "prompt": "Design a vintage logo for the brand \\"JESUS\\". The logo should evoke a sense of nostalgia and quality, incorporating a hand-drawn, artistic style. Use a soft purple color palette to create a calming and sophisticated feel. The logo should feature a blend of bold typography and an intricate icon {logoIdea} that visually represents \\"asdf\\", perhaps abstractly or through a symbolic element. Consider vintage logo designs with text and icon integration for inspiration.  Specifically, aim for a design similar to vintage logos featuring food, animals, characters, or unique brand elements, with bold typography, intricate details, and a retro aesthetic suitable for diverse brands. Focus on versatility and visual appeal within the vintage style."\n}\n```\n',
        },
      ],
    },
  ],
});

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
