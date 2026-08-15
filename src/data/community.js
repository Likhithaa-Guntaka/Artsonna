import { creatives } from '@/data/marketplace';
const work=(person,index)=>creatives[person].work[index].image;
const u=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;
const p=id=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;
const avatar=(name,id)=>({name,avatar:u(id)});
export const communityEvents=[
 {id:'lower-manhattan-photo-walk',title:'Lower Manhattan Photo Walk',date:'Aug 23',time:'5:30 PM',location:'Seaport',type:'Offline',attending:84,series:'Lower Manhattan Photo Walk',frequency:'Monthly',pastAttendance:412,usualAttendance:76,image:p('15627313'),imagePosition:'center 44%',description:'Follow golden-hour light through the Seaport and along the East River with photographers from across the city.'},
 {id:'open-portfolio-review',title:'Open Portfolio Review',date:'Aug 28',time:'7:00 PM',location:'Online',type:'Online',attending:126,series:'Open Portfolio Review',frequency:'Monthly',image:p('9853291'),imagePosition:'center 46%',description:'Bring a focused portfolio edit for thoughtful table-style feedback from working New York creatives.'},
 {id:'brooklyn-type-night',title:'Brooklyn Type Night',date:'Sep 4',time:'6:30 PM',location:'DUMBO',type:'Offline',attending:58,series:'Brooklyn Type Night',frequency:'Monthly',pastAttendance:638,usualAttendance:54,image:p('6621008'),imagePosition:'center 50%',description:'An evening of letterforms, editorial systems, printed matter, and informal critique in DUMBO.'},
 {id:'golden-hour-portrait-meetup',title:'Golden Hour Portrait Meetup',date:'Aug 30',time:'4:00 PM',location:'Central Park',type:'Offline',attending:42,image:p('30313312'),imagePosition:'center 38%',description:'A relaxed outdoor portrait session built around backlight, natural movement, and late-summer color.'},
 {id:'analog-film-swap',title:'Analog Film Swap & Talk',date:'Sep 10',time:'6:00 PM',location:'Williamsburg',type:'Offline',attending:31,series:'Analog Film Swap & Talk',frequency:'Bi-monthly',pastAttendance:89,usualAttendance:35,image:p('37204678'),imagePosition:'center 52%',description:'Trade film stocks, compare scans, and share practical notes on cameras, labs, and 35mm workflows.'},
 {id:'beauty-editorial-makeup',title:'Beauty & Editorial Makeup Workshop',date:'Sep 6',time:'1:00 PM',location:'Chelsea',type:'Offline',attending:23,image:p('32016948'),imagePosition:'center 32%',description:'A close-up workshop on skin, color, texture, and camera-ready editorial makeup techniques.'}
];
export const boards=[
 {id:'nyc-editorial',title:'NYC Editorial Inspo',description:'High-fashion references, moody lighting, and magazine-style compositions.',contributors:[avatar('Sofia Reyes','1494790108377-be9c29b29330'),avatar('Deja Marsh','1531123897727-8f129e1688ce'),avatar('Lena Petrova','1544005313-94ddf0286df2')],images:['37945794','38092023','18990151','19049238','18423394','31321339','19222080','26589942'].map(p),imagePositions:['center 40%','center 32%','center 36%','center 45%','center 34%','center 38%','center 32%','center 35%']},
 {id:'y2k-styling',title:'Y2K Styling References',description:'Early-2000s fashion, bold color, and expressive streetwear.',contributors:[avatar('Micah Torres','1500648767791-00dcc994a43e'),avatar('Sofia Reyes','1494790108377-be9c29b29330'),avatar('Deja Marsh','1531123897727-8f129e1688ce')],images:['30995415','20417830','31421104','30737606','19394802','19371097','28871554','3344372'].map(p),imagePositions:['center 35%','center 36%','center 32%','center 32%','center 36%','center 35%','center 34%','center 34%']},
 {id:'golden-hour-light',title:'Golden Hour & Natural Light',description:'Outdoor portrait and lifestyle photography shaped by natural light.',contributors:[avatar('Ravi Desai','1507003211169-0a1dd7228f2d'),avatar('Odessa Blume','1534528741775-53994a69daeb'),avatar('Maya Chen','1494790108377-be9c29b29330')],images:['34119691','29037458','31721842','38906586','32769415','36116888','30674285','30669397'].map(p),imagePositions:['center 32%','center 34%','center 31%','center 36%','center 33%','center 32%','center 34%','center 35%']},
 {id:'set-design',title:'Set Design & Still Life',description:'Product and set styling references with minimal, color-blocked compositions.',contributors:[avatar('Sam Whitfield','1506794778202-cad84cf45f1d'),avatar('Studio North','1497366754035-f200968a6e72'),avatar('Jules Martinez','1519345182560-3f2917c472ef')],images:['8166432','7630463','7630079','7630465','7631196','7307726','7630083','7630761'].map(p),imagePositions:['center','center','center','center','center','center','center','center']},
 {id:'motion-music-video',title:'Motion & Music Video Stills',description:'Cinematic frame grabs and lighting references for music video work.',contributors:[avatar('The Hollow Collective','1524504388940-b1c1722653e1'),avatar('Leo Zhang','1507003211169-0a1dd7228f2d'),avatar('Camila Torres','1534528741775-53994a69daeb')],images:['8041225','7715618','5488369','5642756','5642755','2510424','10468192','2510429'].map(p),imagePositions:['center 42%','center 42%','center 40%','center 44%','center 40%','center 42%','center 40%','center 42%']}
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
 {id:'post-2',circle_id:'film-photo',author_name:'Maya Chen',message:'Just finished this editorial. I’m looking for feedback on whether the edit needs one quieter frame.'},
 {id:'post-3',circle_id:'motion-design',author_name:'Noah Feld',message:'Need a PA for a music video Tuesday in Queens. Small crew, late exterior.'},
 {id:'post-4',circle_id:'fashion-stylists',author_name:'Sarah Kim',message:'Looking for a makeup artist for a beauty test Sunday on the Lower East Side.'},
 {id:'post-5',circle_id:'fashion-stylists',author_name:'Talia Brooks',message:'I have a rack of samples available for one test shoot next week, mostly natural fabrics and soft tailoring.'}
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