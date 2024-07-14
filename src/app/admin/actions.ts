'use server';

import { db } from "@/db";
import { Metabolite, metabolites, metabolitesToReactions, reactions } from "@/db/schema_metabolites";
import { revalidatePath } from "next/cache";

type SubReaction = {
  before: Metabolite[];
  after: Metabolite[];
};

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

export async function addReaction (formData:FormData, subRxns: SubReaction[]) {
  if (!formData.get('identifier')) {
    throw new Error('Identifier is required');
  }
  if (!formData.get('deltaG')) {
    throw new Error('DeltaG is required');
  }
  if (!formData.get('description')) {
    throw new Error('Description is required');
  }
  if (subRxns.length === 0) {
    throw new Error('At least one subreaction is required');
  }
  const newRxn = await db.insert(reactions).values([{
    identifier: formData.get('identifier') as string,
    deltaG: formData.get('deltaG') as string,
    description: formData.get('description') as string,
  }]).returning();
  if (!newRxn) {
    throw new Error('Failed to add reaction');
  }
  // Insert many-to-many relationships for metabolitesToReactions.
  for (let i=0; i<subRxns.length; i++) {
    const subRxn = subRxns[i];
    for (let j=0; j<subRxn.before.length; j++) {
      await db.insert(metabolitesToReactions).values([{
        metaboliteId: subRxn.before[j].id,
        reactionId: newRxn[0].id,
        index: `${i}.${j}`,
        side: 0,
      }]);
    }
    for (let j=0; j<subRxn.after.length; j++) {
      await db.insert(metabolitesToReactions).values([{
        metaboliteId: subRxn.after[j].id,
        reactionId: newRxn[0].id,
        index: `${i}.${j}`,
        side: 1,
      }]);
    }
  }
  
}