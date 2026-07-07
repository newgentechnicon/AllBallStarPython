create or replace function public.get_product_status_counts(p_farm_id bigint)
returns table(status text, total bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select 'All'::text as status, count(*)::bigint as total
  from public.products
  where farm_id = p_farm_id
    and deleted_at is null

  union all

  select products.status::text as status, count(*)::bigint as total
  from public.products
  where farm_id = p_farm_id
    and deleted_at is null
    and products.status in ('Available', 'On Hold')
  group by products.status;
$$;

create index if not exists products_farm_deleted_created_idx
  on public.products (farm_id, created_at desc)
  where deleted_at is null;

create index if not exists products_status_deleted_created_idx
  on public.products (status, created_at desc)
  where deleted_at is null;

create index if not exists products_year_deleted_idx
  on public.products (year)
  where deleted_at is null;

create index if not exists products_price_deleted_idx
  on public.products (price)
  where deleted_at is null;

create extension if not exists pg_trgm with schema extensions;

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists morph_sub_categories_category_id_idx
  on public.morph_sub_categories (category_id);

create index if not exists morph_sub_sub_categories_sub_category_id_idx
  on public.morph_sub_sub_categories (sub_category_id);

alter function public.get_morphs_structured() set search_path = public;
alter function public.handle_updated_at() set search_path = public;

drop policy if exists "Allow individual read access" on public.farms;
drop policy if exists "Allow individual insert access" on public.farms;
drop policy if exists "Allow individual update access" on public.farms;

create policy "Allow individual insert access"
  on public.farms
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Allow individual update access"
  on public.farms
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Allow owner to insert products" on public.products;
drop policy if exists "Allow owner to update their products" on public.products;

create policy "Allow owner to insert products"
  on public.products
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Allow owner to update their products"
  on public.products
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Allow owner to manage their product morphs" on public.product_morphs;

create policy "Allow owner to insert product morphs"
  on public.product_morphs
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.products
      where products.id = product_morphs.product_id
        and products.user_id = (select auth.uid())
    )
  );

create policy "Allow owner to update product morphs"
  on public.product_morphs
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_morphs.product_id
        and products.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.products
      where products.id = product_morphs.product_id
        and products.user_id = (select auth.uid())
    )
  );

create policy "Allow owner to delete product morphs"
  on public.product_morphs
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_morphs.product_id
        and products.user_id = (select auth.uid())
    )
  );
