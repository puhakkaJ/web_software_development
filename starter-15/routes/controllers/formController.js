import { lastUploadedId } from "../../services/fileService.js";
import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";
import { executeQuery } from "../../database/database.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";


const viewForm = async ({ render }) => {
  const lastId = await lastUploadedId();
  render("index.eta", {
    last_id: lastId,
  });
};

const addFile = async ({ request, response }) => {
  const body = request.body({type: "form-data"});
  const reader = await body.value;
  const data = await reader.read();

  const fileDetails = data.files[0];

  // reading and encoding
  const fileContents = await Deno.readAll(await Deno.open(fileDetails.filename));
  const base64Encoded = base64.fromUint8Array(fileContents);
  const pw = `${Math.floor(100000 * Math.random())}`;
  const p = await bcrypt.hash(pw);


  // store contents

  await executeQuery("INSERT INTO miniupload_files (name, type, data, password) VALUES ($1, $2, $3, $4);",
    fileDetails.originalName,
    fileDetails.contentType,
    base64Encoded,
    p

  );

  response.body = pw;
};

const files = async ({ request, response }) => {
  const body = request.body({type: "form"});
  const reader = await body.value;

  const res = await executeQuery("SELECT * FROM miniupload_files WHERE id = $1;", reader.get("id"));
  const obj = res.rows[0];

  if (obj) {
    if (await bcrypt.compare(reader.get("password") , obj.password)) {
      response.headers.set('Content-Type', obj.type);

      const arr = base64.toUint8Array(obj.data);
      response.body = arr;

    } else {
      response.status = 401;
    }
  } else {
    response.status = 401;
  }
};

export { viewForm, addFile, files };
