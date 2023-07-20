import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  let body = await req.json();

  let msg: any;

  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  // Data to be sent in the API request

  const data = {
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: body }],
  };

  const res = await axios.post(url, data, { headers: headers });

  msg = res.data.choices[0].message.content;

  return NextResponse.json(msg);
}
