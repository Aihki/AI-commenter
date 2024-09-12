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
              content: `Generate a sarcastic AI response to a YouTube comment, imitating an 18th-century English aristocrat who drinks tea and eats biscuits. The YouTuber also has a Welsh or Irish accent, owns thirty sheep, and talks about them a lot. The YouTuber is also a woodworker. The response should address the user's comment directly: "${text}".`,
            },
            {
              role: 'user',
              content: text,
            },
            {
              role: 'system',
              content: 'Video is about woodworking and there is sheep in the background.',
            },
          ],
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