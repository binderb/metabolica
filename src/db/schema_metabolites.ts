import { relations } from "drizzle-orm";
import { boolean, decimal, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { FcTreeStructure } from "react-icons/fc";

export type Metabolite = typeof metabolites.$inferSelect;
export type Reaction = typeof reactions.$inferSelect;

export const metabolites = pgTable('metabolites', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 500}).notNull(),
  shortName: varchar('short_name', {length: 500}),
  structure: text('structure').notNull(),
});

export const metabolitesRelations = relations(metabolites, ({many}) => ({
  metabolitesToReactions: many(metabolitesToReactions),
}));

export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  identifier: varchar('identifier', {length: 500}).notNull(),
  enzyme: integer('enzyme').references(()=>enzymes.id),
  deltaG: decimal('delta_g',{precision: 5, scale: 2}).notNull(), // maybe for now, just set to 0 if a reaction is supposed to be reversible, and set to -1000 if it's irreversible. This is just a placeholder for now.
  description: text('description'),
  reverseDescription: text('reverse_description'),
});

export const reactionsRelations = relations(reactions, ({one,many}) => ({
  enzyme: one(enzymes, {
    fields: [reactions.enzyme],
    references: [enzymes.id]
  }),
  metabolitesToReactions: many(metabolitesToReactions),
  pathways: many(reactionsToPathways),
}));

export const metabolitesToReactions = pgTable('metabolites_rxns', {
  id: serial('id').primaryKey(),
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

export const enzymesRelations = relations(enzymes, ({one}) => ({
  reaction: one(reactions),
}));

export const pathways = pgTable('pathways', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 500}).notNull(),
});

export const pathwaysRelations = relations(pathways, ({many}) => ({
  reactions: many(reactionsToPathways),
}));

export const reactionsToPathways = pgTable('reactions_pathways', {
  id: serial('id').primaryKey(),
  reactionId: integer('reaction_id').references(()=>reactions.id).notNull(),
  pathwayId: integer('pathway_id').references(()=>pathways.id).notNull(),
});

export const reactionsToPathwaysRelations = relations(reactionsToPathways, ({one}) => ({
  reactionId: one(reactions, {
    fields: [reactionsToPathways.reactionId],
    references: [reactions.id]
  }),
  pathwayId: one(pathways, {
    fields: [reactionsToPathways.pathwayId],
    references: [pathways.id]
  }),
}));
