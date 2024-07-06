'use server';

import { db } from "@/db";
import { metabolites } from "@/db/schema_metabolites";
import { revalidatePath } from "next/cache";

export async function addMetabolite (formData:FormData) {
  if (!formData.get('name')) {
    throw new Error('Name is required');
  }
  if (!formData.get('structure')) {
    throw new Error('Structure is required');
  }
  await db.insert(metabolites).values([{
    name: formData.get('name') as string,
    structure: formData.get('structure') as string,
  }]);
  revalidatePath('/admin');
}