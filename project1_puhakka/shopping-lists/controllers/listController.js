import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "../services/listService.js";

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
};
  
const redirectTo = (path) => {
    return new Response(`Redirecting to ${path}.`, {
      status: 303,
      headers: {
        "Location": path,
        "Content-Type": "text/html;charset=UTF-8"
      },
    });
};

const deactivate = async (request) => {  
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[2];
    await listService.deactivateById(id);
    return redirectTo("/lists");
};

const main = async (request) => {
    const data = {
        list_count: await listService.countLists(),
        item_count: await listService.countItems()
    };

    return new Response(await renderFile("statistics.eta", data), responseDetails);
};
  
const individualList = async (request) => {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[2];
    let items = await listService.getItems(id);
  
    const data = {
      shopping_list: await listService.findById(id),
      items: items.sort(function(a,b){
        return a.name.localeCompare(b.name);
      }).filter(item => item.collected == false),
      items_collected: items.sort(function(a,b){
        return a.name.localeCompare(b.name);
      }).filter(item => item.collected == true)
    };
  
    return new Response(await renderFile("list.eta", data), responseDetails);
};
  
const addList = async (request) => {
    const formData = await request.formData();
  
    const name = formData.get("name");
    await listService.create(name);
    return redirectTo("/lists");
};

const addItem = async (request) => {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[2];
    const formData = await request.formData();
  
    const name = formData.get("name");
    await listService.addItem(name, id);
    return redirectTo(`/lists/${id}`);
};

const collectItem = async (request) => {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[2];
    const id_item = parts[4];
  
    await listService.collectItemById(id_item);
    return redirectTo(`/lists/${id}`);
};

const allLists = async (request) => {
    const data = {
        shopping_lists: await listService.findAllActive()
    };

    return new Response(await renderFile("lists.eta", data), responseDetails);
};

export { addList, individualList, deactivate, allLists, addItem, main, collectItem };

