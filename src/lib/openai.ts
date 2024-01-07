import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an creative and helpful AI assistance capable of generating an aesthetic, simplistic, minimalistic and flat styled thumbnail for my note page in a note taking application made with nextjs.14(a clone of notion). Your output will be fed into the DALLE API to generate a thumbnail.",
        },
        {
          role: "user",
          content: `Please generate an aesthetic, simplistic, minimilistic thumbnail for my notebook titled: ${name}. Please make sure there is no text/words/letters in the thumbnail.`,
        },
      ],
    });
    const data = await response.json();
    const image_description = data.choices[0].message.content;
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(image_description: string){
    try{
        const response = await openai.createImage({
            prompt: image_description,
            n:1,
            size:'256x256'
        })
        const data = await response.json()
        const image_url = data.data[0].url;
        return image_url as string;
    } catch(error){
        console.error(error)
    }
}