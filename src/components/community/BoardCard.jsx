import { Image } from '@/components/ui/image';

export default function BoardCard({board,imageCount,selected,onClick}){
 return <button onClick={onClick} className={`overflow-hidden text-left ${selected?'bg-black text-white':'border border-black/15 bg-background'}`}>
  <Image src={board.images[0]} alt={`${board.title} cover`} className="aspect-[16/9] w-full"/>
  <div className="p-5">
   <h3 className="text-2xl font-semibold">{board.title}</h3>
   <div className="mt-4 flex items-center justify-between gap-4">
    <div className="flex -space-x-2">{board.contributors.slice(0,4).map(person=><Image key={person.name} src={person.avatar} alt={person.name} title={person.name} className="h-8 w-8 rounded-full border-2 border-background"/>)}</div>
    <p className="text-xs uppercase tracking-[.12em] opacity-60">{board.contributors.length} contributors · {imageCount} images</p>
   </div>
  </div>
 </button>
}