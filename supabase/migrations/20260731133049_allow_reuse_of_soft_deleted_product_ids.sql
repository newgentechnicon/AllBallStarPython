-- Keep product IDs unique only among products that are still active.
-- Creating the replacement index first preserves uniqueness throughout the migration.
create unique index if not exists products_active_product_id_key
  on public.products (product_id)
  where deleted_at is null;

alter table public.products
  drop constraint if exists products_product_id_key;
