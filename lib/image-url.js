export function productImageUrl(image,width=900){
  if(!image)return '';
  if(/^https?:\/\//i.test(image))return image;
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
}
