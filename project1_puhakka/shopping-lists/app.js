import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listController from "./controllers/listController.js";


configure({
  views: `${Deno.cwd()}/views/`,
});


const handleRequest = async (request) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").length;

  if (request.method == "GET" && url.pathname == ("/")) {
    return listController.main(request);
  } else if (request.method == "GET" && url.pathname == ("/lists")) {
    return listController.allLists(request);
  } else if (request.method == "POST" && url.pathname === ("/lists")) {
    return await listController.addList(request);
  } else if (request.method == "POST" && url.pathname.includes("/deactivate") && parts == 4) {
    return await listController.deactivate(request);
  } else if (request.method == "GET" && url.pathname.includes("/lists") && parts == 3) {
    return listController.individualList(request);
  } else if (request.method == "POST" && url.pathname.includes("/items") && parts == 4) {
    return listController.addItem(request);
  } else if (request.method == "POST" && url.pathname.includes("/collect") && parts == 6) {
    return listController.collectItem(request);
  } else {
    return new Response("Not found", { status: 303, headers: {
      "Location": path,
      "Content-Type": "text/html;charset=UTF-8"
    }, });
  }
  
};

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

serve(handleRequest, { port: port });
