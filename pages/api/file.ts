import { Role } from '@ideamall/data-model';
import { createClient } from '@supabase/supabase-js';
import { Fields, File, Files, IncomingForm } from 'formidable';
import { promises } from 'fs';

import { safeAPI, verifyJWT } from './core';

const form = new IncomingForm(),
  supabase = createClient(
    process.env.SUPABASE_APP_HOST!,
    process.env.SUPABASE_APP_KEY!,
  );
const storage = supabase.storage.from(process.env.SUPABASE_FILE_BUCKET!);

export const config = {
  api: { bodyParser: false },
};

export default safeAPI(async (request, response) => {
  const { mobilePhone } = verifyJWT(
    request,
    [Role.Client, Role.Manager, Role.Administrator],
    { status: 403, statusText: 'Forbidden' },
  );
  const { files } = await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) =>
      form.parse(request, (error, fields, files) =>
        error ? reject(error) : resolve({ fields, files }),
      ),
  );
  const { originalFilename, filepath, mimetype } = files.data as File;

  const publicPath = `${mobilePhone}/${originalFilename}`;

  const { error } = await storage.upload(
    publicPath,
    await promises.readFile(filepath),
    { contentType: mimetype || undefined },
  );
  if (error) throw new URIError(error.message);

  const { publicUrl } = storage.getPublicUrl(publicPath).data;

  response.send({ path: publicUrl });
});
