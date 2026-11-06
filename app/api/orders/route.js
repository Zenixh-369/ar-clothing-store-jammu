import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {getProduct} from '../../../lib/catalog';
import {formatPrice} from '../../../lib/products';
import {productImageUrl} from '../../../lib/image-url';

const clean=(value,max=180)=>typeof value==='string'?value.trim().slice(0,max):'';
export const dynamic='force-dynamic';

export async function POST(request){
  try{
    const body=await request.json();
    const customerInput=body.customer||{};
    const customer={name:clean(customerInput.name,100),email:clean(customerInput.email,160),street:clean(customerInput.street),city:clean(customerInput.city,100),postal:clean(customerInput.postal,30),country:clean(customerInput.country,100)};
    const paymentMethod=clean(customerInput.paymentMethod,40);
    if(!customer.name||!customer.street||!customer.city||!customer.postal||!customer.country||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))return NextResponse.json({error:'Enter a valid name, email, and complete shipping address.'},{status:400});
    if(!['UPI','Cash on delivery','Online payment link'].includes(paymentMethod))return NextResponse.json({error:'Choose a payment preference.'},{status:400});
    if(!Array.isArray(body.items)||body.items.length<1||body.items.length>30)return NextResponse.json({error:'Your bag is empty or contains too many items.'},{status:400});
    const items=[];
    for(const entry of body.items){
      if(!entry||typeof entry!=='object')return NextResponse.json({error:'One of the selected items is invalid.'},{status:400});
      const product=await getProduct(clean(entry.slug,100));
      const size=clean(entry.size,12).toUpperCase();
      const quantity=Number(entry.quantity||1);
      const validSizes=product?.sizeType==='footwear'?['6','7','8','9','10','11','12']:product?.sizeType==='one-size'?['ONE']:['XS','S','M','L','XL'];
      if(!product||!validSizes.includes(size)||!Number.isInteger(quantity)||quantity<1||quantity>10)return NextResponse.json({error:'One of the selected items is invalid. Please refresh your bag.'},{status:400});
      items.push({...product,size,quantity});
    }
    const subtotal=items.reduce((sum,item)=>sum+Number(item.price)*item.quantity,0);
    const orderId=randomUUID();
    const lines=items.map((product,index)=>`${index+1}. ${product.name} · size ${product.size} · qty ${product.quantity} · ${formatPrice(product.price*product.quantity)}\nPhoto: ${productImageUrl(product.image,1000)}`).join('\n\n');
    const address=[customer.street,`${customer.city} ${customer.postal}`,customer.country].join(', ');
    const message=`Hello AR Clothing, I would like to confirm order ${orderId.slice(0,8).toUpperCase()}.\n\n${lines}\n\nSubtotal: ${formatPrice(subtotal)}\n\nPreferred payment: ${paymentMethod}\n\nShip to:\n${customer.name}\n${address}\nEmail: ${customer.email}`;
    const phone=(process.env.WHATSAPP_PHONE||'918899279169').replace(/\D/g,'');
    return NextResponse.json({orderId,whatsappUrl:`https://wa.me/${phone}?text=${encodeURIComponent(message)}`},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error.message||'We could not prepare your WhatsApp order. Please try again.'},{status:500})}
}
