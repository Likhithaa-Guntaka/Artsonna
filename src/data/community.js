import { creatives } from '@/data/marketplace';
export const boards=[
 {id:'nyc-editorial',title:'NYC Editorial Inspo',description:'Casting, light, texture, and locations shaping current editorial work.',tags:['Editorial','Photography'],contributors:18,images:['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85']},
 {id:'y2k-styling',title:'Y2K Styling References',description:'Silhouettes, color stories, accessories, and beauty references from the turn of the century.',tags:['Fashion','Styling'],contributors:12,images:['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85']}
];
export const spotlights=[
 {...creatives[0],workingOn:'A portrait series about the people keeping Brooklyn venues alive after midnight.',nextCollab:'A set designer who likes building strange, temporary worlds.'},
 {...creatives[4],workingOn:'A neighborhood type archive built from hand-painted signs across the Bronx.',nextCollab:'An animator who can make letterforms move with personality.'}
];
export const circles=[
 {id:'film-photo',name:'Film Photographers of NYC',description:'A small group for film stocks, darkrooms, photo walks, and honest critique.',tags:['Film','Photography'],memberCount:46,members:[creatives[0],creatives[1],creatives[5]]},
 {id:'motion-design',name:'Motion Designers Circle',description:'Monthly conversations about movement, sound, tools, and works in progress.',tags:['Motion','Design','Video'],memberCount:31,members:[creatives[1],creatives[4],creatives[5]]},
 {id:'fashion-stylists',name:'Fashion Stylists Collective',description:'Reference swaps, sourcing knowledge, and peer support for NYC stylists.',tags:['Fashion','Styling','Editorial'],memberCount:38,members:[creatives[2],creatives[3],creatives[0]]}
];
export const weeklyPrompt={id:'one-color',eyebrow:'This week',title:'Make something using only one color',description:'Shoot, style, draw, or design one piece. Share the constraint and what it unlocked.'};
export const sampleSubmissions=[
 {id:'sample-blue',creator_name:'Maya Chen',creator_image:creatives[0].portrait,file_url:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',caption:'Blue hour, without correcting the cast.',sampleComment:'The tonal restraint makes the light feel intentional.'},
 {id:'sample-red',creator_name:'Andre Williams',creator_image:creatives[4].portrait,file_url:'https://images.unsplash.com/photo-1518568740560-333139a27e72?auto=format&fit=crop&w=900&q=85',caption:'A red-only poster study.',sampleComment:'Love how the texture keeps one color from feeling flat.'}
];
export const sampleMentors=[
 {...creatives[5],mentor_blurb:'I can help with pitching concepts, directing collaborators, and building a clear treatment.'},
 {...creatives[1],mentor_blurb:'Happy to talk through pre-production, small crews, and shaping a reel.'}
];