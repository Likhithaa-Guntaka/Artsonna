import { creatives } from '@/data/marketplace';
const work=(person,index)=>creatives[person].work[index].image;
export const boards=[
 {id:'nyc-editorial',title:'Downtown Editorial References',description:'Flash, casting, grain, movement, and locations for an upcoming Chinatown night shoot.',tags:['Editorial','Photography'],contributors:18,images:[work(0,1),work(2,3),work(4,1),work(0,4)]},
 {id:'styling-process',title:'Fittings, Racks & Details',description:'Garment construction, fittings, hardware, and the useful mess behind a finished look.',tags:['Fashion','Styling'],contributors:12,images:[work(2,1),work(9,1),work(2,2),work(4,2)]},
 {id:'small-film-crews',title:'Small Film Crew Notes',description:'Camera tests, practical light, production stills, and location ideas for tiny crews.',tags:['Film','BTS'],contributors:15,images:[work(1,1),work(12,2),work(1,3),work(8,4)]},
 {id:'print-in-progress',title:'Print in Progress',description:'Risograph proofs, type sketches, paper tests, and layouts before they become polished.',tags:['Design','Print'],contributors:9,images:[work(3,1),work(3,3),work(7,5),work(11,2)]}
];
export const spotlights=[
 {...creatives[0],workingOn:'A portrait series about the people keeping Brooklyn venues alive after midnight.',nextCollab:'A set designer who likes building strange, temporary worlds.'},
 {...creatives[3],workingOn:'A neighborhood type archive built from hand-painted signs across the Bronx.',nextCollab:'An animator who can make letterforms move with personality.'}
];
export const circles=[
 {id:'film-photo',name:'Film Photographers of NYC',description:'A small group for film stocks, darkrooms, photo walks, and honest critique.',tags:['Film','Photography'],memberCount:46,members:[creatives[0],creatives[6],creatives[13]]},
 {id:'motion-design',name:'Motion Designers Circle',description:'Monthly conversations about movement, sound, tools, and works in progress.',tags:['Motion','Design','Video'],memberCount:31,members:[creatives[1],creatives[11],creatives[12]]},
 {id:'fashion-stylists',name:'Fashion Stylists Collective',description:'Reference swaps, sourcing knowledge, and peer support for NYC stylists.',tags:['Fashion','Styling','Editorial'],memberCount:38,members:[creatives[2],creatives[4],creatives[9]]}
];
export const samplePosts=[
 {id:'post-1',circle_id:'film-photo',author_name:'Devon Price',message:'Anyone shooting 35mm around Chinatown this weekend? I want to compare scans after.'},
 {id:'post-2',circle_id:'film-photo',author_name:'Maya Chen',message:'Just finished this editorial — looking for feedback on whether the edit needs one quieter frame.'},
 {id:'post-3',circle_id:'motion-design',author_name:'Noah Feld',message:'Need a PA for a music video Tuesday in Queens. Small crew, late exterior.'},
 {id:'post-4',circle_id:'fashion-stylists',author_name:'Sarah Kim',message:'Looking for a makeup artist for a beauty test Sunday on the Lower East Side.'},
 {id:'post-5',circle_id:'fashion-stylists',author_name:'Talia Brooks',message:'I have a rack of samples available for one test shoot next week — mostly natural fabrics and soft tailoring.'}
];
export const weeklyPrompt={id:'one-color',eyebrow:'This week',title:'Make something using only one color',description:'Shoot, style, draw, or design one piece. Share the constraint and what it unlocked.'};
export const sampleSubmissions=[
 {id:'sample-blue',creator_name:'Maya Chen',creator_image:creatives[0].portrait,file_url:work(0,3),caption:'Blue hour, without correcting the cast.',sampleComment:'The tonal restraint makes the light feel intentional.'},
 {id:'sample-red',creator_name:'Andre Williams',creator_image:creatives[3].portrait,file_url:work(3,1),caption:'A red-only risograph proof.',sampleComment:'The paper texture keeps one color from feeling flat.'}
];
export const sampleMentors=[
 {...creatives[5],mentor_blurb:'I can help with pitching concepts, directing collaborators, and building a clear treatment.'},
 {...creatives[1],mentor_blurb:'Happy to talk through pre-production, small crews, and shaping a reel.'}
];