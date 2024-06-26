import { relations } from "drizzle-orm";
import { boolean, decimal, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const metabolites = pgTable('metabolites', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 500}).notNull(),
  smiles: varchar('smiles', {length: 500}).notNull(),
});

export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  pathway: varchar('pathway', {length: 500}).notNull(),
  deltaG: decimal('delta_g',{precision: 5, scale: 2}).notNull(), // maybe for now, just set to 0 if a reaction is supposed to be reversible, and set to -1000 if it's irreversible. This is just a placeholder for now.
});

export const metabolitesToReactions = pgTable('metabolites_rxns', {
  metaboliteId: integer('metabolite_id').references(()=>metabolites.id).notNull(),
  reactionId: integer('reaction_id').references(()=>reactions.id).notNull(),
  index: decimal('index',{precision: 3, scale: 1}).notNull(), // to keep track of relationships between reactants and products; multiple species that combine to form a product will have the same whole number index and different decimal indices. Same idea for reactants that split into multiple products.
  side: integer('side').notNull(), // 0 for reactants, 1 for products
});

export const metabolitesToReactionsRelations = relations(metabolitesToReactions, ({one}) => ({
  metaboliteId: one(metabolites, {
    fields: [metabolitesToReactions.metaboliteId],
    references: [metabolites.id]
  }),
  reactionId: one(reactions, {
    fields: [metabolitesToReactions.reactionId],
    references: [reactions.id]
  }),
}));

export const enzymes = pgTable('enzymes', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 500}).notNull(),
});

