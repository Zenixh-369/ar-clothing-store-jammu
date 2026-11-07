create table if not exists public.products (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  category text not null,
  collections text[] not null default '{}',
  price numeric(10,2) not null check (price > 0),
  description text not null default '',
  material text not null default '',
  color text not null default '',
  badge text not null default '',
  image text not null,
  images text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  "newArrival" boolean not null default false,
  "sizeType" text not null default 'standard' check ("sizeType" in ('standard','one-size','footwear')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
grant select,insert,update,delete on table public.products to service_role;

alter table public.products add column if not exists images text[] not null default '{}';
alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;

insert into public.products (slug,name,category,collections,price,description,material,color,badge,image,featured,"newArrival","sizeType") values
('everyday-shirt','The Everyday Shirt','Tops',array['menswear','tops'],78,'An easy, beautifully cut shirt made from crisp natural cotton. Designed to soften with every wear and go with just about everything.','100% organic cotton','Chalk','Everyday essential','photo-1598554747436-c9293d6a588f',true,false,'standard'),
('linen-trouser','Relaxed Linen Trouser','Bottomwear',array['menswear','womenswear','bottomwear'],110,'Airy European linen with an easy drape and a relaxed, considered fit for long days and slow weekends.','100% European linen','Sand','Just in','photo-1509631179647-0177331693ae',true,true,'standard'),
('soft-form-knit','Soft Form Knit','Tops',array['menswear','womenswear','tops'],96,'A soft cotton knit with a clean shape, subtle texture, and just enough structure to hold its form.','Organic cotton blend','Ink','', 'photo-1576566588028-4147f3842f27',true,false,'standard'),
('everywhere-tote','Everywhere Tote','Accessories',array['accessories'],42,'A sturdy, considered carryall for market mornings, work days, and everything in between.','Recycled cotton canvas','Black','Just in','photo-1590874103328-eac38a683ce7',true,true,'one-size'),
('weekend-jacket','The Weekend Jacket','Jackets',array['menswear','jackets'],148,'A confident layer in substantial cotton twill. An everyday jacket with the kind of details you notice over time.','Cotton twill','Charcoal','', 'photo-1551028719-00167b16eac5',false,false,'standard'),
('ribbed-tank','Ribbed Tank','Tops',array['womenswear','tops'],48,'A soft, close-fitting essential with a fine rib and a clean neckline. Made for layering or wearing on its own.','Organic cotton','Ivory','', 'photo-1503342217505-b0a15ec3261c',false,false,'standard'),
('everyday-cap','Everyday Cap','Accessories',array['accessories'],36,'A relaxed cotton cap finished with tonal stitching and an adjustable back strap.','Cotton canvas','Stone','', 'photo-1588850561407-ed78c282e89b',false,false,'one-size'),
('sunday-dress','Easy Sunday Dress','Womenswear',array['womenswear'],128,'A fluid linen dress with an effortless shape and understated details. Ready for warm afternoons and late dinners.','Washed linen','Black','New','photo-1539008835657-9e8e9680c956',false,true,'standard'),
('everyday-denim','Straight Leg Denim','Bottomwear',array['menswear','bottomwear'],98,'A straight-leg jean in durable cotton denim with a relaxed seat and a clean, versatile wash.','Recycled cotton denim','Mid wash','New','photo-1542272604-787c3835535d',true,true,'standard'),
('court-sneaker','The Court Sneaker','Footwear',array['menswear','womenswear','footwear'],120,'An easy low-top sneaker with a clean profile, cushioned footbed, and responsibly sourced leather.','Leather upper · recycled sole','White / Ink','Just in','photo-1542291026-7eec264c27ff',true,true,'footwear'),
('utility-overshirt','Utility Overshirt','Jackets',array['menswear','jackets'],168,'A substantial cotton overshirt with considered pockets and an easy layer-ready shape.','Heavyweight organic cotton','Olive','', 'photo-1591047139829-d91aecb6caea',false,false,'standard'),
('wide-leg-trouser','Wide Leg Trouser','Bottomwear',array['womenswear','bottomwear'],118,'A fluid wide-leg trouser cut from soft draping cotton with an adjustable waist and deep pockets.','Cotton lyocell blend','Black','New','photo-1594633312681-425c7b97ccd1',false,true,'standard')
on conflict (slug) do nothing;

-- Convert the starter catalog from its original USD values to INR at ₹90/USD.
update public.products set price=7020 where slug='everyday-shirt';
update public.products set price=9900 where slug='linen-trouser';
update public.products set price=8640 where slug='soft-form-knit';
update public.products set price=3780 where slug='everywhere-tote';
update public.products set price=13320 where slug='weekend-jacket';
update public.products set price=4320 where slug='ribbed-tank';
update public.products set price=3240 where slug='everyday-cap';
update public.products set price=11520 where slug='sunday-dress';
update public.products set price=8820 where slug='everyday-denim';
update public.products set price=10800 where slug='court-sneaker';
update public.products set price=15120 where slug='utility-overshirt';
update public.products set price=10620 where slug='wide-leg-trouser';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('products','products',true,4194304,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public=true,file_size_limit=4194304,allowed_mime_types=excluded.allowed_mime_types;
