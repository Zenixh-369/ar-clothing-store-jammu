import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {getProduct} from '../../../lib/catalog';
import {formatPrice,getProductImages} from '../../../lib/products';
import {productImageUrl} from '../../../lib/image-url';

const clean=(value,max=180)=>typeof value==='string'?value.trim().slice(0,max):'';
export const dynamic='force-dynamic';

export async function POST(request){
  try{
    const body=await request.json();
    const customerInput=body.customer||{};
    const customer={name:clean(customerInput.name,100),phone:clean(customerInput.phone,30),street:clean(customerInput.street),landmark:clean(customerInput.landmark,140),city:clean(customerInput.city,100),state:clean(customerInput.state,100),postal:clean(customerInput.postal,30),country:'India',mapUrl:clean(customerInput.mapUrl,500)};
    const paymentMethod=clean(customerInput.paymentMethod,40);
    if(!customer.name||!customer.phone||!customer.street||!customer.city||!customer.state||!customer.postal)return NextResponse.json({error:'Enter a valid name, phone number, and complete shipping address in India.'},{status:400});
    if(!['UPI','Cash on delivery','Online payment link'].includes(paymentMethod))return NextResponse.json({error:'Choose a payment preference.'},{status:400});
    if(!Array.isArray(body.items)||body.items.length<1||body.items.length>30)return NextResponse.json({error:'Your bag is empty or contains too many items.'},{status:400});
    const items=[];
    for(const entry of body.items){
      if(!entry||typeof entry!=='object')return NextResponse.json({error:'One of the selected items is invalid.'},{status:400});
      const product=await getProduct(clean(entry.slug,100));
      const size=clean(entry.size,12).toUpperCase();
      const quantity=Number(entry.quantity||1);
      const validSizes=product?.sizeType==='footwear'?['6','7','8','9','10','11','12']:product?.sizeType==='one-size'?['ONE']:['XS','S','M','L','XL'];
      const requestedColor=clean(entry.color,80);
      const selectedColor=product?.variants?.some(variant=>variant.color===requestedColor)?requestedColor:product?.color;
      const validImages=getProductImages(product,selectedColor);
      const selectedImage=validImages.includes(entry.image)?entry.image:validImages[0]||product?.image;
      if(!product||!validSizes.includes(size)||!Number.isInteger(quantity)||quantity<1||quantity>10)return NextResponse.json({error:'One of the selected items is invalid. Please refresh your bag.'},{status:400});
      items.push({...product,color:selectedColor,image:selectedImage,size,quantity});
    }
    const subtotal=items.reduce((sum,item)=>sum+Number(item.price)*item.quantity,0);
    const orderId=randomUUID();
    const lines=items.map((product,index)=>`${index+1}. ${product.name} · color ${product.color} · size ${product.size} · qty ${product.quantity} · ${formatPrice(product.price*product.quantity)}\nPhoto: ${productImageUrl(product.image,1000)}`).join('\n\n');
    const address=[customer.street,customer.landmark&&`Landmark: ${customer.landmark}`,customer.city,customer.state,customer.postal,customer.country].filter(Boolean).join(', ');
    const location=customer.mapUrl?`\nMap pin: ${customer.mapUrl}`:'';
    const message=`Hello AR Clothing, I would like to confirm order ${orderId.slice(0,8).toUpperCase()}.\n\n${lines}\n\nSubtotal: ${formatPrice(subtotal)}\n\nPreferred payment: ${paymentMethod}\n\nShip to:\n${customer.name}\nPhone: ${customer.phone}\n${address}${location}`;
    const phone=(process.env.WHATSAPP_PHONE||'').replace(/\D/g,'');
    if(!phone)return NextResponse.json({error:'WhatsApp checkout is not configured.'},{status:503});
    return NextResponse.json({orderId,whatsappUrl:`https://wa.me/${phone}?text=${encodeURIComponent(message)}`},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error.message||'We could not prepare your WhatsApp order. Please try again.'},{status:500})}
}
