'use client';

import {useCallback,useEffect,useMemo,useState} from 'react';

const categories=['Menswear','Womenswear','Tops','Bottomwear','Jackets','Footwear','Accessories'];
const collections=['menswear','womenswear','tops','bottomwear','jackets','footwear','accessories','new-arrivals'];
const currency=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
const blankProduct={slug:'',name:'',category:'Tops',collections:[],price:'',description:'',material:'',color:'',badge:'',image:'',featured:false,newArrival:false,sizeType:'standard'};
const slugify=value=>value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function AdminPage(){
  const [authorized,setAuthorized]=useState(false);
  const [password,setPassword]=useState('');
  const [products,setProducts]=useState([]);
  const [query,setQuery]=useState('');
  const [draft,setDraft]=useState(null);
  const [editing,setEditing]=useState('');
  const [busy,setBusy]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');

  const load=useCallback(async()=>{
    const response=await fetch('/api/admin/products',{cache:'no-store'});
    const data=await response.json();
    if(response.status===401){setAuthorized(false);return;}
    if(!response.ok)throw new Error(data.error||'Could not load products.');
    setProducts(data.products);
    setAuthorized(true);
  },[]);

  useEffect(()=>{load().catch(exception=>setError(exception.message));},[load]);

  const visibleProducts=useMemo(()=>products.filter(product=>`${product.name} ${product.category} ${product.slug}`.toLowerCase().includes(query.toLowerCase())),[products,query]);

  async function signIn(event){
    event.preventDefault();setBusy(true);setError('');
    try{
      const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Could not sign in.');
      setPassword('');
      await load();
    }catch(exception){setError(exception.message)}finally{setBusy(false)}
  }

  async function signOut(){
    await fetch('/api/admin/logout',{method:'POST'});
    setAuthorized(false);setProducts([]);setDraft(null);
  }

  function startNew(){setEditing('');setDraft({...blankProduct});setError('');setNotice('')}
  function startEdit(product){setEditing(product.slug);setDraft({...product,collections:[...(product.collections||[])]});setError('');setNotice('')}
  function update(field,value){setDraft(current=>({...current,[field]:value,...(field==='name'&&!editing?{slug:slugify(value)}:{})}))}
  function toggleCollection(value){
    setDraft(current=>({...current,collections:current.collections.includes(value)?current.collections.filter(item=>item!==value):[...current.collections,value]}));
  }

  async function uploadImage(file){
    if(!file)return;
    setUploading(true);setError('');
    try{
      const form=new FormData();form.append('image',file);
      const response=await fetch('/api/admin/upload',{method:'POST',body:form});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Image upload failed.');
      update('image',data.url);setNotice('Image uploaded. Save the product to publish it.');
    }catch(exception){setError(exception.message)}finally{setUploading(false)}
  }

  async function saveProduct(event){
    event.preventDefault();setBusy(true);setError('');setNotice('');
    try{
      const method=editing?'PATCH':'POST';
      const url=editing?`/api/admin/products/${encodeURIComponent(editing)}`:'/api/admin/products';
      const response=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(draft)});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Could not save product.');
      await load();setDraft(null);
      setNotice(editing?'Product updated and synced to the storefront.':'Product added and synced to the storefront.');
    }catch(exception){setError(exception.message)}finally{setBusy(false)}
  }

  async function deleteProduct(product){
    if(!window.confirm(`Delete “${product.name}” from the catalog?`))return;
    setError('');
    try{
      const response=await fetch(`/api/admin/products/${encodeURIComponent(product.slug)}`,{method:'DELETE'});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Could not delete product.');
      await load();setNotice('Product deleted from the live catalog.');
    }catch(exception){setError(exception.message)}
  }

  if(!authorized)return <div className="admin-login"><div className="admin-login-card"><span className="admin-kicker">AR CLOTHING / STORE MANAGEMENT</span><h1>Welcome <em>back.</em></h1><p>Sign in to manage the products shown in your live store.</p><form onSubmit={signIn}><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event=>setPassword(event.target.value)} required/><button className="admin-primary" disabled={busy}>{busy?'Signing in…':'Sign in'} <span>↗</span></button></form>{error&&<p className="admin-error" role="alert">{error}</p>}<a className="admin-store-link" href="/">← Return to store</a></div></div>;

  return <div className="admin-shell">
    <header className="admin-topbar"><a className="admin-brand" href="/">AR <span>/</span> ADMIN</a><div><a href="/" target="_blank" rel="noreferrer">View live store ↗</a><button onClick={signOut}>Sign out</button></div></header>
    <section className="admin-content">
      <div className="admin-heading"><div><span className="admin-kicker">STORE MANAGEMENT / CATALOG</span><h1>Your <em>products.</em></h1><p>Changes save to your shared catalog and appear on the storefront.</p></div><button className="admin-primary" onClick={startNew}>Add product <span>＋</span></button></div>
      {error&&<p className="admin-error" role="alert">{error}</p>}{notice&&<p className="admin-notice" role="status">{notice}</p>}
      <div className="admin-toolbar"><label className="admin-search"><span>⌕</span><input aria-label="Search products" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search your catalog"/></label><span>{products.length} products in catalog</span></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Store status</th><th/></tr></thead><tbody>{visibleProducts.map(product=><tr key={product.slug}><td><div className="admin-product-cell"><img src={/^https?:\/\//i.test(product.image)?product.image:`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=120&q=75`} alt=""/><span><strong>{product.name}</strong><small>/{product.slug}</small></span></div></td><td>{product.category}</td><td>{currency.format(product.price)}</td><td><span className={`admin-status ${product.featured?'active':''}`}>{product.featured?'Featured':'Published'}</span></td><td><button className="admin-edit" onClick={()=>startEdit(product)}>Edit</button><button className="admin-delete" onClick={()=>deleteProduct(product)}>Delete</button></td></tr>)}</tbody></table>{visibleProducts.length===0&&<p className="admin-empty">No products match that search.</p>}</div>
    </section>
    {draft&&<div className="admin-modal-backdrop" role="presentation" onMouseDown={event=>event.target===event.currentTarget&&setDraft(null)}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-editor-title"><header><div><span className="admin-kicker">CATALOG EDITOR</span><h2 id="product-editor-title">{editing?'Edit product':'Add a product'}</h2></div><button className="admin-close" onClick={()=>setDraft(null)} aria-label="Close">×</button></header>
      <form onSubmit={saveProduct}><div className="admin-form-grid">
        <label>Product name<input required maxLength="100" value={draft.name} onChange={event=>update('name',event.target.value)}/></label>
        <label>URL slug<input required maxLength="100" value={draft.slug} onChange={event=>update('slug',slugify(event.target.value))}/></label>
        <label>Price (INR)<input required type="number" min="1" step="1" value={draft.price} onChange={event=>update('price',event.target.value)}/></label>
        <label>Category<select value={draft.category} onChange={event=>update('category',event.target.value)}>{categories.map(category=><option key={category} value={category}>{category}</option>)}</select></label>
        <label>Color<input maxLength="80" value={draft.color} onChange={event=>update('color',event.target.value)}/></label>
        <label>Material<input maxLength="160" value={draft.material} onChange={event=>update('material',event.target.value)}/></label>
        <label className="admin-field-wide">Product description<textarea rows="3" maxLength="1500" value={draft.description} onChange={event=>update('description',event.target.value)}/></label>
        <label>Badge<input maxLength="80" placeholder="New, Just in…" value={draft.badge} onChange={event=>update('badge',event.target.value)}/></label>
        <label>Size type<select value={draft.sizeType||'standard'} onChange={event=>update('sizeType',event.target.value)}><option value="standard">Standard clothing sizes</option><option value="one-size">One size</option><option value="footwear">Footwear sizes</option></select></label>
        <div className="admin-field-wide admin-collections"><span>Collections</span><div>{collections.map(value=><label key={value}><input type="checkbox" checked={draft.collections.includes(value)} onChange={()=>toggleCollection(value)}/>{value.replaceAll('-',' ')}</label>)}</div></div>
        <label className="admin-field-wide">Product image URL<input value={draft.image} onChange={event=>update('image',event.target.value)} placeholder="Paste an image URL or upload below" required/></label>
        <label className="admin-upload admin-field-wide">Upload image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event=>uploadImage(event.target.files?.[0])}/><small>{uploading?'Uploading image…':'JPG, PNG, WebP or AVIF · 4 MB max'}</small></label>
        <div className="admin-field-wide admin-flags"><label><input type="checkbox" checked={draft.featured} onChange={event=>update('featured',event.target.checked)}/>Show in featured collection</label><label><input type="checkbox" checked={draft.newArrival} onChange={event=>update('newArrival',event.target.checked)}/>Mark as new arrival</label></div>
      </div>{error&&<p className="admin-error" role="alert">{error}</p>}<footer><button type="button" className="admin-secondary" onClick={()=>setDraft(null)}>Cancel</button><button className="admin-primary" disabled={busy||uploading}>{busy?'Saving…':editing?'Save product':'Add to catalog'}</button></footer></form>
    </section></div>}
  </div>;
}
