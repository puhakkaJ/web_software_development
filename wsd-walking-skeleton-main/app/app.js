import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as chatService from "./services/chatService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};


const addChat = async (request) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const message = formData.get("message");

  await chatService.create(name, message);

  return redirectTo("/");
};

const listChats = async (request) => {
  let m = await chatService.findAll();
  if (m.length > 5) {
    m = m.slice(0,5)
  }
  const data = {
    messages: m
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (request.method == "GET" && url.pathname == ("/")) {
    return await listChats(request);
  } else if (request.method == "POST" && url.pathname == ("/")) {
    return await addChat(request);
  } 
  return await listChats(request);
};

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

serve(handleRequest, { port: 7777 });