const { Client } = require("@gradio/client");

const app = await Client.connect("parler-tts/parler_tts");
const result = await app.predict("/gen_tts", [
  "Hello!!", // string  in 'Input Text' Textbox component
  "Hello!!", // string  in 'Description' Textbox component
  true, // boolean  in 'Use Large checkpoint' Checkbox component
]);

console.log(result.data);
