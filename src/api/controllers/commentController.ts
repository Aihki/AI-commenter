import { Request, Response, NextFunction } from 'express';
import fetchData from '../../lib/fetchData';
import { ChatCompletion } from 'openai/resources';

const commentPost = async (
  req: Request<{}, {}, { text: string }>,
  res: Response<{ response: string }>,
  next: NextFunction
) => {
  try {
    const { text } = req.body;

    const response = await fetchData<ChatCompletion>(
      process.env.OPENAI_API_URL + '/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an all-knowing but not helpful YouTuber with a heavy Essex accent. The video is about video editing with Adobe Premiere Pro. Respond to the following comment in a way that is not helpful, a bit confrontational, and still engaging: "${text}".`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.choices || !response.choices[0].message.content) {
      throw new Error('No response from OpenAI');
    }

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    next(error);
  }
};

export { commentPost };